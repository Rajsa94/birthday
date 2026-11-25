import React, { useState } from 'react';
import { Users, User, Ban, CheckCircle2, Plus, Sparkles, AlertCircle, Edit2, Check } from 'lucide-react';
import { getAssignedGuestNames } from '../utils/seating';

export default function SeatingCards({
  tables,
  guests,
  onUpdateTableCapacity,
  onAddTable,
}) {
  const [isAddingTable, setIsAddingTable] = useState(false);
  const [newTableName, setNewTableName] = useState('');
  const [newTableCapacity, setNewTableCapacity] = useState(8);
  const [editingTableId, setEditingTableId] = useState(null);
  const [editCapacityVal, setEditCapacityVal] = useState(8);

  const handleStartEdit = (table) => {
    setEditingTableId(table.id);
    setEditCapacityVal(table.capacity);
  };

  const handleSaveEdit = (tableId) => {
    onUpdateTableCapacity(tableId, Number(editCapacityVal));
    setEditingTableId(null);
  };

  const handleCreateNewTable = (e) => {
    e.preventDefault();
    if (!newTableName.trim()) return;

    const nextId = tables.length > 0 ? Math.max(...tables.map(t => Number(t.id))) + 1 : 1;
    onAddTable({
      id: nextId,
      tableName: newTableName.trim(),
      capacity: Number(newTableCapacity) || 8,
      occupiedSeats: 0,
      availableSeats: Number(newTableCapacity) || 8,
    });

    setNewTableName('');
    setNewTableCapacity(8);
    setIsAddingTable(false);
  };

  return (
    <div className="space-y-6 text-left">
      
      {/* Top Header & Add Table Button */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h3 className="text-xl font-bold font-serif text-slate-900">
            Interactive Table Seating Arrangements
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            Real-time banquet tables with dynamic occupancy tracking and assigned guest rosters.
          </p>
        </div>

        <button
          onClick={() => setIsAddingTable(true)}
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold text-white bg-purple-600 hover:bg-purple-700 shadow-sm transition-all"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Table</span>
        </button>
      </div>

      {/* Add New Table inline modal / drawer */}
      {isAddingTable && (
        <form
          onSubmit={handleCreateNewTable}
          className="bg-purple-50/80 border border-purple-200 rounded-2xl p-4 sm:p-5 flex flex-wrap items-end gap-3 shadow-inner"
        >
          <div className="flex-1 min-w-[200px]">
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Table Name
            </label>
            <input
              type="text"
              value={newTableName}
              onChange={(e) => setNewTableName(e.target.value)}
              placeholder={`Table ${tables.length + 1}`}
              className="w-full px-3 py-2 rounded-xl border border-purple-200 text-xs sm:text-sm bg-white focus:outline-none focus:ring-2 focus:ring-purple-300"
              required
            />
          </div>

          <div className="w-32">
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Max Capacity
            </label>
            <input
              type="number"
              min="2"
              max="20"
              value={newTableCapacity}
              onChange={(e) => setNewTableCapacity(Number(e.target.value))}
              className="w-full px-3 py-2 rounded-xl border border-purple-200 text-xs sm:text-sm bg-white focus:outline-none focus:ring-2 focus:ring-purple-300"
              required
            />
          </div>

          <div className="flex items-center gap-2">
            <button
              type="submit"
              className="px-4 py-2 rounded-xl text-xs sm:text-sm font-bold text-white bg-purple-600 hover:bg-purple-700 shadow-sm"
            >
              Confirm Table
            </button>
            <button
              type="button"
              onClick={() => setIsAddingTable(false)}
              className="px-3 py-2 rounded-xl text-xs sm:text-sm font-semibold text-slate-600 hover:bg-purple-100"
            >
              Cancel
            </button>
          </div>
        </form>
      )}

      {/* Table Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {tables.map((table) => {
          const capacity = Number(table.capacity) || 8;
          const occupied = Number(table.occupiedSeats) || 0;
          const available = Math.max(0, capacity - occupied);
          const isFull = available <= 0;
          const occupancyPct = Math.min(100, Math.round((occupied / capacity) * 100));

          // Assigned guests
          const assignedGuests = (guests || []).filter(
            g => g.attendanceStatus === 'Attending' && Number(g.tableNumber) === Number(table.id)
          );

          const isEditingThis = editingTableId === table.id;

          return (
            <div
              key={table.id}
              className={`rounded-2xl border transition-all duration-200 shadow-sm flex flex-col justify-between overflow-hidden ${
                isFull
                  ? 'border-rose-200 bg-gradient-to-br from-rose-50/50 to-white'
                  : available <= 2
                  ? 'border-amber-200 bg-gradient-to-br from-amber-50/40 to-white'
                  : 'border-slate-200 bg-white hover:border-purple-300 hover:shadow-md'
              }`}
            >
              {/* Card Top Banner */}
              <div className="p-5 pb-3">
                <div className="flex items-start justify-between gap-2 mb-3">
                  <div className="flex items-center gap-2.5">
                    <div
                      className={`w-10 h-10 rounded-2xl flex items-center justify-center font-bold text-sm shadow-inner ${
                        isFull
                          ? 'bg-rose-100 text-rose-700'
                          : available <= 2
                          ? 'bg-amber-100 text-amber-700'
                          : 'bg-purple-100 text-purple-700'
                      }`}
                    >
                      T{table.id}
                    </div>
                    <div>
                      <h4 className="font-serif font-bold text-base text-slate-900">
                        {table.tableName || `Table ${table.id}`}
                      </h4>
                      <span className="text-xs text-slate-400">
                        Table ID #{table.id}
                      </span>
                    </div>
                  </div>

                  {/* Status Pill */}
                  {isFull ? (
                    <span className="inline-flex items-center gap-1 text-[11px] font-bold text-rose-700 bg-rose-100 px-2.5 py-1 rounded-full">
                      <Ban className="w-3.5 h-3.5" />
                      FULL
                    </span>
                  ) : available <= 2 ? (
                    <span className="inline-flex items-center gap-1 text-[11px] font-bold text-amber-700 bg-amber-100 px-2.5 py-1 rounded-full">
                      <AlertCircle className="w-3.5 h-3.5" />
                      {available} Left
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-100 px-2.5 py-1 rounded-full">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      Available
                    </span>
                  )}
                </div>

                {/* Progress bar */}
                <div className="space-y-1 my-3">
                  <div className="flex items-center justify-between text-xs text-slate-600 font-medium">
                    <span>Occupancy</span>
                    <span className="font-bold">{occupancyPct}%</span>
                  </div>
                  <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-300 ${
                        isFull
                          ? 'bg-rose-500'
                          : occupancyPct > 70
                          ? 'bg-amber-500'
                          : 'bg-emerald-500'
                      }`}
                      style={{ width: `${occupancyPct}%` }}
                    ></div>
                  </div>
                </div>

                {/* Key Capacity Stats */}
                <div className="grid grid-cols-3 gap-2 py-3 border-y border-slate-100 text-center text-xs">
                  <div className="bg-slate-50 p-2 rounded-xl">
                    <span className="text-slate-400 block text-[10px] uppercase font-bold">Capacity</span>
                    {isEditingThis ? (
                      <div className="flex items-center justify-center gap-1 mt-0.5">
                        <input
                          type="number"
                          min={occupied}
                          max="30"
                          value={editCapacityVal}
                          onChange={(e) => setEditCapacityVal(e.target.value)}
                          className="w-12 text-center text-xs font-bold border rounded p-0.5 bg-white"
                        />
                        <button
                          onClick={() => handleSaveEdit(table.id)}
                          className="p-1 bg-emerald-600 text-white rounded hover:bg-emerald-700"
                        >
                          <Check className="w-3 h-3" />
                        </button>
                      </div>
                    ) : (
                      <div className="flex items-center justify-center gap-1">
                        <strong className="text-slate-800 text-sm">{capacity}</strong>
                        <button
                          onClick={() => handleStartEdit(table)}
                          title="Edit Table Capacity"
                          className="text-slate-400 hover:text-purple-600 p-0.5"
                        >
                          <Edit2 className="w-3 h-3" />
                        </button>
                      </div>
                    )}
                  </div>

                  <div className="bg-slate-50 p-2 rounded-xl">
                    <span className="text-slate-400 block text-[10px] uppercase font-bold">Occupied</span>
                    <strong className="text-purple-800 text-sm">{occupied}</strong>
                  </div>

                  <div className={`p-2 rounded-xl ${available > 0 ? 'bg-emerald-50 text-emerald-800' : 'bg-slate-50 text-slate-400'}`}>
                    <span className="block text-[10px] uppercase font-bold">Available</span>
                    <strong className="text-sm">{available}</strong>
                  </div>
                </div>

                {/* Visual Seat Bubbles */}
                <div className="my-3 flex flex-wrap items-center gap-1.5">
                  {Array.from({ length: capacity }).map((_, idx) => (
                    <span
                      key={idx}
                      title={idx < occupied ? `Seat ${idx + 1}: Occupied` : `Seat ${idx + 1}: Available`}
                      className={`w-4 h-4 rounded-full flex items-center justify-center text-[9px] font-bold transition-all ${
                        idx < occupied
                          ? 'bg-rose-500 text-white shadow-2xs'
                          : 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                      }`}
                    >
                      {idx + 1}
                    </span>
                  ))}
                </div>
              </div>

              {/* Card Footer: Assigned Guests Roster */}
              <div className="p-4 bg-slate-50/70 border-t border-slate-100 text-xs">
                <span className="font-bold text-slate-700 uppercase tracking-wider text-[10px] block mb-1.5 flex items-center gap-1">
                  <User className="w-3 h-3 text-purple-600" />
                  Assigned Guests ({assignedGuests.length})
                </span>

                {assignedGuests.length === 0 ? (
                  <p className="text-slate-400 italic text-xs">
                    No guests assigned to this table yet.
                  </p>
                ) : (
                  <div className="space-y-1.5 max-h-28 overflow-y-auto pr-1">
                    {assignedGuests.map((g) => (
                      <div
                        key={g.id}
                        className="flex items-center justify-between bg-white px-2.5 py-1.5 rounded-lg border border-slate-200/70 text-slate-800 shadow-2xs"
                      >
                        <span className="font-medium truncate max-w-[150px]">{g.guestName}</span>
                        <span className="text-[10px] font-bold bg-purple-100 text-purple-700 px-1.5 py-0.5 rounded-md shrink-0">
                          {g.totalMembers} seat(s)
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
