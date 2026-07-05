import {
  buildMonthMatrix,
  getLocaleConfig,
  getMonthLabel,
  getSupportedCountries,
  getSupportedLanguages,
  normalizeHolidayApi,
  parseIsoDate,
  resolveCountryForLocale,
  sameMonthFromIso,
  shiftMonth,
  todayIso,
} from "./calendar-core.mjs";
import { loadHolidayCache, syncHolidayYear } from "./holiday-service.mjs";

const SETTINGS_KEY = "simple-calendar:settings";

const TEXT = {
  ko: {
    language: "언어",
    country: "공휴일",
    update: "업데이트",
    selectedDate: "선택한 날짜",
    noHoliday: "표시할 공휴일이 없습니다.",
    loading: "공휴일을 업데이트하는 중...",
    ready: "공휴일 데이터를 사용할 수 있습니다.",
    updated: "업데이트 완료",
    cached: "캐시 사용",
    failed: "업데이트 실패",
    lastUpdated: "마지막 업데이트",
    today: "오늘",
    previousMonth: "이전 달",
    nextMonth: "다음 달",
    holidayTypes: "유형",
  },
  en: {
    language: "Language",
    country: "Holidays",
    update: "Update",
    selectedDate: "Selected date",
    noHoliday: "No public holiday to show.",
    loading: "Updating public holidays...",
    ready: "Holiday data is available.",
    updated: "Updated",
    cached: "Using cache",
    failed: "Update failed",
    lastUpdated: "Last updated",
    today: "Today",
    previousMonth: "Previous month",
    nextMonth: "Next month",
    holidayTypes: "Types",
  },
  ja: {
    language: "言語",
    country: "祝日",
    update: "更新",
    selectedDate: "選択日",
    noHoliday: "表示する祝日はありません。",
    loading: "祝日を更新しています...",
    ready: "祝日データを使用できます。",
    updated: "更新済み",
    cached: "キャッシュ使用中",
    failed: "更新失敗",
    lastUpdated: "最終更新",
    today: "今日",
    previousMonth: "前の月",
    nextMonth: "次の月",
    holidayTypes: "種類",
  },
  zh: {
    language: "语言",
    country: "假日",
    update: "更新",
    selectedDate: "已选日期",
    noHoliday: "没有可显示的公共假日。",
    loading: "正在更新公共假日...",
    ready: "假日数据可用。",
    updated: "已更新",
    cached: "使用缓存",
    failed: "更新失败",
    lastUpdated: "上次更新",
    today: "今天",
    previousMonth: "上个月",
    nextMonth: "下个月",
    holidayTypes: "类型",
  },
};

const elements = {
  calendarGrid: document.querySelector("#calendarGrid"),
  countryLabel: document.querySelector("#countryLabel"),
  countrySelect: document.querySelector("#countrySelect"),
  holidayList: document.querySelector("#holidayList"),
  languageLabel: document.querySelector("#languageLabel"),
  languageSelect: document.querySelector("#languageSelect"),
  monthLabel: document.querySelector("#monthLabel"),
  nextMonth: document.querySelector("#nextMonth"),
  prevMonth: document.querySelector("#prevMonth"),
  selectedDate: document.querySelector("#selectedDate"),
  selectedLabel: document.querySelector("#selectedLabel"),
  statusText: document.querySelector("#statusText"),
  todayButton: document.querySelector("#todayButton"),
  updateButton: document.querySelector("#updateButton"),
  updateButtonLabel: document.querySelector("#updateButtonLabel"),
  weekdayRow: document.querySelector("#weekdayRow"),
};

const now = new Date();
const savedSettings = readSettings();
const initialLanguage = savedSettings.language ?? detectLanguage();
const initialCountry = savedSettings.country ?? resolveCountryForLocale(initialLanguage);

const state = {
  language: initialLanguage,
  country: initialCountry,
  year: now.getFullYear(),
  monthIndex: now.getMonth(),
  selectedIso: todayIso(),
  isLoading: false,
  syncStatusByYear: new Map(),
  holidayGroupsByYear: new Map(),
};

init();

function init() {
  populateLanguageSelect();
  populateCountrySelect();
  bindEvents();
  loadCachedYear(state.year);
  render();
  refreshHolidayYear(state.year);
}

