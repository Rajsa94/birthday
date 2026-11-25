import React, { useState, useMemo } from 'react';
import { Search, Filter, ArrowUpDown, Edit3, Trash2, Eye, UserX, UserCheck, Calendar, Phone, Users, MessageSquare, ChevronLeft, ChevronRight, X } from 'lucide-react';

export default function GuestTable({
  guests,
  tables,
  onEditGuest,
  onDeleteGuest,
}) {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [tableFilter, setTableFilter] = useState('ALL');
  const [sortField, setSortField] = useState('registeredAt');
  const [sortDirection, setSortDirection] = useState('desc'); // 'asc' | 'desc'
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(8);

  // View details modal state
  const [selectedGuestForView, setSelectedGuestForView] = useState(null);

  // Filter & Search logic
  const filteredGuests = useMemo(() => {
    let result = [...guests];

    // Search by Name or Mobile
    if (searchTerm.trim()) {
      const q = searchTerm.toLowerCase().trim();
      result = result.filter(
        g =>
          (g.guestName && g.guestName.toLowerCase().includes(q)) ||
          (g.mobileNumber && g.mobileNumber.includes(q))
      );
    }

    // Filter by Status
    if (statusFilter !== 'ALL') {
      result = result.filter(g => g.attendanceStatus === statusFilter);
    }

    // Filter by Table
    if (tableFilter !== 'ALL') {
      const targetTable = Number(tableFilter);
      result = result.filter(g => Number(g.tableNumber) === targetTable);
    }

    // Sort
    result.sort((a, b) => {
      let valA = a[sortField];
      let valB = b[sortField];

      if (sortField === 'guestName') {
        valA = (valA || '').toLowerCase();
        valB = (valB || '').toLowerCase();
      } else if (sortField === 'totalMembers' || sortField === 'tableNumber' || sortField === 'id') {
        valA = Number(valA) || 0;
        valB = Number(valB) || 0;
      } else if (sortField === 'registeredAt') {
        valA = new Date(valA || 0).getTime();
        valB = new Date(valB || 0).getTime();
      }

      if (valA < valB) return sortDirection === 'asc' ? -1 : 1;
      if (valA > valB) return sortDirection === 'asc' ? 1 : -1;
      return 0;
    });

    return result;
  }, [guests, searchTerm, statusFilter, tableFilter, sortField, sortDirection]);

  // Pagination calculation
  const totalPages = Math.max(1, Math.ceil(filteredGuests.length / pageSize));
  const paginatedGuests = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredGuests.slice(start, start + pageSize);
  }, [filteredGuests, currentPage, pageSize]);

  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection(prev => (prev === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
    setCurrentPage(1);
  };

  const handleDeleteWithConfirm = (guest) => {
    if (window.confirm(`Are you sure you want to delete the reservation for "${guest.guestName}"? Table seats will be updated automatically.`)) {
      onDeleteGuest(guest.id);
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden text-left">
      
      {/* Controls Bar: Search, Filters, Stats */}
      <div className="p-4 sm:p-5 border-b border-slate-100 bg-slate-50/50 space-y-3 sm:space-y-0 sm:flex sm:items-center sm:justify-between sm:gap-4">
        
        {/* Search Input */}
        <div className="relative flex-1 max-w-sm">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1);
            }}
            placeholder="Search by guest name or mobile..."
            className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-200 bg-white text-xs sm:text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-purple-200 focus:border-purple-500 shadow-2xs"
          />
          {searchTerm && (
            <button
              onClick={() => setSearchTerm('')}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Filter Dropdowns */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Status Filter */}
          <div className="flex items-center gap-1.5 bg-white border border-slate-200 rounded-xl px-2.5 py-1.5 shadow-2xs">
            <Filter className="w-3.5 h-3.5 text-slate-400" />
            <select
              value={statusFilter}
              onChange={(e) => {
                setStatusFilter(e.target.value);
                setCurrentPage(1);
              }}
              className="text-xs font-semibold text-slate-700 bg-transparent focus:outline-none cursor-pointer"
            >
              <option value="ALL">All Attendance</option>
              <option value="Attending">Attending Only</option>
              <option value="Declined">Declined Only</option>
            </select>
          </div>

          {/* Table Filter */}
          <div className="flex items-center gap-1.5 bg-white border border-slate-200 rounded-xl px-2.5 py-1.5 shadow-2xs">
            <Users className="w-3.5 h-3.5 text-slate-400" />
            <select
              value={tableFilter}
              onChange={(e) => {
                setTableFilter(e.target.value);
                setCurrentPage(1);
              }}
              className="text-xs font-semibold text-slate-700 bg-transparent focus:outline-none cursor-pointer"
            >
              <option value="ALL">All Tables</option>
              {tables.map(t => (
                <option key={t.id} value={t.id}>
                  {t.tableName || `Table ${t.id}`}
                </option>
              ))}
            </select>
          </div>

          {/* Page size */}
          <select
            value={pageSize}
            onChange={(e) => {
              setPageSize(Number(e.target.value));
              setCurrentPage(1);
            }}
            className="text-xs font-semibold text-slate-700 bg-white border border-slate-200 rounded-xl px-2.5 py-1.5 shadow-2xs focus:outline-none"
          >
            <option value={5}>5 / page</option>
            <option value={8}>8 / page</option>
            <option value={15}>15 / page</option>
            <option value={25}>25 / page</option>
          </select>
        </div>
      </div>

      {/* Responsive Data Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs sm:text-sm text-slate-700">
          <thead className="bg-slate-100/70 text-slate-600 font-bold uppercase tracking-wider text-[11px] border-b border-slate-200/80 select-none">
            <tr>
              <th
                onClick={() => handleSort('id')}
                className="py-3 px-4 cursor-pointer hover:text-purple-700 transition-colors"
              >
                <div className="flex items-center gap-1">
                  <span>ID</span>
                  <ArrowUpDown className="w-3 h-3" />
                </div>
              </th>
              <th
                onClick={() => handleSort('guestName')}
                className="py-3 px-4 cursor-pointer hover:text-purple-700 transition-colors"
              >
                <div className="flex items-center gap-1">
                  <span>Guest Name</span>
                  <ArrowUpDown className="w-3 h-3" />
                </div>
              </th>
              <th className="py-3 px-4">Mobile Number</th>
              <th
                onClick={() => handleSort('totalMembers')}
                className="py-3 px-4 cursor-pointer hover:text-purple-700 transition-colors text-center"
              >
                <div className="flex items-center justify-center gap-1">
                  <span>Members</span>
                  <ArrowUpDown className="w-3 h-3" />
                </div>
              </th>
              <th
                onClick={() => handleSort('tableNumber')}
                className="py-3 px-4 cursor-pointer hover:text-purple-700 transition-colors text-center"
              >
                <div className="flex items-center justify-center gap-1">
                  <span>Table</span>
                  <ArrowUpDown className="w-3 h-3" />
                </div>
              </th>
              <th className="py-3 px-4 text-center">Status</th>
              <th
                onClick={() => handleSort('registeredAt')}
                className="py-3 px-4 cursor-pointer hover:text-purple-700 transition-colors"
              >
                <div className="flex items-center gap-1">
                  <span>Registered</span>
                  <ArrowUpDown className="w-3 h-3" />
                </div>
              </th>
              <th className="py-3 px-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {paginatedGuests.length === 0 ? (
              <tr>
                <td colSpan={8} className="py-12 text-center text-slate-400">
                  <div className="flex flex-col items-center justify-center">
                    <UserX className="w-10 h-10 text-slate-300 mb-2" />
                    <p className="font-semibold text-slate-600">No matching guests found</p>
                    <p className="text-xs text-slate-400 mt-0.5">Try adjusting your search terms or filters</p>
                  </div>
                </td>
              </tr>
            ) : (
              paginatedGuests.map((guest) => {
                const isAttending = guest.attendanceStatus === 'Attending';
                const tableObj = tables.find(t => Number(t.id) === Number(guest.tableNumber));

                return (
                  <tr key={guest.id} className="hover:bg-purple-50/40 transition-colors">
                    {/* ID */}
                    <td className="py-3 px-4 font-mono text-xs text-slate-500">
                      #{String(guest.id).slice(-4)}
                    </td>

                    {/* Guest Name & Message preview */}
                    <td className="py-3 px-4 font-semibold text-slate-900">
                      <div>{guest.guestName}</div>
                      {guest.message && (
                        <div className="text-[11px] text-slate-400 font-normal italic truncate max-w-[200px]">
                          "{guest.message}"
                        </div>
                      )}
                    </td>

                    {/* Mobile Number */}
                    <td className="py-3 px-4 text-slate-600 whitespace-nowrap">
                      +91 {guest.mobileNumber}
                    </td>

                    {/* Total Members */}
                    <td className="py-3 px-4 text-center">
                      {isAttending ? (
                        <span className="inline-flex items-center justify-center px-2 py-0.5 rounded-full text-xs font-bold bg-purple-100 text-purple-800">
                          {guest.totalMembers}
                        </span>
                      ) : (
                        <span className="text-slate-400 text-xs">—</span>
                      )}
                    </td>

                    {/* Table Number */}
                    <td className="py-3 px-4 text-center whitespace-nowrap">
                      {isAttending ? (
                        <span className="inline-flex items-center gap-1 font-semibold text-slate-800 text-xs bg-slate-100 px-2 py-0.5 rounded-md border border-slate-200">
                          {tableObj ? tableObj.tableName : `Table ${guest.tableNumber}`}
                        </span>
                      ) : (
                        <span className="text-slate-400 text-xs">N/A</span>
                      )}
                    </td>

                    {/* Attendance Status */}
                    <td className="py-3 px-4 text-center whitespace-nowrap">
                      {isAttending ? (
                        <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200/80 px-2.5 py-0.5 rounded-full">
                          <UserCheck className="w-3 h-3 text-emerald-600" />
                          Attending
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-[11px] font-bold text-rose-700 bg-rose-50 border border-rose-200/80 px-2.5 py-0.5 rounded-full">
                          <UserX className="w-3 h-3 text-rose-600" />
                          Declined
                        </span>
                      )}
                    </td>

                    {/* Registration Date */}
                    <td className="py-3 px-4 text-xs text-slate-500 whitespace-nowrap">
                      {guest.registeredAt ? new Date(guest.registeredAt).toLocaleDateString() : 'N/A'}
                    </td>

                    {/* Actions */}
                    <td className="py-3 px-4 text-right whitespace-nowrap">
                      <div className="inline-flex items-center gap-1">
                        {/* View */}
                        <button
                          onClick={() => setSelectedGuestForView(guest)}
                          title="View Guest Record"
                          className="p-1.5 rounded-lg text-slate-500 hover:text-purple-700 hover:bg-purple-100 transition-colors"
                        >
                          <Eye className="w-4 h-4" />
                        </button>

                        {/* Edit */}
                        <button
                          onClick={() => onEditGuest(guest)}
                          title="Edit Guest & Seating"
                          className="p-1.5 rounded-lg text-slate-500 hover:text-blue-700 hover:bg-blue-100 transition-colors"
                        >
                          <Edit3 className="w-4 h-4" />
                        </button>

                        {/* Delete */}
                        <button
                          onClick={() => handleDeleteWithConfirm(guest)}
                          title="Delete Guest"
                          className="p-1.5 rounded-lg text-slate-500 hover:text-rose-700 hover:bg-rose-100 transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Footer */}
      <div className="p-4 border-t border-slate-100 bg-slate-50/50 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-600">
        <div>
          Showing <strong>{filteredGuests.length > 0 ? (currentPage - 1) * pageSize + 1 : 0}</strong> to{' '}
          <strong>{Math.min(currentPage * pageSize, filteredGuests.length)}</strong> of{' '}
          <strong>{filteredGuests.length}</strong> guests ({guests.length} total in system)
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
            disabled={currentPage === 1}
            className="p-1.5 rounded-lg border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
            aria-label="Previous Page"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>

          <span className="px-2 font-semibold">
            Page {currentPage} of {totalPages}
          </span>

          <button
            onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages}
            className="p-1.5 rounded-lg border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
            aria-label="Next Page"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* View Guest Details Modal */}
      {selectedGuestForView && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm">
          <div className="bg-white rounded-3xl p-6 max-w-md w-full shadow-2xl border border-slate-100 text-left relative animate-scale-up">
            <button
              onClick={() => setSelectedGuestForView(null)}
              className="absolute top-4 right-4 w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-600"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-2xl bg-purple-100 text-purple-700 flex items-center justify-center font-bold text-lg">
                {selectedGuestForView.guestName.charAt(0)}
              </div>
              <div>
                <h4 className="text-lg font-bold text-slate-900 font-serif">
                  {selectedGuestForView.guestName}
                </h4>
                <span className="text-xs text-slate-400 font-mono">
                  Guest #{selectedGuestForView.id}
                </span>
              </div>
            </div>

            <div className="space-y-3 bg-slate-50 p-4 rounded-2xl border border-slate-100 text-xs">
              <div className="flex items-center justify-between pb-2 border-b border-slate-200/60">
                <span className="text-slate-500 flex items-center gap-1.5">
                  <Phone className="w-3.5 h-3.5" /> Mobile Number:
                </span>
                <strong className="text-slate-800">+91 {selectedGuestForView.mobileNumber}</strong>
              </div>

              <div className="flex items-center justify-between pb-2 border-b border-slate-200/60">
                <span className="text-slate-500">Attendance Status:</span>
                <span className={`font-bold px-2 py-0.5 rounded-full ${
                  selectedGuestForView.attendanceStatus === 'Attending' ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
                }`}>
                  {selectedGuestForView.attendanceStatus}
                </span>
              </div>

              {selectedGuestForView.attendanceStatus === 'Attending' && (
                <>
                  <div className="flex items-center justify-between pb-2 border-b border-slate-200/60">
                    <span className="text-slate-500 flex items-center gap-1.5">
                      <Users className="w-3.5 h-3.5" /> Party Size:
                    </span>
                    <strong className="text-slate-800">{selectedGuestForView.totalMembers} Member(s)</strong>
                  </div>

                  <div className="flex items-center justify-between pb-2 border-b border-slate-200/60">
                    <span className="text-slate-500">Seating Table:</span>
                    <strong className="text-purple-700">
                      Table {selectedGuestForView.tableNumber}
                    </strong>
                  </div>
                </>
              )}

              <div className="flex items-center justify-between pb-2 border-b border-slate-200/60">
                <span className="text-slate-500 flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5" /> Registered At:
                </span>
                <span className="text-slate-700">
                  {selectedGuestForView.registeredAt ? new Date(selectedGuestForView.registeredAt).toLocaleString() : 'N/A'}
                </span>
              </div>

              {selectedGuestForView.message && (
                <div className="pt-1">
                  <span className="text-slate-500 block mb-1 flex items-center gap-1">
                    <MessageSquare className="w-3 h-3" /> Note from guest:
                  </span>
                  <div className="bg-white p-2.5 rounded-xl border border-slate-200 text-slate-700 italic">
                    "{selectedGuestForView.message}"
                  </div>
                </div>
              )}
            </div>

            <div className="mt-5 flex justify-end gap-2">
              <button
                onClick={() => {
                  const g = selectedGuestForView;
                  setSelectedGuestForView(null);
                  onEditGuest(g);
                }}
                className="px-4 py-2 rounded-xl text-xs font-bold text-white bg-purple-600 hover:bg-purple-700 shadow-sm"
              >
                Edit Details
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
