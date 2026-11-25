import initialBirthday from '../data/birthday.json';
import initialTables from '../data/tables.json';
import initialGuests from '../data/guests.json';
import { recalculateTableOccupancy } from './seating';

const KEYS = {
  BIRTHDAY: 'birthday_app_details_v2',
  TABLES: 'birthday_app_tables_v1',
  GUESTS: 'birthday_app_guests_v1',
  AUTH: 'birthday_app_admin_auth_v1',
};

/**
 * Formats a YYYY-MM-DD date string to a human friendly format
 * e.g. "2026-12-18" -> "Friday, December 18, 2026"
 */
export function formatDisplayDate(dateString) {
  if (!dateString) return 'Date to be announced';
  try {
    const [year, month, day] = dateString.split('-').map(Number);
    const date = new Date(year, month - 1, day);
    if (isNaN(date.getTime())) return dateString;
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  } catch (e) {
    return dateString;
  }
}

/**
 * Formats 24h times "19:00", "23:00" to "07:00 PM – 11:00 PM"
 */
export function formatDisplayTime(startTime, endTime) {
  const formatSingle = (timeStr) => {
    if (!timeStr) return '';
    const [h, m] = timeStr.split(':').map(Number);
    if (isNaN(h)) return timeStr;
    const period = h >= 12 ? 'PM' : 'AM';
    const hours = h % 12 || 12;
    const mins = String(m || 0).padStart(2, '0');
    return `${String(hours).padStart(2, '0')}:${mins} ${period}`;
  };

  const start = formatSingle(startTime);
  const end = formatSingle(endTime);

  if (start && end) return `${start} – ${end}`;
  if (start) return `${start} onwards`;
  return '07:00 PM onwards';
}

/**
 * Loads birthday details from LocalStorage or fallback to JSON
 */
export function getStoredBirthday() {
  try {
    const raw = localStorage.getItem(KEYS.BIRTHDAY);
    if (raw) {
      const parsed = JSON.parse(raw);
      return {
        ...initialBirthday,
        ...parsed,
        displayDate: formatDisplayDate(parsed.birthdayDate || initialBirthday.birthdayDate),
        displayTime: formatDisplayTime(parsed.partyStartTime, parsed.partyEndTime),
      };
    }
  } catch (e) {
    console.error('Error reading birthday from storage', e);
  }
  return {
    ...initialBirthday,
    displayDate: formatDisplayDate(initialBirthday.birthdayDate),
    displayTime: formatDisplayTime(initialBirthday.partyStartTime, initialBirthday.partyEndTime),
  };
}

export function saveStoredBirthday(details) {
  try {
    const enriched = {
      ...details,
      displayDate: formatDisplayDate(details.birthdayDate),
      displayTime: formatDisplayTime(details.partyStartTime, details.partyEndTime),
      eventDateTime: details.birthdayDate && details.partyStartTime
        ? `${details.birthdayDate}T${details.partyStartTime}:00`
        : details.eventDateTime,
    };
    localStorage.setItem(KEYS.BIRTHDAY, JSON.stringify(enriched));
    return enriched;
  } catch (e) {
    console.error('Error saving birthday to storage', e);
    return details;
  }
}

/**
 * Loads tables from LocalStorage or fallback to JSON, with recalculation against guests
 */
export function getStoredTables(currentGuests) {
  let tables = initialTables;
  try {
    const raw = localStorage.getItem(KEYS.TABLES);
    if (raw) {
      tables = JSON.parse(raw);
    }
  } catch (e) {
    console.error('Error reading tables from storage', e);
  }

  const guests = currentGuests || getStoredGuests();
  return recalculateTableOccupancy(tables, guests);
}

export function saveStoredTables(tables) {
  try {
    localStorage.setItem(KEYS.TABLES, JSON.stringify(tables));
  } catch (e) {
    console.error('Error saving tables to storage', e);
  }
}

/**
 * Loads guests from LocalStorage or fallback to JSON
 */
export function getStoredGuests() {
  try {
    const raw = localStorage.getItem(KEYS.GUESTS);
    if (raw) return JSON.parse(raw);
  } catch (e) {
    console.error('Error reading guests from storage', e);
  }
  return initialGuests;
}

export function saveStoredGuests(guests) {
  try {
    localStorage.setItem(KEYS.GUESTS, JSON.stringify(guests));
  } catch (e) {
    console.error('Error saving guests to storage', e);
  }
}

/**
 * Resets all data to initial JSON values
 */
export function resetToDefaultData() {
  localStorage.removeItem(KEYS.BIRTHDAY);
  localStorage.removeItem(KEYS.TABLES);
  localStorage.removeItem(KEYS.GUESTS);
  return {
    birthday: {
      ...initialBirthday,
      displayDate: formatDisplayDate(initialBirthday.birthdayDate),
      displayTime: formatDisplayTime(initialBirthday.partyStartTime, initialBirthday.partyEndTime),
    },
    guests: initialGuests,
    tables: recalculateTableOccupancy(initialTables, initialGuests),
  };
}

/**
 * Admin demo auth storage
 */
export function getAdminAuth() {
  return localStorage.getItem(KEYS.AUTH) === 'true';
}

export function setAdminAuth(isAuth) {
  if (isAuth) {
    localStorage.setItem(KEYS.AUTH, 'true');
  } else {
    localStorage.removeItem(KEYS.AUTH);
  }
}