function bindEvents() {
  elements.prevMonth.addEventListener("click", () => moveMonth(-1));
  elements.nextMonth.addEventListener("click", () => moveMonth(1));
  elements.todayButton.addEventListener("click", () => {
    const today = todayIso();
    const { year, monthIndex } = sameMonthFromIso(today);
    state.year = year;
    state.monthIndex = monthIndex;
    state.selectedIso = today;
    loadCachedYear(year);
    render();
    refreshHolidayYear(year);
  });
  elements.updateButton.addEventListener("click", () => refreshHolidayYear(state.year, { force: true }));

  elements.languageSelect.addEventListener("change", () => {
    state.language = elements.languageSelect.value;
    state.country = resolveCountryForLocale(state.language);
    state.syncStatusByYear.clear();
    state.holidayGroupsByYear.clear();
    saveSettings();
    populateCountrySelect();
    loadCachedYear(state.year);
    render();
    refreshHolidayYear(state.year);
  });

  elements.countrySelect.addEventListener("change", () => {
    state.country = elements.countrySelect.value;
    state.syncStatusByYear.clear();
    state.holidayGroupsByYear.clear();
    saveSettings();
    loadCachedYear(state.year);
    render();
    refreshHolidayYear(state.year);
  });

  window.addEventListener("keydown", (event) => {
    if (event.key === "ArrowLeft" && (event.metaKey || event.ctrlKey)) {
      event.preventDefault();
      moveMonth(-1);
    }
    if (event.key === "ArrowRight" && (event.metaKey || event.ctrlKey)) {
      event.preventDefault();
      moveMonth(1);
    }
  });
}

function moveMonth(delta) {
  const next = shiftMonth(state.year, state.monthIndex, delta);
  state.year = next.year;
  state.monthIndex = next.monthIndex;
  state.selectedIso = `${next.year}-${String(next.monthIndex + 1).padStart(2, "0")}-01`;
  loadCachedYear(next.year);
  render();
  refreshHolidayYear(next.year);
}

async function refreshHolidayYear(year, { force = false } = {}) {
  const existing = state.syncStatusByYear.get(year);
  if (!force && existing?.source === "network") {
    return;
  }

  state.isLoading = true;
  renderStatus();

  const result = await syncHolidayYear({
    countryCode: state.country,
    year,
    storage: window.localStorage,
  });

  state.syncStatusByYear.set(year, result);
  state.holidayGroupsByYear.set(year, normalizeHolidayApi(result.rows, state.language));
  state.isLoading = false;
  render();
}

function loadCachedYear(year) {
  if (state.syncStatusByYear.get(year)?.source === "network") {
    return;
  }

  const cached = loadHolidayCache(window.localStorage, { countryCode: state.country, year });
  if (!cached) {
    return;
  }
  state.syncStatusByYear.set(year, {
    source: "cache",
    countryCode: state.country,
    year,
    rows: cached.rows,
    updatedAt: cached.updatedAt,
    warning: "",
  });
  state.holidayGroupsByYear.set(year, normalizeHolidayApi(cached.rows, state.language));
}

function render() {
  const locale = getLocaleConfig(state.language);
  document.documentElement.lang = state.language;

  elements.monthLabel.textContent = getMonthLabel(state.year, state.monthIndex, state.language);
  elements.languageLabel.textContent = text("language");
  elements.countryLabel.textContent = text("country");
  elements.updateButtonLabel.textContent = text("update");
  elements.selectedLabel.textContent = text("selectedDate");

  elements.prevMonth.setAttribute("aria-label", text("previousMonth"));
  elements.prevMonth.title = text("previousMonth");
  elements.nextMonth.setAttribute("aria-label", text("nextMonth"));
  elements.nextMonth.title = text("nextMonth");
  elements.todayButton.setAttribute("aria-label", text("today"));
  elements.todayButton.title = text("today");

  elements.languageSelect.value = state.language;
  elements.countrySelect.value = state.country;
  renderWeekdays(locale);
  renderCalendar(locale);
  renderSelectedDate(locale);
  renderStatus();
  saveSettings();
}

function renderWeekdays(locale) {
  elements.weekdayRow.replaceChildren(
    ...locale.weekdays.map((weekday) => {
      const span = document.createElement("span");
      span.textContent = weekday;
      return span;
    }),
  );
}

function renderCalendar(locale) {
  const cells = buildMonthMatrix({
    year: state.year,
    monthIndex: state.monthIndex,
    firstDay: locale.firstDay,
  });

  for (const year of new Set(cells.map((cell) => cell.year))) {
    loadCachedYear(year);
  }

  elements.calendarGrid.replaceChildren(
    ...cells.map((cell) => {
      const holidays = getHolidaysForDate(cell.isoDate);
      const button = document.createElement("button");
      button.className = [
        "day-cell",
        cell.currentMonth ? "" : "is-outside",
        cell.today ? "is-today" : "",
        cell.isoDate === state.selectedIso ? "is-selected" : "",
        holidays.length > 0 ? "has-holiday" : "",
      ]
        .filter(Boolean)
        .join(" ");
      button.type = "button";
      button.setAttribute("aria-pressed", cell.isoDate === state.selectedIso ? "true" : "false");
      button.setAttribute("aria-label", buildDateLabel(cell.isoDate, holidays, locale));
      button.addEventListener("click", () => selectDate(cell.isoDate));

      const number = document.createElement("span");
      number.className = "date-number";
      number.textContent = String(cell.day);
      button.append(number);

      if (holidays.length > 0) {
        const summary = document.createElement("span");
        summary.className = "holiday-summary";
        summary.textContent = holidays.map((holiday) => holiday.label).join(", ");
        button.append(summary);
      }

      return button;
    }),
  );
}

