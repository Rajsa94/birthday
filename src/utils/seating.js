/**
 * Seating management and capacity calculation utilities
 */

/**
 * Recalculates occupied and available seats for all tables based on current active guests
 * @param {Array} tables - List of table objects
 * @param {Array} guests - List of guest objects
 * @returns {Array} Updated table list with accurate seat counts
 */
export function recalculateTableOccupancy(tables, guests) {
  if (!Array.isArray(tables)) return [];
  const safeGuests = Array.isArray(guests) ? guests : [];

  return tables.map(table => {
    // Sum members for all guests attending and seated at this table
    const occupied = safeGuests
      .filter(g => g.attendanceStatus === 'Attending' && Number(g.tableNumber) === Number(table.id))
      .reduce((sum, g) => sum + (Number(g.totalMembers) || 0), 0);

    const capacity = Number(table.capacity) || 8;
    const available = Math.max(0, capacity - occupied);

    return {
      ...table,
      capacity,
      occupiedSeats: occupied,
      availableSeats: available,
    };
  });
}

/**
 * Returns tables that have sufficient capacity for a given group size
 * @param {Array} tables 
 * @param {number} groupSize 
 * @returns {Array} Filtered tables
 */
export function getEligibleTables(tables, groupSize) {
  const size = Number(groupSize) || 1;
  return tables.map(t => ({
    ...t,
    canAccommodate: t.availableSeats >= size,
    isFull: t.availableSeats <= 0,
  }));
}

/**
 * Validates if a table can accommodate the group size
 * If editing an existing guest, excludes that guest's current members from the occupied count
 */
export function canTableAccommodate(tableId, groupSize, tables, guests, existingGuestId = null) {
  const table = tables.find(t => Number(t.id) === Number(tableId));
  if (!table) return { valid: false, message: 'Selected table not found.' };

  let currentOccupancy = table.occupiedSeats;
  if (existingGuestId) {
    const existing = guests.find(g => Number(g.id) === Number(existingGuestId));
    if (existing && Number(existing.tableNumber) === Number(tableId) && existing.attendanceStatus === 'Attending') {
      currentOccupancy -= Number(existing.totalMembers) || 0;
    }
  }

  const freeSeats = Math.max(0, table.capacity - currentOccupancy);
  const required = Number(groupSize) || 1;

  if (freeSeats < required) {
    return {
      valid: false,
      message: `Table ${table.tableName || table.id} has only ${freeSeats} seat(s) available, but your party has ${required} member(s).`,
      availableSeats: freeSeats,
    };
  }

  return { valid: true, availableSeats: freeSeats };
}

/**
 * Gets names of guests seated at a particular table
 */
export function getAssignedGuestNames(tableId, guests) {
  if (!Array.isArray(guests)) return [];
  return guests
    .filter(g => g.attendanceStatus === 'Attending' && Number(g.tableNumber) === Number(tableId))
    .map(g => `${g.guestName} (${g.totalMembers})`);
}
