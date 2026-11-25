/**
 * Mobile Number and Form Validation Utilities
 */

/**
 * Normalizes an Indian mobile number to a pure 10-digit string.
 * Strips formatting, leading zeros, +91 country code, and whitespace.
 * e.g. "+91 98765-43210" -> "9876543210"
 *      "09876543210"     -> "9876543210"
 */
export function normalizeIndianMobile(raw) {
  if (!raw) return '';
  let digits = String(raw).replace(/\D/g, '');

  // Strip leading 91 if 12 digits (country code)
  if (digits.length === 12 && digits.startsWith('91')) {
    digits = digits.slice(2);
  }

  // Strip leading 0 if 11 digits
  if (digits.length === 11 && digits.startsWith('0')) {
    digits = digits.slice(1);
  }

  return digits;
}

/**
 * Validates whether a mobile number is a valid 10-digit Indian mobile number
 */
export function isValidIndianMobile(raw) {
  const normalized = normalizeIndianMobile(raw);
  // Must be exactly 10 digits and start with 6, 7, 8, or 9
  return /^[6-9]\d{9}$/.test(normalized);
}

/**
 * Validates mobile number format and checks for duplicates among existing guests.
 * 
 * @param {string} mobileNumber - Raw input mobile number
 * @param {Array} existingGuests - List of registered guests
 * @param {string|number|null} excludeGuestId - Optional guest ID to exclude (when editing existing guest)
 * @returns {{ valid: boolean, error: string|null, normalized: string }}
 */
export function validateGuestMobile(mobileNumber, existingGuests = [], excludeGuestId = null) {
  if (!mobileNumber || !String(mobileNumber).trim()) {
    return {
      valid: false,
      error: 'Mobile number is required.',
      normalized: '',
    };
  }

  const normalized = normalizeIndianMobile(mobileNumber);

  if (normalized.length !== 10) {
    return {
      valid: false,
      error: 'Please enter a valid 10-digit mobile number.',
      normalized,
    };
  }

  if (!/^[6-9]/.test(normalized)) {
    return {
      valid: false,
      error: 'Indian mobile numbers must begin with 6, 7, 8, or 9.',
      normalized,
    };
  }

  // Check uniqueness across existing guests
  const isDuplicate = existingGuests.some(g => {
    if (excludeGuestId && Number(g.id) === Number(excludeGuestId)) {
      return false; // Skip the guest currently being edited
    }
    const guestNorm = normalizeIndianMobile(g.mobileNumber);
    return guestNorm === normalized;
  });

  if (isDuplicate) {
    return {
      valid: false,
      error: 'This mobile number is already registered. Please contact the administrator if you need to update your registration.',
      normalized,
    };
  }

  return {
    valid: true,
    error: null,
    normalized,
  };
}