function renderSelectedDate(locale) {
  elements.selectedDate.textContent = formatIsoDate(state.selectedIso, locale.localeTag);
  const holidays = getHolidaysForDate(state.selectedIso);

  if (holidays.length === 0) {
    const empty = document.createElement("p");
    empty.className = "empty-state";
    empty.textContent = text("noHoliday");
    elements.holidayList.replaceChildren(empty);
    return;
  }

  elements.holidayList.replaceChildren(
    ...holidays.map((holiday) => {
      const item = document.createElement("div");
      item.className = "holiday-item";

      const title = document.createElement("strong");
      title.textContent = holiday.label;
      item.append(title);

      if (holiday.types.length > 0) {
        const meta = document.createElement("span");
        meta.textContent = `${text("holidayTypes")}: ${holiday.types.join(", ")}`;
        item.append(meta);
      }

      return item;
    }),
  );
}

function renderStatus() {
  const locale = getLocaleConfig(state.language);
  if (state.isLoading) {
    elements.statusText.textContent = text("loading");
    elements.updateButton.disabled = true;
    return;
  }

  elements.updateButton.disabled = false;
  const status = state.syncStatusByYear.get(state.year);
  if (!status) {
    elements.statusText.textContent = text("ready");
    return;
  }

  if (status.source === "network") {
    elements.statusText.textContent = `${text("updated")} · ${text("lastUpdated")} ${formatDateTime(
      status.updatedAt,
      locale.localeTag,
    )}`;
    return;
  }

  if (status.source === "cache") {
    const warning = status.warning ? ` · ${status.warning}` : "";
    elements.statusText.textContent = `${text("cached")} · ${text("lastUpdated")} ${formatDateTime(
      status.updatedAt,
      locale.localeTag,
    )}${warning}`;
    return;
  }

  elements.statusText.textContent = `${text("failed")} · ${status.warning || "unknown error"}`;
}

function selectDate(isoDate) {
  const nextMonth = sameMonthFromIso(isoDate);
  state.year = nextMonth.year;
  state.monthIndex = nextMonth.monthIndex;
  state.selectedIso = isoDate;
  loadCachedYear(state.year);
  render();
  refreshHolidayYear(state.year);
}

function populateLanguageSelect() {
  elements.languageSelect.replaceChildren(
    ...getSupportedLanguages().map((language) => {
      const option = document.createElement("option");
      option.value = language.code;
      option.textContent = language.languageName;
      return option;
    }),
  );
}

function populateCountrySelect() {
  elements.countrySelect.replaceChildren(
    ...getSupportedCountries(state.language).map((country) => {
      const option = document.createElement("option");
      option.value = country.code;
      option.textContent = `${country.label} (${country.code})`;
      return option;
    }),
  );
  elements.countrySelect.value = state.country;
}

function getHolidaysForDate(isoDate) {
  const { year } = parseIsoDate(isoDate);
  return state.holidayGroupsByYear.get(year)?.[isoDate] ?? [];
}

function buildDateLabel(isoDate, holidays, locale) {
  const holidayPart = holidays.length > 0 ? `, ${holidays.map((holiday) => holiday.label).join(", ")}` : "";
  return `${formatIsoDate(isoDate, locale.localeTag)}${holidayPart}`;
}

function formatIsoDate(isoDate, localeTag) {
  const { year, monthIndex, day } = parseIsoDate(isoDate);
  return new Intl.DateTimeFormat(localeTag, {
    weekday: "short",
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(new Date(year, monthIndex, day));
}

function formatDateTime(value, localeTag) {
  if (!value) {
    return "-";
  }
  return new Intl.DateTimeFormat(localeTag, {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(value));
}

function text(key) {
  return TEXT[state.language]?.[key] ?? TEXT.en[key] ?? key;
}

function detectLanguage() {
  const raw = navigator.language?.slice(0, 2).toLowerCase();
  return raw && TEXT[raw] ? raw : "en";
}

function readSettings() {
  try {
    const parsed = JSON.parse(window.localStorage.getItem(SETTINGS_KEY));
    if (!parsed || typeof parsed !== "object") {
      return {};
    }
    return {
      language: TEXT[parsed.language] ? parsed.language : null,
      country: typeof parsed.country === "string" ? parsed.country : null,
    };
  } catch {
    return {};
  }
}

function saveSettings() {
  window.localStorage.setItem(
    SETTINGS_KEY,
    JSON.stringify({
      language: state.language,
      country: state.country,
    }),
  );
}
