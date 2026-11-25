import React, { useState, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  LayoutDashboard,
  Users,
  Armchair,
  FileSpreadsheet,
  FileJson,
  Upload,
  Download,
  RotateCcw,
  Plus,
  LogOut,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  Check,
  Eye,
  Settings,
  PartyPopper
} from 'lucide-react';
import confetti from 'canvas-confetti';
import DashboardCard from '../components/DashboardCard';
import GuestTable from '../components/GuestTable';
import SeatingCards from '../components/SeatingCards';
import GuestModal from '../components/GuestModal';
import { exportToExcel } from '../utils/excelExport';
import { downloadJSON, validateGuestImport } from '../utils/jsonExport';
import { setAdminAuth } from '../utils/storage';

export default function AdminDashboard({
  birthdayDetails,
  tables,
  guests,
  onSaveGuest,
  onDeleteGuest,
  onAddTable,
  onUpdateTableCapacity,
  onImportGuests,
  onResetDefaults,
}) {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);

  // Active navigation tab
  const [activeTab, setActiveTab] = useState('overview'); // 'overview' | 'guests' | 'seating' | 'data'

  // Guest edit/add modal state
  const [isGuestModalOpen, setIsGuestModalOpen] = useState(false);
  const [guestToEdit, setGuestToEdit] = useState(null);

  // Toast / Status banner
  const [bannerMessage, setBannerMessage] = useState(null);

  const showBanner = (msg, type = 'success') => {
    setBannerMessage({ msg, type });
    setTimeout(() => {
      setBannerMessage(null);
    }, 4500);
  };

  const handleLogout = () => {
    setAdminAuth(false);
    navigate('/admin/login');
  };

  // Metrics calculation
  const totalRegisteredGuests = guests.length;
  const attendingGuests = guests.filter(g => g.attendanceStatus === 'Attending');
  const declinedGuests = guests.filter(g => g.attendanceStatus === 'Declined');
  const totalMembersAttending = attendingGuests.reduce((sum, g) => sum + (Number(g.totalMembers) || 0), 0);

  const totalTables = tables.length;
  const totalSeats = tables.reduce((sum, t) => sum + (Number(t.capacity) || 0), 0);
  const occupiedSeats = tables.reduce((sum, t) => sum + (Number(t.occupiedSeats) || 0), 0);
  const availableSeats = Math.max(0, totalSeats - occupiedSeats);
  const occupancyRate = totalSeats > 0 ? Math.round((occupiedSeats / totalSeats) * 100) : 0;

  // Excel Export
  const handleExportExcel = () => {
    try {
      exportToExcel(guests, tables, birthdayDetails);
      showBanner('Excel workbook (.xlsx) successfully downloaded with Guest List and Table Summary sheets!');
      confetti({
        particleCount: 50,
        spread: 45,
        origin: { y: 0.2 },
      });
    } catch (err) {
      showBanner('Failed to generate Excel file: ' + err.message, 'error');
    }
  };

  // JSON Exports
  const handleExportGuestJSON = () => {
    downloadJSON(guests, 'birthday-guests.json');
    showBanner('All guest records downloaded as birthday-guests.json');
  };

  const handleExportTableJSON = () => {
    downloadJSON(tables, 'birthday-tables.json');
    showBanner('All table seating data downloaded as birthday-tables.json');
  };

  // JSON Import
  const handleTriggerFileInput = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const parsed = JSON.parse(event.target.result);
        const validation = validateGuestImport(parsed);
        if (!validation.valid) {
          showBanner(validation.message, 'error');
          return;
        }

        onImportGuests(validation.guests);
        showBanner(`Successfully imported ${validation.guests.length} guest records! Table seating recalculated.`);
      } catch (err) {
        showBanner('Invalid JSON syntax in file: ' + err.message, 'error');
      }
    };
    reader.readAsText(file);
    e.target.value = ''; // reset file input
  };

  const handleOpenAddGuest = () => {
    setGuestToEdit(null);
    setIsGuestModalOpen(true);
  };

  const handleOpenEditGuest = (guest) => {
    setGuestToEdit(guest);
    setIsGuestModalOpen(true);
  };

  const handleResetData = () => {
    if (window.confirm('Are you sure you want to restore the initial demo data? Any unsaved local edits will be reset.')) {
      onResetDefaults();
      showBanner('Application state reset to initial JSON default data.');
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 flex flex-col md:flex-row">
      
      {/* Hidden file input for JSON import */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept=".json,application/json"
        className="hidden"
      />

      {/* Sidebar Navigation */}
      <aside className="w-full md:w-64 bg-slate-900 text-slate-200 border-r border-slate-800 flex flex-col shrink-0">
        
        {/* Brand header */}
        <div className="p-6 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-purple-500 to-pink-500 flex items-center justify-center text-white shadow-md">
              <PartyPopper className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-serif font-bold text-base text-white">Event Admin</h2>
              <span className="text-[11px] text-pink-400 font-medium">{birthdayDetails.personName}'s Bash</span>
            </div>
          </div>
        </div>

        {/* Navigation Links */}
        <nav className="p-4 space-y-1.5 flex-1 text-xs sm:text-sm font-semibold">
          <button
            onClick={() => setActiveTab('overview')}
            className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl transition-all ${
              activeTab === 'overview'
                ? 'bg-purple-600 text-white shadow-md shadow-purple-600/30'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            <LayoutDashboard className="w-4 h-4" />
            <span>Dashboard Overview</span>
          </button>

          <button
            onClick={() => setActiveTab('guests')}
            className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl transition-all ${
              activeTab === 'guests'
                ? 'bg-purple-600 text-white shadow-md shadow-purple-600/30'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            <div className="flex items-center gap-3">
              <Users className="w-4 h-4" />
              <span>Guest Management</span>
            </div>
            <span className="text-[11px] bg-slate-800 px-2 py-0.5 rounded-full text-slate-300">
              {guests.length}
            </span>
          </button>

          <button
            onClick={() => setActiveTab('seating')}
            className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl transition-all ${
              activeTab === 'seating'
                ? 'bg-purple-600 text-white shadow-md shadow-purple-600/30'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            <div className="flex items-center gap-3">
              <Armchair className="w-4 h-4" />
              <span>Seating Management</span>
            </div>
            <span className="text-[11px] bg-slate-800 px-2 py-0.5 rounded-full text-slate-300">
              {tables.length}
            </span>
          </button>

          <button
            onClick={() => setActiveTab('data')}
            className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl transition-all ${
              activeTab === 'data'
                ? 'bg-purple-600 text-white shadow-md shadow-purple-600/30'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            <FileSpreadsheet className="w-4 h-4" />
            <span>Excel & JSON Data</span>
          </button>
        </nav>

        {/* Quick Excel Download button on Sidebar */}
        <div className="p-4 border-t border-slate-800 space-y-2">
          <button
            onClick={handleExportExcel}
            className="w-full py-2.5 px-3 rounded-xl bg-emerald-600/90 hover:bg-emerald-600 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-sm transition-all"
          >
            <FileSpreadsheet className="w-4 h-4" />
            <span>Download Excel (.xlsx)</span>
          </button>

          <Link
            to="/"
            target="_blank"
            className="w-full py-2 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white text-xs font-semibold flex items-center justify-center gap-2 transition-all"
          >
            <Eye className="w-3.5 h-3.5" />
            <span>Preview Public Page</span>
          </Link>

          <button
            onClick={handleLogout}
            className="w-full py-2 px-3 rounded-xl text-xs font-semibold text-rose-400 hover:bg-rose-500/10 flex items-center justify-center gap-2 transition-all"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto w-full space-y-6">
        
        {/* Top Header Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-4 border-b border-slate-200">
          <div>
            <h1 className="text-2xl sm:text-3xl font-serif font-black text-slate-900 tracking-tight">
              {activeTab === 'overview' && 'Event & Guest Dashboard'}
              {activeTab === 'guests' && 'Guest Roster & Registrations'}
              {activeTab === 'seating' && 'Banquet Seating Arrangement'}
              {activeTab === 'data' && 'Data Sync, Import & Export'}
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Celebrating {birthdayDetails.personName}'s 25th • {birthdayDetails.displayDate}
            </p>
          </div>

          {/* Action Toolbar */}
          <div className="flex flex-wrap items-center gap-2.5">
            <button
              onClick={handleOpenAddGuest}
              className="px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold text-white bg-purple-600 hover:bg-purple-700 shadow-sm flex items-center gap-1.5 transition-all"
            >
              <Plus className="w-4 h-4" />
              <span>Add Guest</span>
            </button>

            <button
              onClick={handleExportExcel}
              className="px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold text-emerald-800 bg-emerald-100 hover:bg-emerald-200 border border-emerald-300 flex items-center gap-1.5 transition-all shadow-xs"
            >
              <Download className="w-4 h-4 text-emerald-700" />
              <span>Excel Export</span>
            </button>
          </div>
        </div>

        {/* Status / Alert Banner */}
        {bannerMessage && (
          <div
            className={`p-4 rounded-2xl text-xs sm:text-sm font-medium flex items-center justify-between shadow-sm animate-fade-in ${
              bannerMessage.type === 'error'
                ? 'bg-rose-50 text-rose-800 border border-rose-200'
                : 'bg-emerald-50 text-emerald-800 border border-emerald-200'
            }`}
          >
            <div className="flex items-center gap-2">
              {bannerMessage.type === 'error' ? (
                <AlertCircle className="w-5 h-5 text-rose-600 shrink-0" />
              ) : (
                <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
              )}
              <span>{bannerMessage.msg}</span>
            </div>
            <button
              onClick={() => setBannerMessage(null)}
              className="text-slate-400 hover:text-slate-700 text-xs ml-2"
            >
              Dismiss
            </button>
          </div>
        )}

        {/* TAB 1: OVERVIEW */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
            
            {/* 7 Summary Cards as requested by user */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <DashboardCard
                title="Total Registered Guests"
                value={totalRegisteredGuests}
                subtitle={`${attendingGuests.length} Attending • ${declinedGuests.length} Declined`}
                icon={Users}
                colorScheme="purple"
              />

              <DashboardCard
                title="Members Attending"
                value={totalMembersAttending}
                subtitle="Total heads expected at venue"
                icon={PartyPopper}
                colorScheme="pink"
                badge={`${attendingGuests.length} groups`}
              />

              <DashboardCard
                title="Total Tables"
                value={totalTables}
                subtitle="Configured banquet seating tables"
                icon={Armchair}
                colorScheme="blue"
              />

              <DashboardCard
                title="Total Seats"
                value={totalSeats}
                subtitle="Aggregate capacity across tables"
                icon={Armchair}
                colorScheme="amber"
              />

              <DashboardCard
                title="Occupied Seats"
                value={occupiedSeats}
                subtitle={`${occupancyRate}% of total banquet capacity`}
                icon={CheckCircle2}
                colorScheme="emerald"
                badge={`${occupancyRate}%`}
              />

              <DashboardCard
                title="Available Seats"
                value={availableSeats}
                subtitle={`${availableSeats > 0 ? 'Seats ready for RSVP' : 'Venue is at maximum capacity'}`}
                icon={Sparkles}
                colorScheme={availableSeats > 0 ? 'emerald' : 'rose'}
              />

              <DashboardCard
                title="Guests Not Attending"
                value={declinedGuests.length}
                subtitle="Politely declined with best wishes"
                icon={AlertCircle}
                colorScheme="rose"
              />

              <div className="rounded-2xl p-5 border border-purple-200 bg-gradient-to-br from-purple-100/70 to-pink-100/50 flex flex-col justify-between">
                <div>
                  <span className="text-xs font-bold uppercase tracking-wider text-purple-700">Quick Excel Report</span>
                  <h4 className="text-sm font-bold text-slate-800 mt-1">Export Complete Roster</h4>
                  <p className="text-xs text-slate-500 mt-1">Multi-sheet workbook with guests & tables.</p>
                </div>
                <button
                  onClick={handleExportExcel}
                  className="mt-3 w-full py-2 px-3 rounded-xl bg-purple-700 hover:bg-purple-800 text-white text-xs font-bold shadow-sm transition-all flex items-center justify-center gap-1.5"
                >
                  <FileSpreadsheet className="w-3.5 h-3.5" />
                  <span>Download .xlsx</span>
                </button>
              </div>
            </div>

            {/* Visual Analytics & Capacity Distribution Section */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 text-left">
              
              {/* Seating distribution card */}
              <div className="lg:col-span-2 bg-white rounded-2xl p-6 border border-slate-200/80 shadow-sm space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-serif font-bold text-lg text-slate-900">
                      Table Occupancy Breakdown
                    </h3>
                    <p className="text-xs text-slate-500">Live seat utilization across banquet tables</p>
                  </div>
                  <button
                    onClick={() => setActiveTab('seating')}
                    className="text-xs font-bold text-purple-700 hover:underline"
                  >
                    Manage Seating →
                  </button>
                </div>

                <div className="space-y-3 pt-2">
                  {tables.map(t => {
                    const pct = Math.min(100, Math.round((t.occupiedSeats / t.capacity) * 100));
                    const isFull = t.availableSeats <= 0;
                    return (
                      <div key={t.id} className="space-y-1">
                        <div className="flex items-center justify-between text-xs font-medium">
                          <span className="font-bold text-slate-800">{t.tableName || `Table ${t.id}`}</span>
                          <span className="text-slate-500">
                            {t.occupiedSeats} / {t.capacity} Seats ({pct}%)
                            {isFull && <strong className="text-rose-600 ml-1.5 font-bold">[FULL]</strong>}
                          </span>
                        </div>
                        <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden">
                          <div
                            className={`h-full rounded-full transition-all duration-300 ${
                              isFull ? 'bg-rose-500' : pct > 70 ? 'bg-amber-500' : 'bg-purple-600'
                            }`}
                            style={{ width: `${pct}%` }}
                          ></div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Attendance Breakdown Card */}
              <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-sm flex flex-col justify-between">
                <div>
                  <h3 className="font-serif font-bold text-lg text-slate-900">
                    Attendance Status
                  </h3>
                  <p className="text-xs text-slate-500">Breakdown of responses received</p>

                  <div className="my-6 space-y-3">
                    <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-100 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full bg-emerald-500"></div>
                        <span className="text-xs font-bold text-emerald-900">Attending</span>
                      </div>
                      <span className="text-sm font-extrabold text-emerald-950 font-serif">
                        {attendingGuests.length} RSVPs ({totalMembersAttending} Guests)
                      </span>
                    </div>

                    <div className="p-3 rounded-xl bg-rose-50 border border-rose-100 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full bg-rose-500"></div>
                        <span className="text-xs font-bold text-rose-900">Declined</span>
                      </div>
                      <span className="text-sm font-extrabold text-rose-950 font-serif">
                        {declinedGuests.length} Guests
                      </span>
                    </div>
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-100 text-xs text-slate-500">
                  Total registration responses: <strong>{totalRegisteredGuests}</strong>
                </div>
              </div>
            </div>

            {/* Recent Guests preview */}
            <div className="space-y-3 text-left">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-bold font-serif text-slate-900">
                  Guest Registry Overview
                </h3>
                <button
                  onClick={() => setActiveTab('guests')}
                  className="text-xs font-bold text-purple-700 hover:underline"
                >
                  View All Guests ({guests.length}) →
                </button>
              </div>

              <GuestTable
                guests={guests}
                tables={tables}
                onEditGuest={handleOpenEditGuest}
                onDeleteGuest={onDeleteGuest}
              />
            </div>
          </div>
        )}

        {/* TAB 2: GUEST MANAGEMENT */}
        {activeTab === 'guests' && (
          <div className="space-y-4">
            <GuestTable
              guests={guests}
              tables={tables}
              onEditGuest={handleOpenEditGuest}
              onDeleteGuest={onDeleteGuest}
            />
          </div>
        )}

        {/* TAB 3: SEATING MANAGEMENT */}
        {activeTab === 'seating' && (
          <SeatingCards
            tables={tables}
            guests={guests}
            onUpdateTableCapacity={onUpdateTableCapacity}
            onAddTable={onAddTable}
          />
        )}

        {/* TAB 4: DATA EXPORT & IMPORT */}
        {activeTab === 'data' && (
          <div className="space-y-6 text-left">
            <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-sm space-y-4">
              <div>
                <h3 className="text-xl font-serif font-bold text-slate-900">
                  Data Persistence & Synchronized Backups
                </h3>
                <p className="text-xs text-slate-500 mt-1">
                  Export your live application state to Excel (.xlsx) and JSON files, or import an existing guest JSON dataset.
                </p>
              </div>

              {/* Technical Notice per requirements */}
              <div className="p-4 bg-purple-50 rounded-2xl border border-purple-200 text-xs text-purple-900 space-y-1">
                <span className="font-bold uppercase tracking-wider text-[11px] text-purple-700 flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-amber-500" />
                  Frontend LocalStorage Persistence Architecture
                </span>
                <p className="text-slate-600">
                  Changes to guests, tables, and reservations are persisted instantaneously in your browser's <strong>LocalStorage</strong> across refreshes. You can also download updated JSON copies or Excel workbooks at any moment.
                </p>
              </div>

              {/* Export Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 pt-2">
                {/* Excel Export */}
                <div className="p-5 rounded-2xl border border-emerald-200 bg-emerald-50/50 flex flex-col justify-between">
                  <div>
                    <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center mb-3 shadow-sm">
                      <FileSpreadsheet className="w-5 h-5" />
                    </div>
                    <h4 className="font-bold text-slate-900 text-sm">Download Excel (.xlsx)</h4>
                    <p className="text-xs text-slate-500 mt-1">
                      Includes 2 sheets: "Guest List" and "Table Summary" with all occupancy numbers.
                    </p>
                  </div>
                  <button
                    onClick={handleExportExcel}
                    className="mt-4 w-full py-2 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-sm transition-all"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Download Excel</span>
                  </button>
                </div>

                {/* JSON Guest Export */}
                <div className="p-5 rounded-2xl border border-purple-200 bg-purple-50/50 flex flex-col justify-between">
                  <div>
                    <div className="w-10 h-10 rounded-xl bg-purple-600 text-white flex items-center justify-center mb-3 shadow-sm">
                      <FileJson className="w-5 h-5" />
                    </div>
                    <h4 className="font-bold text-slate-900 text-sm">Export Guests (JSON)</h4>
                    <p className="text-xs text-slate-500 mt-1">
                      Downloads all {guests.length} guest records in structured JSON array format.
                    </p>
                  </div>
                  <button
                    onClick={handleExportGuestJSON}
                    className="mt-4 w-full py-2 px-3 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-sm transition-all"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Export guests.json</span>
                  </button>
                </div>

                {/* JSON Table Export */}
                <div className="p-5 rounded-2xl border border-blue-200 bg-blue-50/50 flex flex-col justify-between">
                  <div>
                    <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center mb-3 shadow-sm">
                      <Armchair className="w-5 h-5" />
                    </div>
                    <h4 className="font-bold text-slate-900 text-sm">Export Tables (JSON)</h4>
                    <p className="text-xs text-slate-500 mt-1">
                      Downloads all {tables.length} table records with current capacities and seats.
                    </p>
                  </div>
                  <button
                    onClick={handleExportTableJSON}
                    className="mt-4 w-full py-2 px-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-sm transition-all"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Export tables.json</span>
                  </button>
                </div>
              </div>

              {/* Import & Reset Section */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-slate-100">
                {/* Import JSON */}
                <div className="p-5 rounded-2xl border border-slate-200 bg-slate-50 flex flex-col justify-between">
                  <div>
                    <div className="w-10 h-10 rounded-xl bg-slate-800 text-white flex items-center justify-center mb-3">
                      <Upload className="w-5 h-5" />
                    </div>
                    <h4 className="font-bold text-slate-900 text-sm">Import Guest JSON Data</h4>
                    <p className="text-xs text-slate-500 mt-1">
                      Upload an existing JSON array of guests. Table occupancies will be automatically recalculated.
                    </p>
                  </div>
                  <button
                    onClick={handleTriggerFileInput}
                    className="mt-4 w-full py-2.5 px-3 rounded-xl bg-slate-900 hover:bg-black text-white font-bold text-xs flex items-center justify-center gap-1.5 transition-all shadow-sm"
                  >
                    <Upload className="w-3.5 h-3.5" />
                    <span>Choose JSON File to Import</span>
                  </button>
                </div>

                {/* Reset to Default */}
                <div className="p-5 rounded-2xl border border-rose-200 bg-rose-50/40 flex flex-col justify-between">
                  <div>
                    <div className="w-10 h-10 rounded-xl bg-rose-600 text-white flex items-center justify-center mb-3">
                      <RotateCcw className="w-5 h-5" />
                    </div>
                    <h4 className="font-bold text-rose-950 text-sm">Reset to Default Demo State</h4>
                    <p className="text-xs text-slate-500 mt-1">
                      Clears local browser modifications and restores the original guest and table seed records.
                    </p>
                  </div>
                  <button
                    onClick={handleResetData}
                    className="mt-4 w-full py-2.5 px-3 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition-all shadow-sm"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>Reset All Data</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Guest Add / Edit Modal */}
      <GuestModal
        isOpen={isGuestModalOpen}
        onClose={() => {
          setIsGuestModalOpen(false);
          setGuestToEdit(null);
        }}
        guestToEdit={guestToEdit}
        tables={tables}
        guests={guests}
        onSaveGuest={onSaveGuest}
      />
    </div>
  );
}
