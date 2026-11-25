/**
 * IndexedDB and Image Management Utilities
 * Stores large image data (profile photo, background, cake, gallery) safely in IndexedDB
 * without hitting LocalStorage's ~5MB origin limit.
 */

const DB_NAME = 'BirthdayImagesDB_v1';
const DB_VERSION = 1;
const STORE_NAME = 'images';

const MAX_IMAGE_SIZE_BYTES = 5 * 1024 * 1024; // 5 MB
const ALLOWED_MIME_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];

/**
 * Validates image file type and size
 */
export function validateImageFile(file) {
  if (!file) {
    return { valid: false, error: 'No file selected.' };
  }

  const type = file.type?.toLowerCase();
  const name = file.name?.toLowerCase() || '';

  const isTypeValid = ALLOWED_MIME_TYPES.includes(type) ||
    name.endsWith('.jpg') || name.endsWith('.jpeg') || name.endsWith('.png') || name.endsWith('.webp');

  if (!isTypeValid) {
    return {
      valid: false,
      error: 'Unsupported format. Please upload JPG, JPEG, PNG, or WEBP.',
    };
  }

  if (file.size > MAX_IMAGE_SIZE_BYTES) {
    const sizeInMB = (file.size / (1024 * 1024)).toFixed(1);
    return {
      valid: false,
      error: `File size (${sizeInMB} MB) exceeds maximum limit of 5 MB.`,
    };
  }

  return { valid: true, error: null };
}

/**
 * Reads a File as a base64 Data URL
 */
export function readFileAsBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = (err) => reject(err);
    reader.readAsDataURL(file);
  });
}

/**
 * Opens or initializes the IndexedDB database
 */
function openDB() {
  return new Promise((resolve, reject) => {
    if (!window.indexedDB) {
      console.warn('IndexedDB not supported in this environment');
      return resolve(null);
    }

    const request = window.indexedDB.open(DB_NAME, DB_VERSION);

    request.onupgradeneeded = (e) => {
      const db = e.target.result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME, { keyPath: 'id' });
      }
    };

    request.onsuccess = () => resolve(request.result);
    request.onerror = (e) => reject(e.target.error);
  });
}

/**
 * Saves an image to IndexedDB
 */
export async function saveImageToDB(key, dataUrl) {
  try {
    const db = await openDB();
    if (!db) {
      // Fallback to localStorage if small, else log warning
      try { localStorage.setItem(`img_${key}`, dataUrl); } catch (e) {}
      return true;
    }

    return new Promise((resolve, reject) => {
      const tx = db.transaction(STORE_NAME, 'readwrite');
      const store = tx.objectStore(STORE_NAME);
      const req = store.put({ id: key, data: dataUrl, updatedAt: Date.now() });

      req.onsuccess = () => resolve(true);
      req.onerror = () => reject(req.error);
    });
  } catch (err) {
    console.error('Failed to save image to IndexedDB', err);
    return false;
  }
}

/**
 * Retrieves an image from IndexedDB by key
 */
export async function getImageFromDB(key) {
  try {
    const db = await openDB();
    if (!db) {
      return localStorage.getItem(`img_${key}`) || null;
    }

    return new Promise((resolve, reject) => {
      const tx = db.transaction(STORE_NAME, 'readonly');
      const store = tx.objectStore(STORE_NAME);
      const req = store.get(key);

      req.onsuccess = () => {
        resolve(req.result ? req.result.data : null);
      };
      req.onerror = () => reject(req.error);
    });
  } catch (err) {
    console.error('Failed to get image from IndexedDB', err);
    return null;
  }
}

/**
 * Removes an image from IndexedDB by key
 */
export async function removeImageFromDB(key) {
  try {
    const db = await openDB();
    if (!db) {
      localStorage.removeItem(`img_${key}`);
      return true;
    }

    return new Promise((resolve, reject) => {
      const tx = db.transaction(STORE_NAME, 'readwrite');
      const store = tx.objectStore(STORE_NAME);
      const req = store.delete(key);

      req.onsuccess = () => resolve(true);
      req.onerror = () => reject(req.error);
    });
  } catch (err) {
    console.error('Failed to remove image from IndexedDB', err);
    return false;
  }
}
