import test from "node:test";
import assert from "node:assert/strict";

import {
  buildMonthMatrix,
  getLocaleConfig,
  getMonthLabel,
  normalizeHolidayApi,
  resolveCountryForLocale,
} from "../src/calendar-core.mjs";

test("buildMonthMatrix creates a stable 6-week Sunday-start grid", () => {
  const cells = buildMonthMatrix({ year: 2026, monthIndex: 0, firstDay: 0 });

  assert.equal(cells.length, 42);
  assert.equal(cells[0].isoDate, "2025-12-28");
  assert.equal(cells.at(-1).isoDate, "2026-02-07");

  const newYear = cells.find((cell) => cell.isoDate === "2026-01-01");
  assert.equal(newYear.currentMonth, true);
  assert.equal(newYear.weekday, 4);
});

test("normalizeHolidayApi groups multiple public holidays by ISO date", () => {
  const holidays = normalizeHolidayApi(
    [
      {
        date: "2026-01-01",
        localName: "신정",
        name: "New Year's Day",
        countryCode: "KR",
        types: ["Public"],
      },
      {
        date: "2026-01-01",
        localName: "Another Local Name",
        name: "Second Holiday",
        countryCode: "KR",
        types: ["Bank"],
      },
    ],
    "ko",
  );

  assert.deepEqual(holidays["2026-01-01"].map((holiday) => holiday.label), [
    "신정",
    "Another Local Name",
  ]);
  assert.deepEqual(holidays["2026-01-01"].map((holiday) => holiday.types), [
    ["Public"],
    ["Bank"],
  ]);
});

test("normalizeHolidayApi prefers English holiday names for English UI", () => {
  const holidays = normalizeHolidayApi(
    [
      {
        date: "2026-01-01",
        localName: "신정",
        name: "New Year's Day",
        countryCode: "KR",
        types: ["Public"],
      },
    ],
    "en",
  );

  assert.equal(holidays["2026-01-01"][0].label, "New Year's Day");
});

test("locale configuration supports Korean, English, Japanese, and Chinese", () => {
  assert.equal(getLocaleConfig("ko").languageName, "한국어");
  assert.equal(getLocaleConfig("en").languageName, "English");
  assert.equal(getLocaleConfig("ja").languageName, "日本語");
  assert.equal(getLocaleConfig("zh").languageName, "中文");

  assert.equal(resolveCountryForLocale("ko"), "KR");
  assert.equal(resolveCountryForLocale("en"), "US");
  assert.equal(resolveCountryForLocale("ja"), "JP");
  assert.equal(resolveCountryForLocale("zh"), "CN");
});

test("getMonthLabel formats month headings for each supported UI language", () => {
  assert.equal(getMonthLabel(2026, 6, "ko"), "2026년 7월");
  assert.equal(getMonthLabel(2026, 6, "en"), "July 2026");
  assert.equal(getMonthLabel(2026, 6, "ja"), "2026年7月");
  assert.equal(getMonthLabel(2026, 6, "zh"), "2026年7月");
});
