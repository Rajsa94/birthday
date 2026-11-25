import React from 'react';
import { Users, CheckCircle2, AlertCircle, Ban } from 'lucide-react';

export default function TableSelector({
  tables,
  selectedTableId,
  onSelectTable,
  partySize = 1,
  disabled = false,
  error = null,
}) {
  const size = Math.max(1, Number(partySize) || 1);

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <label className="block text-sm font-semibold text-slate-700">
          Select Seating Table <span className="text-rose-500">*</span>
        </label>
        <span className="text-xs text-slate-500">
          Party Size: <strong className="text-purple-700 font-bold">{size} {size === 1 ? 'person' : 'people'}</strong>
        </span>
      </div>

      <p className="text-xs text-slate-500">
        Choose a banquet table with sufficient available seats for your party of {size}.
      </p>

      {/* Grid of Tables */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-[320px] overflow-y-auto pr-1">
        {tables.map((table) => {
          const capacity = Number(table.capacity) || 8;
          const occupied = Number(table.occupiedSeats) || 0;
          const available = Math.max(0, capacity - occupied);
          const isSelected = Number(selectedTableId) === Number(table.id);
          const isFull = available <= 0;
          const canFitParty = available >= size;
          const isSelectable = !isFull && canFitParty && !disabled;

          // Occupancy percentage for mini visual bar
          const percentOccupied = Math.min(100, Math.round((occupied / capacity) * 100));

          return (
            <div
              key={table.id}
              onClick={() => {
                if (isSelectable) {
                  onSelectTable(table.id);
                }
              }}
              className={`relative rounded-xl p-3.5 border transition-all duration-200 cursor-pointer text-left select-none ${
                isSelected
                  ? 'border-purple-600 bg-purple-50/90 shadow-md ring-2 ring-purple-500/30'
                  : isFull
                  ? 'border-slate-200 bg-slate-100/70 opacity-60 cursor-not-allowed'
                  : !canFitParty
                  ? 'border-amber-200 bg-amber-50/40 opacity-75 cursor-not-allowed'
                  : 'border-slate-200 hover:border-purple-300 hover:bg-slate-50/80 hover:shadow-sm'
              }`}
            >
              {/* Header with Table Name and Badge */}
              <div className="flex items-center justify-between gap-2 mb-2">
                <div className="flex items-center gap-2">
                  <div
                    className={`w-7 h-7 rounded-lg flex items-center justify-center font-bold text-xs ${
                      isSelected
                        ? 'bg-purple-600 text-white'
                        : isFull
                        ? 'bg-slate-300 text-slate-600'
                        : canFitParty
                        ? 'bg-purple-100 text-purple-700'
                        : 'bg-amber-100 text-amber-700'
                    }`}
                  >
                    T{table.id}
                  </div>
                  <div>
                    <h4 className="font-semibold text-slate-900 text-sm leading-tight">
                      {table.tableName || `Table ${table.id}`}
                    </h4>
                    <span className="text-[11px] text-slate-500">
                      Max {capacity} seats
                    </span>
                  </div>
                </div>

                {/* Status Badges */}
                {isSelected ? (
                  <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-purple-700 bg-purple-100 px-2 py-0.5 rounded-full">
                    <CheckCircle2 className="w-3.5 h-3.5 text-purple-600" />
                    Selected
                  </span>
                ) : isFull ? (
                  <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-rose-700 bg-rose-100 px-2 py-0.5 rounded-full">
                    <Ban className="w-3 h-3 text-rose-600" />
                    Full
                  </span>
                ) : !canFitParty ? (
                  <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-amber-700 bg-amber-100 px-2 py-0.5 rounded-full" title={`Needs ${size} seats, but only ${available} left`}>
                    <AlertCircle className="w-3 h-3 text-amber-600" />
                    Need {size} seats
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full">
                    {available} Available
                  </span>
                )}
              </div>

              {/* Progress bar */}
              <div className="w-full bg-slate-200 rounded-full h-1.5 overflow-hidden mb-2">
                <div
                  className={`h-full rounded-full transition-all duration-300 ${
                    percentOccupied >= 100
                      ? 'bg-rose-500'
                      : percentOccupied > 70
                      ? 'bg-amber-500'
                      : 'bg-emerald-500'
                  }`}
                  style={{ width: `${percentOccupied}%` }}
                ></div>
              </div>

              {/* Seat Details Footer */}
              <div className="flex items-center justify-between text-xs text-slate-600 pt-1 border-t border-slate-100">
                <span className="flex items-center gap-1">
                  <Users className="w-3 h-3 text-slate-400" />
                  <span>Occupied: <strong>{occupied}</strong></span>
                </span>
                <span className={available >= size ? 'text-emerald-700 font-semibold' : 'text-slate-500'}>
                  Available: <strong>{available}</strong>
                </span>
              </div>

              {/* Warning note if not enough capacity */}
              {!isFull && !canFitParty && (
                <div className="mt-1.5 text-[11px] text-amber-800 font-medium">
                  Only {available} seat(s) left — cannot seat party of {size}.
                </div>
              )}
            </div>
          );
        })}
      </div>

      {error && (
        <p className="text-xs font-medium text-rose-600 flex items-center gap-1 mt-1">
          <AlertCircle className="w-3.5 h-3.5" />
          {error}
        </p>
      )}
    </div>
  );
}
