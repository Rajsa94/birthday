/**
 * JSON export and import validation utilities
 */

/**
 * Triggers a browser download of any data object/array as a formatted JSON file
 */
export function downloadJSON(data, filename = 'birthday-data.json') {
  const jsonStr = JSON.stringify(data, null, 2);
  const blob = new Blob([jsonStr], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

/**
 * Validates imported guest array
 */
export function validateGuestImport(parsedData) {
  if (!Array.isArray(parsedData)) {
    return { valid: false, message: 'Imported file must contain a JSON array of guests.' };
  }

  if (parsedData.length === 0) {
    return { valid: false, message: 'Imported JSON array is empty.' };
  }

  for (let i = 0; i < parsedData.length; i++) {
    const item = parsedData[i];
    if (!item || typeof item !== 'object') {
      return { valid: false, message: `Item at index ${i} is not a valid object.` };
    }
    if (!item.guestName || typeof item.guestName !== 'string') {
      return { valid: false, message: `Guest at index ${i} is missing a valid guestName.` };
    }
    if (!item.mobileNumber) {
      return { valid: false, message: `Guest "${item.guestName}" is missing mobileNumber.` };
    }
  }

  // Normalize guest objects
  const sanitizedGuests = parsedData.map((g, idx) => ({
    id: Number(g.id) || Date.now() + idx,
    guestName: String(g.guestName).trim(),
    mobileNumber: String(g.mobileNumber).trim(),
    totalMembers: Math.max(1, Number(g.totalMembers) || 1),
    tableNumber: Number(g.tableNumber) || 0,
    attendanceStatus: g.attendanceStatus === 'Declined' ? 'Declined' : 'Attending',
    message: g.message ? String(g.message).trim() : '',
    registeredAt: g.registeredAt || new Date().toISOString(),
  }));

  return { valid: true, guests: sanitizedGuests };
}

/**
 * Validates imported table array
 */
export function validateTableImport(parsedData) {
  if (!Array.isArray(parsedData)) {
    return { valid: false, message: 'Imported tables file must contain a JSON array.' };
  }

  for (let i = 0; i < parsedData.length; i++) {
    const item = parsedData[i];
    if (!item || typeof item !== 'object' || !item.id || !item.tableName) {
      return { valid: false, message: `Table item at index ${i} is missing id or tableName.` };
    }
  }

  const sanitizedTables = parsedData.map(t => ({
    id: Number(t.id),
    tableName: String(t.tableName),
    capacity: Math.max(1, Number(t.capacity) || 8),
    occupiedSeats: Number(t.occupiedSeats) || 0,
    availableSeats: Math.max(0, (Number(t.capacity) || 8) - (Number(t.occupiedSeats) || 0)),
  }));

  return { valid: true, tables: sanitizedTables };
}
