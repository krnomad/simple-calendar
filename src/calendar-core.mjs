export const SUPPORTED_LOCALES = {
  ko: {
    code: "ko",
    languageName: "한국어",
    localeTag: "ko-KR",
    defaultCountry: "KR",
    firstDay: 0,
    weekdays: ["일", "월", "화", "수", "목", "금", "토"],
    monthLabel(year, monthIndex) {
      return `${year}년 ${monthIndex + 1}월`;
    },
  },
  en: {
    code: "en",
    languageName: "English",
    localeTag: "en-US",
    defaultCountry: "US",
    firstDay: 0,
    weekdays: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
    monthLabel(year, monthIndex) {
      return `${EN_MONTHS[monthIndex]} ${year}`;
    },
  },
  ja: {
    code: "ja",
    languageName: "日本語",
    localeTag: "ja-JP",
    defaultCountry: "JP",
    firstDay: 0,
    weekdays: ["日", "月", "火", "水", "木", "金", "土"],
    monthLabel(year, monthIndex) {
      return `${year}年${monthIndex + 1}月`;
    },
  },
  zh: {
    code: "zh",
    languageName: "中文",
    localeTag: "zh-CN",
    defaultCountry: "CN",
    firstDay: 0,
    weekdays: ["日", "一", "二", "三", "四", "五", "六"],
    monthLabel(year, monthIndex) {
      return `${year}年${monthIndex + 1}月`;
    },
  },
};

export const COUNTRIES = {
  KR: { code: "KR", names: { ko: "대한민국", en: "South Korea", ja: "韓国", zh: "韩国" } },
  US: { code: "US", names: { ko: "미국", en: "United States", ja: "米国", zh: "美国" } },
  JP: { code: "JP", names: { ko: "일본", en: "Japan", ja: "日本", zh: "日本" } },
  CN: { code: "CN", names: { ko: "중국", en: "China", ja: "中国", zh: "中国" } },
};

const EN_MONTHS = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

const ISO_DATE_PATTERN = /^\d{4}-\d{2}-\d{2}$/;

export function getLocaleConfig(language) {
  return SUPPORTED_LOCALES[language] ?? SUPPORTED_LOCALES.en;
}

export function getSupportedLanguages() {
  return Object.values(SUPPORTED_LOCALES);
}

export function getSupportedCountries(language = "en") {
  return Object.values(COUNTRIES).map((country) => ({
    code: country.code,
    label: country.names[language] ?? country.names.en,
  }));
}

export function resolveCountryForLocale(language) {
  return getLocaleConfig(language).defaultCountry;
}

export function getMonthLabel(year, monthIndex, language) {
  return getLocaleConfig(language).monthLabel(year, monthIndex);
}

export function todayIso() {
  return localDateToIso(new Date());
}

export function localDateToIso(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

export function isoFromParts(year, monthIndex, day) {
  const date = new Date(Date.UTC(year, monthIndex, day));
  return date.toISOString().slice(0, 10);
}

export function parseIsoDate(isoDate) {
  if (!ISO_DATE_PATTERN.test(isoDate)) {
    throw new Error(`Invalid ISO date: ${isoDate}`);
  }
  const [year, month, day] = isoDate.split("-").map(Number);
  return { year, monthIndex: month - 1, day };
}

export function buildMonthMatrix({ year, monthIndex, firstDay = 0 }) {
  const firstOfMonth = new Date(Date.UTC(year, monthIndex, 1));
  const startOffset = (firstOfMonth.getUTCDay() - firstDay + 7) % 7;
  const today = todayIso();
  const cells = [];

  for (let index = 0; index < 42; index += 1) {
    const cellDate = new Date(Date.UTC(year, monthIndex, 1 - startOffset + index));
    const cellYear = cellDate.getUTCFullYear();
    const cellMonthIndex = cellDate.getUTCMonth();
    const cellDay = cellDate.getUTCDate();
    const isoDate = isoFromParts(cellYear, cellMonthIndex, cellDay);

    cells.push({
      isoDate,
      year: cellYear,
      monthIndex: cellMonthIndex,
      day: cellDay,
      weekday: cellDate.getUTCDay(),
      currentMonth: cellMonthIndex === monthIndex,
      today: isoDate === today,
      weekend: cellDate.getUTCDay() === 0 || cellDate.getUTCDay() === 6,
    });
  }

  return cells;
}

export function normalizeHolidayApi(rows, language = "en") {
  if (!Array.isArray(rows)) {
    return {};
  }

  return rows.reduce((grouped, row) => {
    if (!row || typeof row.date !== "string" || !ISO_DATE_PATTERN.test(row.date)) {
      return grouped;
    }

    const types = Array.isArray(row.holidayTypes)
      ? row.holidayTypes
      : Array.isArray(row.types)
        ? row.types
        : [];
    const englishName = stringOrEmpty(row.name);
    const localName = stringOrEmpty(row.localName);
    const label = language === "en" ? englishName || localName : localName || englishName;
    const holiday = {
      date: row.date,
      label,
      name: englishName,
      localName,
      countryCode: stringOrEmpty(row.countryCode),
      nationalHoliday: Boolean(row.nationalHoliday ?? row.global ?? false),
      subdivisionCodes: Array.isArray(row.subdivisionCodes)
        ? row.subdivisionCodes
        : Array.isArray(row.counties)
          ? row.counties
          : [],
      types,
    };

    grouped[row.date] ??= [];
    grouped[row.date].push(holiday);
    return grouped;
  }, {});
}

export function shiftMonth(year, monthIndex, delta) {
  const shifted = new Date(Date.UTC(year, monthIndex + delta, 1));
  return {
    year: shifted.getUTCFullYear(),
    monthIndex: shifted.getUTCMonth(),
  };
}

export function sameMonthFromIso(isoDate) {
  const parsed = parseIsoDate(isoDate);
  return { year: parsed.year, monthIndex: parsed.monthIndex };
}

function stringOrEmpty(value) {
  return typeof value === "string" ? value : "";
}
