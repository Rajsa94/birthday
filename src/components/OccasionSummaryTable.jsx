import React, { useState } from 'react';
import {
  Calendar,
  Eye,
  Edit3,
  Users,
  Armchair,
  Copy,
  Check,
  ExternalLink,
  Power,
  ChevronRight,
} from 'lucide-react';
import { OCCASIONS_CATALOG } from '../data/occasionsCatalog';

export default function OccasionSummaryTable({
  occasions = [],
  allGuests = [],
  activeOccasionId,
  onSelectOccasion,
  onEditOccasion,
  onManageGuests,
  onManageSeating,
}) {
  const [copiedId, setCopiedId] = useState(null);

  const handleCopy = (occ) => {
    const url = `${window.location.origin}/invite/${occ.occasionType}/${occ.id}`;
    navigator.clipboard.writeText(url);
    setCopiedId(occ.id);
    setTimeout(() => setCopiedId(null), 2500);
  };

  return (
    <div className="bg-white rounded-3xl border border-slate-200/90 shadow-sm overflow-hidden text-left">
      <div className="p-5 sm:p-6 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h3 className="font-serif font-bold text-lg text-slate-900">
            Occasions Master Directory & Status Table
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            Overview of all celebrations with guest tallies, attendance counts, and quick management links.
          </p>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs sm:text-sm text-slate-700">
          <thead className="bg-slate-100/70 text-slate-600 font-bold uppercase tracking-wider text-[11px] border-b border-slate-200/80 select-none">
            <tr>
              <th className="py-3.5 px-4">Occasion Name</th>
              <th className="py-3.5 px-4">Event Date</th>
              <th className="py-3.5 px-4 text-center">Registered Guests</th>
              <th className="py-3.5 px-4 text-center">Members Attending</th>
              <th className="py-3.5 px-4 text-center">Status</th>
              <th className="py-3.5 px-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {occasions.map((occ) => {
              const catalogItem = OCCASIONS_CATALOG.find(c => c.id === occ.occasionType) || OCCASIONS_CATALOG[0];
              const occGuests = allGuests.filter(g => String(g.occasionId) === String(occ.id));
              const attendingGuests = occGuests.filter(g => g.attendanceStatus === 'Attending');
              const totalMembers = attendingGuests.reduce((s, g) => s + (Number(g.totalMembers) || 0), 0);
              const isSelected = String(occ.id) === String(activeOccasionId);

              return (
                <tr
                  key={occ.id}
                  className={`hover:bg-purple-50/40 transition-colors ${
                    isSelected ? 'bg-purple-50/20' : ''
                  }`}
                >
                  {/* Occasion */}
                  <td className="py-3.5 px-4">
                    <div className="flex items-center gap-2.5">
                      <span className="text-xl shrink-0">{catalogItem.emoji}</span>
                      <div>
                        <span className="font-bold text-slate-900 block">{occ.occasionName}</span>
                        <span className="text-[11px] text-purple-700 font-semibold uppercase tracking-wider">
                          {catalogItem.name}
                        </span>
                      </div>
                    </div>
                  </td>

                  {/* Date */}
                  <td className="py-3.5 px-4 text-slate-600 whitespace-nowrap">
                    <div className="flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5 text-purple-500 shrink-0" />
                      <span>{occ.displayDate || occ.eventDate}</span>
                    </div>
                  </td>

                  {/* Registered Guests */}
                  <td className="py-3.5 px-4 text-center font-bold text-slate-900">
                    <span className="inline-flex items-center justify-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-slate-100 text-slate-800">
                      {occGuests.length}
                    </span>
                  </td>

                  {/* Members Attending */}
                  <td className="py-3.5 px-4 text-center">
                    <span className="inline-flex items-center justify-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800">
                      {totalMembers}
                    </span>
                  </td>

                  {/* Status */}
                  <td className="py-3.5 px-4 text-center whitespace-nowrap">
                    {occ.isActive ? (
                      <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full">
                        Active
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-[11px] font-bold text-slate-500 bg-slate-100 border border-slate-200 px-2 py-0.5 rounded-full">
                        Inactive
                      </span>
                    )}
                  </td>

                  {/* Actions */}
                  <td className="py-3.5 px-4 text-right whitespace-nowrap">
                    <div className="inline-flex items-center gap-1.5">
                      <button
                        onClick={() => onSelectOccasion(occ.id)}
                        className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all ${
                          isSelected
                            ? 'bg-purple-600 text-white'
                            : 'bg-purple-50 text-purple-700 hover:bg-purple-100 border border-purple-200'
                        }`}
                        title="Set Active Occasion"
                      >
                        {isSelected ? 'Selected' : 'Select'}
                      </button>

                      <button
                        onClick={() => onEditOccasion(occ)}
                        className="p-1.5 rounded-lg text-slate-500 hover:text-purple-700 hover:bg-purple-50"
                        title="Edit Occasion Information"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                      </button>

                      <button
                        onClick={() => onManageGuests(occ.id)}
                        className="p-1.5 rounded-lg text-slate-500 hover:text-blue-700 hover:bg-blue-50"
                        title="Manage Guests"
                      >
                        <Users className="w-3.5 h-3.5" />
                      </button>

                      <button
                        onClick={() => onManageSeating(occ.id)}
                        className="p-1.5 rounded-lg text-slate-500 hover:text-amber-700 hover:bg-amber-50"
                        title="Manage Seating"
                      >
                        <Armchair className="w-3.5 h-3.5" />
                      </button>

                      <a
                        href={`/invite/${occ.occasionType}/${occ.id}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-1.5 rounded-lg text-slate-500 hover:text-pink-600 hover:bg-pink-50"
                        title="Preview Public Invitation"
                      >
                        <Eye className="w-3.5 h-3.5" />
                      </a>

                      <button
                        onClick={() => handleCopy(occ)}
                        className="p-1.5 rounded-lg text-slate-500 hover:text-emerald-700 hover:bg-emerald-50"
                        title="Copy Invitation Link"
                      >
                        {copiedId === occ.id ? (
                          <Check className="w-3.5 h-3.5 text-emerald-600" />
                        ) : (
                          <Copy className="w-3.5 h-3.5" />
                        )}
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
