const HOLIDAY_CACHE_PREFIX = "simple-calendar:holiday-cache";
const NAGER_DATE_BASE_URL = "https://date.nager.at/api/v4/Holidays";

export function buildHolidayApiUrl({ countryCode, year }) {
  return `${NAGER_DATE_BASE_URL}/${encodeURIComponent(countryCode)}/${encodeURIComponent(year)}`;
}

export function createMemoryStorage() {
  const data = new Map();
  return {
    getItem(key) {
      return data.has(key) ? data.get(key) : null;
    },
    setItem(key, value) {
      data.set(key, String(value));
    },
    removeItem(key) {
      data.delete(key);
    },
  };
}

export function holidayCacheKey({ countryCode, year }) {
  return `${HOLIDAY_CACHE_PREFIX}:${countryCode}:${year}`;
}

export function loadHolidayCache(storage, { countryCode, year }) {
  try {
    const raw = storage?.getItem?.(holidayCacheKey({ countryCode, year }));
    if (!raw) {
      return null;
    }
    const parsed = JSON.parse(raw);
    if (
      parsed?.countryCode !== countryCode ||
      parsed?.year !== year ||
      !Array.isArray(parsed?.rows) ||
      typeof parsed?.updatedAt !== "string"
    ) {
      return null;
    }
    return parsed;
  } catch {
    return null;
  }
}

export function saveHolidayCache(storage, { countryCode, year, rows, updatedAt }) {
  if (!storage?.setItem || !Array.isArray(rows)) {
    return;
  }

  storage.setItem(
    holidayCacheKey({ countryCode, year }),
    JSON.stringify({
      countryCode,
      year,
      rows,
      updatedAt,
    }),
  );
}

export async function syncHolidayYear({
  countryCode,
  year,
  storage,
  fetcher = globalThis.fetch,
  now = () => new Date().toISOString(),
}) {
  const cached = loadHolidayCache(storage, { countryCode, year });

  try {
    if (typeof fetcher !== "function") {
      throw new Error("fetch unavailable");
    }

    const response = await fetcher(buildHolidayApiUrl({ countryCode, year }), {
      headers: { accept: "application/json" },
    });

    if (!response?.ok) {
      throw new Error(`HTTP ${response?.status ?? "error"}`);
    }

    const rows = await response.json();
    if (!Array.isArray(rows)) {
      throw new Error("Unexpected API response");
    }

    const updatedAt = now();
    saveHolidayCache(storage, { countryCode, year, rows, updatedAt });

    return {
      source: "network",
      countryCode,
      year,
      rows,
      updatedAt,
      warning: "",
    };
  } catch (error) {
    if (cached) {
      return {
        source: "cache",
        countryCode,
        year,
        rows: cached.rows,
        updatedAt: cached.updatedAt,
        warning: error instanceof Error ? error.message : "Update failed",
      };
    }

    return {
      source: "error",
      countryCode,
      year,
      rows: [],
      updatedAt: "",
      warning: error instanceof Error ? error.message : "Update failed",
    };
  }
}
