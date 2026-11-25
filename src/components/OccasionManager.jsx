import React, { useState } from 'react';
import {
  Plus,
  Search,
  Filter,
  Eye,
  Edit3,
  Copy,
  Trash2,
  Calendar,
  MapPin,
  Users,
  CheckCircle2,
  Sparkles,
  Palette,
  Armchair,
  Check,
  Power,
  X,
  ExternalLink,
} from 'lucide-react';
import { OCCASIONS_CATALOG, OCCASION_CATEGORIES } from '../data/occasionsCatalog';

export default function OccasionManager({
  occasions = [],
  activeOccasionId,
  allGuests = [],
  onSelectActiveOccasion,
  onCreateOccasion,
  onEditOccasion,
  onOpenThemeDesigner,
  onManageGuests,
  onManageSeating,
  onDuplicateOccasion,
  onToggleActive,
  onDeleteOccasion,
}) {
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All Categories');
  const [statusFilter, setStatusFilter] = useState('ALL'); // 'ALL' | 'ACTIVE' | 'INACTIVE'
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [copiedId, setCopiedId] = useState(null);

  // New Occasion Form state inside modal
  const [newOccasionType, setNewOccasionType] = useState('birthday');
  const [newOccasionName, setNewOccasionName] = useState('');
  const [newOccasionTitle, setNewOccasionTitle] = useState('');
  const [newHostName, setNewHostName] = useState('');
  const [newEventDate, setNewEventDate] = useState('');
  const [newVenueName, setNewVenueName] = useState('');

  // Copy link helper
  const handleCopyLink = (occ) => {
    const url = `${window.location.origin}/invite/${occ.occasionType}/${occ.id}`;
    navigator.clipboard.writeText(url);
    setCopiedId(occ.id);
    setTimeout(() => setCopiedId(null), 3000);
  };

  const handleCreateSubmit = (e) => {
    e.preventDefault();
    const catalogItem = OCCASIONS_CATALOG.find(c => c.id === newOccasionType) || OCCASIONS_CATALOG[0];

    const created = onCreateOccasion({
      occasionType: newOccasionType,
      occasionName: newOccasionName.trim() || `${catalogItem.name} Celebration`,
      title: newOccasionTitle.trim() || `${catalogItem.name} Gala`,
      hostName: newHostName.trim() || 'The Host Family',
      eventDate: newEventDate || new Date(Date.now() + 14 * 86400000).toISOString().split('T')[0],
      venueName: newVenueName.trim() || 'Royal Palace Banquets',
      venueAddress: '108 Boulevard Heights',
      invitationMessage: `Join us for the grand celebration of ${newOccasionName || catalogItem.name}!`,
    });

    setIsCreateModalOpen(false);
    // Reset modal fields
    setNewOccasionName('');
    setNewOccasionTitle('');
    setNewHostName('');
    setNewEventDate('');
    setNewVenueName('');
  };

  // Filter occasions
  const filteredOccasions = occasions.filter((occ) => {
    const catalogItem = OCCASIONS_CATALOG.find(c => c.id === occ.occasionType);
    const matchesSearch =
      (occ.occasionName && occ.occasionName.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (occ.title && occ.title.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (occ.hostName && occ.hostName.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (occ.venueName && occ.venueName.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesCategory =
      categoryFilter === 'All Categories' || (catalogItem && catalogItem.category === categoryFilter);

    const matchesStatus =
      statusFilter === 'ALL' ||
      (statusFilter === 'ACTIVE' && occ.isActive) ||
      (statusFilter === 'INACTIVE' && !occ.isActive);

    return matchesSearch && matchesCategory && matchesStatus;
  });

  return (
    <div className="space-y-6 text-left max-w-7xl">
      {/* Top Banner & Quick Stats */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl sm:text-3xl font-serif font-black text-slate-900 tracking-tight">
            Occasions & Celebrations Directory
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Create, customize, and manage multiple wedding, birthday, festival, and milestone invitations with independent guest registries and seating.
          </p>
        </div>

        <button
          onClick={() => setIsCreateModalOpen(true)}
          className="inline-flex items-center gap-2 px-5 py-3 rounded-2xl bg-gradient-to-r from-purple-600 via-pink-600 to-amber-500 hover:from-purple-700 hover:to-amber-600 text-white font-bold text-xs sm:text-sm shadow-lg shadow-purple-600/25 transition-all transform active:scale-95 shrink-0"
        >
          <Plus className="w-4 h-4 stroke-[3]" />
          <span>Create New Occasion</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="p-4 sm:p-5 rounded-2xl bg-white border border-slate-200/80 shadow-sm flex flex-col md:flex-row items-center justify-between gap-3">
        {/* Search */}
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search occasion, title or host..."
            className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-purple-200"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
          {/* Category Filter */}
          <div className="flex items-center gap-1.5 bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-semibold text-slate-700">
            <Filter className="w-3.5 h-3.5 text-slate-400" />
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="bg-transparent focus:outline-none cursor-pointer"
            >
              {OCCASION_CATEGORIES.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-semibold text-slate-700 focus:outline-none cursor-pointer"
          >
            <option value="ALL">All Statuses</option>
            <option value="ACTIVE">Active Only</option>
            <option value="INACTIVE">Inactive Only</option>
          </select>
        </div>
      </div>

      {/* Occasions Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredOccasions.map((occ) => {
          const catalogItem = OCCASIONS_CATALOG.find(c => c.id === occ.occasionType) || OCCASIONS_CATALOG[0];
          const isSelectedContext = String(occ.id) === String(activeOccasionId);

          // Count guests for this occasion
          const occGuests = allGuests.filter(g => String(g.occasionId) === String(occ.id));
          const attendingCount = occGuests.filter(g => g.attendanceStatus === 'Attending').length;
          const totalMembers = occGuests
            .filter(g => g.attendanceStatus === 'Attending')
            .reduce((sum, g) => sum + (Number(g.totalMembers) || 0), 0);

          return (
            <div
              key={occ.id}
              className={`rounded-3xl border bg-white shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between overflow-hidden group ${
                isSelectedContext
                  ? 'border-purple-600 ring-2 ring-purple-500/25'
                  : 'border-slate-200/90'
              }`}
            >
              {/* Card Top Banner with Visual Category Badge */}
              <div className="p-6 pb-4">
                <div className="flex items-start justify-between gap-2 mb-3">
                  <div className="flex items-center gap-2.5">
                    <div className="w-12 h-12 rounded-2xl bg-purple-100 flex items-center justify-center text-2xl shadow-inner shrink-0">
                      {catalogItem.emoji}
                    </div>
                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-purple-700 bg-purple-50 px-2 py-0.5 rounded-full border border-purple-200">
                        {catalogItem.name}
                      </span>
                      <h3 className="font-serif font-bold text-base text-slate-900 mt-1 line-clamp-1 group-hover:text-purple-700 transition-colors">
                        {occ.occasionName}
                      </h3>
                    </div>
                  </div>

                  {/* Active / Inactive Status pill */}
                  <button
                    onClick={() => onToggleActive(occ.id)}
                    title="Click to toggle status"
                    className={`inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-1 rounded-full transition-all ${
                      occ.isActive
                        ? 'bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-100'
                        : 'bg-slate-100 text-slate-500 border border-slate-200 hover:bg-slate-200'
                    }`}
                  >
                    <Power className="w-3 h-3" />
                    <span>{occ.isActive ? 'Active' : 'Inactive'}</span>
                  </button>
                </div>

                {/* Subtitle / Tagline */}
                <p className="text-xs text-slate-500 line-clamp-2 min-h-[32px]">
                  {occ.tagline || occ.title}
                </p>

                {/* Date & Venue meta */}
                <div className="mt-4 pt-3 border-t border-slate-100 space-y-1.5 text-xs text-slate-600">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-3.5 h-3.5 text-purple-600 shrink-0" />
                    <span className="font-semibold text-slate-800">{occ.displayDate || occ.eventDate}</span>
                    {occ.partyStartTime && <span className="text-slate-400">({occ.displayTime || occ.partyStartTime})</span>}
                  </div>

                  <div className="flex items-center gap-2">
                    <MapPin className="w-3.5 h-3.5 text-pink-500 shrink-0" />
                    <span className="truncate">{occ.venueName}</span>
                  </div>
                </div>

                {/* Guest Stats Pill Bar */}
                <div className="mt-4 grid grid-cols-2 gap-2 bg-slate-50 p-2.5 rounded-2xl border border-slate-100 text-center text-xs">
                  <div>
                    <span className="text-slate-400 text-[10px] uppercase font-bold block">RSVPs</span>
                    <strong className="text-purple-900 text-sm font-bold">{attendingCount} Attending</strong>
                  </div>
                  <div>
                    <span className="text-slate-400 text-[10px] uppercase font-bold block">Members</span>
                    <strong className="text-pink-700 text-sm font-bold">{totalMembers} Heads</strong>
                  </div>
                </div>
              </div>

              {/* Card Action Footers */}
              <div className="p-4 bg-slate-50/80 border-t border-slate-100 space-y-2">
                
                {/* Primary Button: Context switch or preview */}
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => onSelectActiveOccasion(occ.id)}
                    className={`py-2 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
                      isSelectedContext
                        ? 'bg-purple-600 text-white shadow-sm'
                        : 'bg-white text-purple-700 border border-purple-200 hover:bg-purple-50'
                    }`}
                  >
                    {isSelectedContext ? (
                      <>
                        <Check className="w-3.5 h-3.5 stroke-[3]" />
                        <span>Active Context</span>
                      </>
                    ) : (
                      <span>Select Dashboard</span>
                    )}
                  </button>

                  <a
                    href={`/invite/${occ.occasionType}/${occ.id}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="py-2 px-3 rounded-xl text-xs font-bold bg-white text-slate-700 border border-slate-200 hover:bg-slate-100 transition-all flex items-center justify-center gap-1.5"
                  >
                    <Eye className="w-3.5 h-3.5 text-purple-600" />
                    <span>Live Page</span>
                  </a>
                </div>

                {/* Sub-actions toolbar */}
                <div className="flex items-center justify-between pt-1 border-t border-slate-200/60 text-xs">
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => onEditOccasion(occ)}
                      className="p-1.5 rounded-lg text-slate-500 hover:text-purple-700 hover:bg-purple-100 transition-all"
                      title="Edit Occasion Fields"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                    </button>

                    <button
                      onClick={() => onOpenThemeDesigner(occ)}
                      className="p-1.5 rounded-lg text-slate-500 hover:text-pink-600 hover:bg-pink-100 transition-all"
                      title="Theme Designer"
                    >
                      <Palette className="w-3.5 h-3.5" />
                    </button>

                    <button
                      onClick={() => onManageGuests(occ.id)}
                      className="p-1.5 rounded-lg text-slate-500 hover:text-blue-600 hover:bg-blue-100 transition-all"
                      title="Manage Occasion Guests"
                    >
                      <Users className="w-3.5 h-3.5" />
                    </button>

                    <button
                      onClick={() => onManageSeating(occ.id)}
                      className="p-1.5 rounded-lg text-slate-500 hover:text-amber-600 hover:bg-amber-100 transition-all"
                      title="Manage Seating Arrangement"
                    >
                      <Armchair className="w-3.5 h-3.5" />
                    </button>

                    <button
                      onClick={() => handleCopyLink(occ)}
                      className="p-1.5 rounded-lg text-slate-500 hover:text-emerald-700 hover:bg-emerald-100 transition-all"
                      title="Copy Public Invitation URL"
                    >
                      {copiedId === occ.id ? (
                        <Check className="w-3.5 h-3.5 text-emerald-600" />
                      ) : (
                        <Copy className="w-3.5 h-3.5" />
                      )}
                    </button>
                  </div>

                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => onDuplicateOccasion(occ.id)}
                      className="text-[11px] font-semibold text-purple-700 hover:underline px-1"
                    >
                      Duplicate
                    </button>

                    {occasions.length > 1 && (
                      <button
                        onClick={() => {
                          if (window.confirm(`Are you sure you want to permanently delete "${occ.occasionName}" and its guest list?`)) {
                            onDeleteOccasion(occ.id);
                          }
                        }}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-all"
                        title="Delete Occasion"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Create New Occasion Modal */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm overflow-y-auto">
          <div className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-slate-100 overflow-hidden my-8 text-left animate-scale-up">
            
            {/* Modal Header */}
            <div className="p-6 bg-gradient-to-r from-purple-700 via-pink-600 to-amber-500 text-white flex items-center justify-between">
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-pink-200">New Celebration</span>
                <h3 className="text-xl font-bold font-serif">Create New Occasion</h3>
              </div>
              <button
                onClick={() => setIsCreateModalOpen(false)}
                className="w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleCreateSubmit} className="p-6 space-y-5">
              
              {/* Category selector */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-2">
                  Select Occasion Celebration Category (1 of 18) *
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 max-h-48 overflow-y-auto p-1 border rounded-2xl bg-slate-50">
                  {OCCASIONS_CATALOG.map((item) => (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => setNewOccasionType(item.id)}
                      className={`p-2.5 rounded-xl text-left border transition-all flex items-center gap-2 ${
                        newOccasionType === item.id
                          ? 'border-purple-600 bg-white ring-2 ring-purple-300 shadow-sm'
                          : 'border-slate-200/80 bg-white/80 hover:bg-white'
                      }`}
                    >
                      <span className="text-xl">{item.emoji}</span>
                      <div className="truncate">
                        <span className="font-bold text-xs text-slate-900 block truncate">{item.name}</span>
                        <span className="text-[10px] text-slate-400 block truncate">{item.category}</span>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Form Fields */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Occasion Name *
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Sharma Family Diwali Utsav"
                    value={newOccasionName}
                    onChange={(e) => setNewOccasionName(e.target.value)}
                    required
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-purple-200"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Celebration Headline / Title *
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Festival of Lights & Prosperity"
                    value={newOccasionTitle}
                    onChange={(e) => setNewOccasionTitle(e.target.value)}
                    required
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-purple-200"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Host / Family / Organizers
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. The Sharma Family"
                    value={newHostName}
                    onChange={(e) => setNewHostName(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-purple-200"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Event Date *
                  </label>
                  <input
                    type="date"
                    value={newEventDate}
                    onChange={(e) => setNewEventDate(e.target.value)}
                    required
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-purple-200"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Venue Name & City
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. The Grand Crystal Ballroom, Bengaluru"
                    value={newVenueName}
                    onChange={(e) => setNewVenueName(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-purple-200"
                  />
                </div>
              </div>

              {/* Submit / Cancel */}
              <div className="pt-3 flex items-center justify-end gap-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsCreateModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold text-slate-600 hover:bg-slate-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl text-xs sm:text-sm font-bold text-white bg-purple-600 hover:bg-purple-700 shadow-md shadow-purple-600/30"
                >
                  Create & Launch Occasion
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
