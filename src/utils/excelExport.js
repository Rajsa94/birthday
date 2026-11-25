import * as XLSX from 'xlsx';
import { getAssignedGuestNames } from './seating';

/**
 * Exports current guests and seating summary to a professional Excel (.xlsx) workbook
 * @param {Array} guests 
 * @param {Array} tables 
 * @param {Object} birthdayDetails 
 */
export function exportToExcel(guests, tables, birthdayDetails = {}) {
  try {
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
        'Occupancy Rate': `${Math.round((t.occupiedSeats / t.capacity) * 100)}%`,
        'Status': t.availableSeats === 0 ? 'FULL' : `${t.availableSeats} Available`,
        'Assigned Guest Names': assigned.length > 0 ? assigned.join('; ') : 'No guests seated yet',
      };
    });

    const workbook = XLSX.utils.book_new();

    const guestWorksheet = XLSX.utils.json_to_sheet(guestRows);
    const tableWorksheet = XLSX.utils.json_to_sheet(tableRows);

    // Auto-fit column widths
    const setColWidths = (ws, rows) => {
      if (!rows || rows.length === 0) return;
      const keys = Object.keys(rows[0]);
      ws['!cols'] = keys.map(key => {
        const maxLen = Math.max(
          key.length,
          ...rows.map(r => (r[key] ? String(r[key]).length : 0))
        );
        return { wch: Math.min(Math.max(maxLen + 3, 12), 45) };
      });
    };

    setColWidths(guestWorksheet, guestRows);
    setColWidths(tableWorksheet, tableRows);

    XLSX.utils.book_append_sheet(workbook, guestWorksheet, 'Guest List');
    XLSX.utils.book_append_sheet(workbook, tableWorksheet, 'Table Summary');

    const fileName = `${(birthdayDetails.personName || 'Birthday').replace(/\s+/g, '_')}_Guest_Seating_Report.xlsx`;
    XLSX.writeFile(workbook, fileName);
    return true;
  } catch (error) {
    console.error('Failed to export to Excel', error);
    throw error;
  }
}
