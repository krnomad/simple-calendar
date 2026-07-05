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

const HOLIDAY_NAME_TRANSLATIONS = {
  "New Year's Day": { ko: "새해 첫날", en: "New Year's Day", ja: "元日", zh: "元旦" },
  "Lunar New Year": { ko: "설날", en: "Lunar New Year", ja: "旧正月", zh: "农历新年" },
  "Independence Movement Day": {
    ko: "삼일절",
    en: "Independence Movement Day",
    ja: "三一節",
    zh: "三一节",
  },
  "Labour Day": { ko: "근로자의 날", en: "Labour Day", ja: "労働者の日", zh: "劳动节" },
  "Children's Day": { ko: "어린이날", en: "Children's Day", ja: "こどもの日", zh: "儿童节" },
  "Buddha's Birthday": { ko: "부처님 오신 날", en: "Buddha's Birthday", ja: "釈迦誕生日", zh: "佛诞节" },
  "Local Election Day": { ko: "지방선거일", en: "Local Election Day", ja: "地方選挙日", zh: "地方选举日" },
  "Memorial Day": { ko: "현충일", en: "Memorial Day", ja: "戦没者追悼記念日", zh: "阵亡将士纪念日" },
  "Constitution Day": { ko: "제헌절", en: "Constitution Day", ja: "憲法記念日", zh: "制宪节" },
  "Liberation Day": { ko: "광복절", en: "Liberation Day", ja: "光復節", zh: "光复节" },
  Chuseok: { ko: "추석", en: "Chuseok", ja: "秋夕", zh: "秋夕" },
  "National Foundation Day": { ko: "개천절", en: "National Foundation Day", ja: "開天節", zh: "开天节" },
  "Hangul Day": { ko: "한글날", en: "Hangul Day", ja: "ハングルの日", zh: "韩文日" },
  "Christmas Day": { ko: "크리스마스", en: "Christmas Day", ja: "クリスマス", zh: "圣诞节" },
  "Martin Luther King, Jr. Day": {
    ko: "마틴 루터 킹 주니어의 날",
    en: "Martin Luther King, Jr. Day",
    ja: "マーティン・ルーサー・キング・ジュニア記念日",
    zh: "马丁·路德·金纪念日",
  },
  "Lincoln's Birthday": { ko: "링컨 탄생일", en: "Lincoln's Birthday", ja: "リンカーン誕生日", zh: "林肯诞辰" },
  "Presidents Day": { ko: "대통령의 날", en: "Presidents Day", ja: "大統領の日", zh: "总统日" },
  "Good Friday": { ko: "성금요일", en: "Good Friday", ja: "聖金曜日", zh: "耶稣受难日" },
  "Truman Day": { ko: "트루먼의 날", en: "Truman Day", ja: "トルーマン記念日", zh: "杜鲁门日" },
  "Juneteenth National Independence Day": {
    ko: "준틴스 독립기념일",
    en: "Juneteenth National Independence Day",
    ja: "ジューンティーンス独立記念日",
    zh: "六月节国家独立日",
  },
  "Independence Day": { ko: "독립기념일", en: "Independence Day", ja: "独立記念日", zh: "独立日" },
  "Columbus Day": { ko: "콜럼버스의 날", en: "Columbus Day", ja: "コロンブス記念日", zh: "哥伦布日" },
  "Indigenous Peoples' Day": {
    ko: "원주민의 날",
    en: "Indigenous Peoples' Day",
    ja: "先住民の日",
    zh: "原住民日",
  },
  "Veterans Day": { ko: "재향군인의 날", en: "Veterans Day", ja: "退役軍人の日", zh: "退伍军人节" },
  "Thanksgiving Day": { ko: "추수감사절", en: "Thanksgiving Day", ja: "感謝祭", zh: "感恩节" },
  "Coming of Age Day": { ko: "성년의 날", en: "Coming of Age Day", ja: "成人の日", zh: "成人节" },
  "Foundation Day": { ko: "건국기념일", en: "Foundation Day", ja: "建国記念の日", zh: "建国纪念日" },
  "The Emperor's Birthday": {
    ko: "천황 탄생일",
    en: "The Emperor's Birthday",
    ja: "天皇誕生日",
    zh: "天皇诞辰",
  },
  "Vernal Equinox Day": { ko: "춘분의 날", en: "Vernal Equinox Day", ja: "春分の日", zh: "春分日" },
  "Shōwa Day": { ko: "쇼와의 날", en: "Shōwa Day", ja: "昭和の日", zh: "昭和日" },
  "Constitution Memorial Day": {
    ko: "헌법기념일",
    en: "Constitution Memorial Day",
    ja: "憲法記念日",
    zh: "宪法纪念日",
  },
  "Greenery Day": { ko: "녹색의 날", en: "Greenery Day", ja: "みどりの日", zh: "绿之日" },
  "Marine Day": { ko: "바다의 날", en: "Marine Day", ja: "海の日", zh: "海之日" },
  "Mountain Day": { ko: "산의 날", en: "Mountain Day", ja: "山の日", zh: "山之日" },
  "Respect for the Aged Day": {
    ko: "경로의 날",
    en: "Respect for the Aged Day",
    ja: "敬老の日",
    zh: "敬老日",
  },
  "Autumnal Equinox Day": { ko: "추분의 날", en: "Autumnal Equinox Day", ja: "秋分の日", zh: "秋分日" },
  "Sports Day": { ko: "스포츠의 날", en: "Sports Day", ja: "スポーツの日", zh: "体育日" },
  "Culture Day": { ko: "문화의 날", en: "Culture Day", ja: "文化の日", zh: "文化日" },
  "Labour Thanksgiving Day": {
    ko: "근로감사의 날",
    en: "Labour Thanksgiving Day",
    ja: "勤労感謝の日",
    zh: "劳动感谢日",
  },
  "Chinese New Year (Spring Festival)": {
    ko: "춘절",
    en: "Chinese New Year (Spring Festival)",
    ja: "春節",
    zh: "春节",
  },
  "Dragon Boat Festival": { ko: "단오절", en: "Dragon Boat Festival", ja: "端午節", zh: "端午节" },
  "Mid-Autumn Festival": { ko: "중추절", en: "Mid-Autumn Festival", ja: "中秋節", zh: "中秋节" },
  "National Day": { ko: "국경절", en: "National Day", ja: "国慶節", zh: "国庆节" },
};

const HOLIDAY_TYPE_TRANSLATIONS = {
  Public: { ko: "공휴일", en: "Public", ja: "祝日", zh: "公共假日" },
  Bank: { ko: "은행 휴일", en: "Bank", ja: "銀行休業日", zh: "银行假日" },
  Observance: { ko: "기념일", en: "Observance", ja: "記念日", zh: "纪念日" },
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
    const label = translateHolidayName({ englishName, localName, language });
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
      types: types.map((type) => translateHolidayType(type, language)),
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

function translateHolidayName({ englishName, localName, language }) {
  if (language === "en") {
    return englishName || localName;
  }

  if (localName) {
    return localName;
  }

  return HOLIDAY_NAME_TRANSLATIONS[englishName]?.[language] ?? englishName;
}

function translateHolidayType(type, language) {
  const text = stringOrEmpty(type);
  return HOLIDAY_TYPE_TRANSLATIONS[text]?.[language] ?? text;
}
