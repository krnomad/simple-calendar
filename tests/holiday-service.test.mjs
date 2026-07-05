import test from "node:test";
import assert from "node:assert/strict";

import {
  buildHolidayApiUrl,
  createMemoryStorage,
  loadHolidayCache,
  saveHolidayCache,
  syncHolidayYear,
} from "../src/holiday-service.mjs";

test("buildHolidayApiUrl targets Nager.Date v4 by country and year", () => {
  assert.equal(
    buildHolidayApiUrl({ countryCode: "KR", year: 2026 }),
    "https://date.nager.at/api/v4/Holidays/KR/2026",
  );
});

test("holiday cache persists raw rows with an update timestamp", () => {
  const storage = createMemoryStorage();
  const rows = [{ date: "2026-01-01", name: "New Year's Day", countryCode: "KR" }];

  saveHolidayCache(storage, {
    countryCode: "KR",
    year: 2026,
    rows,
    updatedAt: "2026-07-05T00:00:00.000Z",
  });

  assert.deepEqual(loadHolidayCache(storage, { countryCode: "KR", year: 2026 }), {
    countryCode: "KR",
    year: 2026,
    rows,
    updatedAt: "2026-07-05T00:00:00.000Z",
  });
});

test("syncHolidayYear returns fresh API rows when the network succeeds", async () => {
  const storage = createMemoryStorage();

  const result = await syncHolidayYear({
    countryCode: "JP",
    year: 2026,
    storage,
    now: () => "2026-07-05T01:02:03.000Z",
    fetcher: async () => ({
      ok: true,
      json: async () => [{ date: "2026-01-01", name: "New Year's Day", countryCode: "JP" }],
    }),
  });

  assert.equal(result.source, "network");
  assert.equal(result.updatedAt, "2026-07-05T01:02:03.000Z");
  assert.equal(result.rows[0].countryCode, "JP");
  assert.equal(loadHolidayCache(storage, { countryCode: "JP", year: 2026 }).rows.length, 1);
});

test("syncHolidayYear falls back to cached rows when the network fails", async () => {
  const storage = createMemoryStorage();
  saveHolidayCache(storage, {
    countryCode: "CN",
    year: 2026,
    rows: [{ date: "2026-02-17", name: "Chinese New Year", countryCode: "CN" }],
    updatedAt: "2026-01-01T00:00:00.000Z",
  });

  const result = await syncHolidayYear({
    countryCode: "CN",
    year: 2026,
    storage,
    fetcher: async () => {
      throw new Error("offline");
    },
  });

  assert.equal(result.source, "cache");
  assert.equal(result.warning, "offline");
  assert.equal(result.updatedAt, "2026-01-01T00:00:00.000Z");
  assert.equal(result.rows[0].name, "Chinese New Year");
});
