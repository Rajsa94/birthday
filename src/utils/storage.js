import initialBirthday from '../data/birthday.json';
import initialTables from '../data/tables.json';
import initialGuests from '../data/guests.json';
import { recalculateTableOccupancy } from './seating';

const KEYS = {
  BIRTHDAY: 'birthday_app_details_v1',
  TABLES: 'birthday_app_tables_v1',
  GUESTS: 'birthday_app_guests_v1',
  AUTH: 'birthday_app_admin_auth_v1',
};

/**
 * Loads birthday details from LocalStorage or fallback to JSON
 */
export function getStoredBirthday() {
  try {
    const raw = localStorage.getItem(KEYS.BIRTHDAY);
    if (raw) return JSON.parse(raw);
  } catch (e) {
    console.error('Error reading birthday from storage', e);
  }
  return initialBirthday;
}

export function saveStoredBirthday(details) {
  try {
    localStorage.setItem(KEYS.BIRTHDAY, JSON.stringify(details));
  } catch (e) {
    console.error('Error saving birthday to storage', e);
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
    birthday: initialBirthday,
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
