import * as XLSX from 'xlsx';
import { getAssignedGuestNames } from './seating';

// Helper to auto-fit columns
function setColWidths(ws, rows) {
  if (!rows || rows.length === 0) return;
  const keys = Object.keys(rows[0]);
  ws['!cols'] = keys.map(key => {
    const maxLen = Math.max(
      key.length,
      ...rows.map(r => (r[key] ? String(r[key]).length : 0))
    );
    return { wch: Math.min(Math.max(maxLen + 3, 12), 48) };
  });
}

/**
 * Exports single occasion guests and seating summary to an Excel (.xlsx) workbook
 */
export function exportToExcel(guests, tables, occasionDetails = {}) {
  try {
    const occasionTitle = occasionDetails.occasionName || occasionDetails.personName || 'Celebration';

    // Sheet 1: Guest List
    const guestRows = (guests || []).map(g => ({
      'Guest ID': g.id,
      'Guest Name': g.guestName,
      'Mobile Number': g.mobileNumber,
      'Total Members': g.totalMembers,
      'Table Number': g.attendanceStatus === 'Attending' ? (g.tableNumber ? `Table ${g.tableNumber}` : 'Unassigned') : 'N/A (Declined)',
      'Attendance Status': g.attendanceStatus,
      'Registration Date': g.registeredAt ? new Date(g.registeredAt).toLocaleString() : 'N/A',
      'Personal Message': g.message || '—',
    }));

    // Sheet 2: Table Summary
    const tableRows = (tables || []).map(t => {
      const assigned = getAssignedGuestNames(t.id, guests);
      return {
        'Table ID': t.id,
        'Table Name': t.tableName || `Table ${t.id}`,
        'Total Capacity': t.capacity,
        'Occupied Seats': t.occupiedSeats,
        'Available Seats': t.availableSeats,
        'Occupancy Rate': `${t.capacity > 0 ? Math.round((t.occupiedSeats / t.capacity) * 100) : 0}%`,
        'Status': t.availableSeats === 0 ? 'FULL' : `${t.availableSeats} Available`,
        'Assigned Guest Names': assigned.length > 0 ? assigned.join('; ') : 'No guests seated yet',
      };
    });

    const workbook = XLSX.utils.book_new();

    const guestWorksheet = XLSX.utils.json_to_sheet(guestRows);
    const tableWorksheet = XLSX.utils.json_to_sheet(tableRows);

    setColWidths(guestWorksheet, guestRows);
    setColWidths(tableWorksheet, tableRows);

    XLSX.utils.book_append_sheet(workbook, guestWorksheet, 'Guest List');
    XLSX.utils.book_append_sheet(workbook, tableWorksheet, 'Table Summary');

    const fileName = `${occasionTitle.replace(/[^a-zA-Z0-9_-]/g, '_')}_Guest_Seating_Report.xlsx`;
    XLSX.writeFile(workbook, fileName);
    return true;
  } catch (error) {
    console.error('Failed to export to Excel', error);
    throw error;
  }
}

/**
 * Master multi-sheet Excel export across all celebrations in the platform
 */
export function exportMasterOccasionsExcel(occasions = [], allGuests = []) {
  try {
    const workbook = XLSX.utils.book_new();

    // Sheet 1: All Occasions Directory Summary
    const occasionRows = occasions.map(occ => {
      const occGuests = allGuests.filter(g => String(g.occasionId) === String(occ.id));
      const attending = occGuests.filter(g => g.attendanceStatus === 'Attending');
      const attendingMembers = attending.reduce((s, g) => s + (Number(g.totalMembers) || 0), 0);
      const declined = occGuests.filter(g => g.attendanceStatus === 'Declined').length;

      return {
        'Occasion ID': occ.id,
        'Celebration Name': occ.occasionName,
        'Category / Type': (occ.occasionType || '').toUpperCase(),
        'Event Title': occ.title,
        'Date': occ.displayDate || occ.eventDate,
        'Time': occ.displayTime || occ.partyStartTime,
        'Venue': occ.venueName,
        'Host / Organizer': occ.hostName || occ.personName,
        'Status': occ.isActive ? 'ACTIVE' : 'INACTIVE',
        'Seating Enabled': occ.seatingEnabled !== false ? 'YES' : 'NO',
        'Total RSVPs': occGuests.length,
        'Attending Guests': attending.length,
        'Total Attending Members': attendingMembers,
        'Declined': declined,
      };
    });

    // Sheet 2: Master Guest List across All Occasions
    const masterGuestRows = allGuests.map(g => {
      const occ = occasions.find(o => String(o.id) === String(g.occasionId));
      return {
        'Occasion': occ ? occ.occasionName : g.occasionId,
        'Guest ID': g.id,
        'Guest Name': g.guestName,
        'Mobile Number': g.mobileNumber,
        'Party Size': g.totalMembers,
        'Table Assigned': g.tableNumber ? `Table ${g.tableNumber}` : 'N/A',
        'Status': g.attendanceStatus,
        'Registered Date': g.registeredAt ? new Date(g.registeredAt).toLocaleString() : 'N/A',
        'Message': g.message || '—',
      };
    });

    const occasionWs = XLSX.utils.json_to_sheet(occasionRows);
    const masterGuestWs = XLSX.utils.json_to_sheet(masterGuestRows);

    setColWidths(occasionWs, occasionRows);
    setColWidths(masterGuestWs, masterGuestRows);

    XLSX.utils.book_append_sheet(workbook, occasionWs, 'All Occasions Summary');
    XLSX.utils.book_append_sheet(workbook, masterGuestWs, 'All Guests Master Roster');

    const fileName = `Celebration_Platform_Master_Report_${new Date().toISOString().split('T')[0]}.xlsx`;
    XLSX.writeFile(workbook, fileName);
    return true;
  } catch (error) {
    console.error('Failed to export master report', error);
    throw error;
  }
}
