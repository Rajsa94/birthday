import React, { useState, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  LayoutDashboard,
  CalendarDays,
  PlusCircle,
  Palette,
  Users,
  Armchair,
  Image as ImageIcon,
  BarChart3,
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
  Eye,
  Settings,
  PartyPopper,
  Calendar,
  Check,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import DashboardCard from '../components/DashboardCard';
import GuestTable from '../components/GuestTable';
import SeatingCards from '../components/SeatingCards';
import GuestModal from '../components/GuestModal';
import OccasionContextBar from '../components/OccasionContextBar';
import OccasionManager from '../components/OccasionManager';
import OccasionSummaryTable from '../components/OccasionSummaryTable';
import ThemeDesigner from '../components/ThemeDesigner';
import DynamicOccasionForm from '../components/DynamicOccasionForm';
import AddGuestForm from '../components/AddGuestForm';
import ImageGalleryManager from '../components/ImageGalleryManager';
import BirthdaySummaryCard from '../components/BirthdaySummaryCard';
import { exportToExcel, exportMasterOccasionsExcel } from '../utils/excelExport';
import { downloadJSON, validateGuestImport } from '../utils/jsonExport';
import { setAdminAuth } from '../utils/storage';

export default function AdminDashboard({
  occasions = [],
  activeOccasionId,
  allGuests = [],
  currentOccasionGuests = [],
  currentOccasionTables = [],
  onSelectActiveOccasion,
  onCreateOccasion,
  onUpdateOccasion,
  onDeleteOccasion,
  onDuplicateOccasion,
  onToggleOccasionActive,
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
  // 'overview' | 'occasions' | 'create-occasion' | 'theme-designer' | 'add-guest' | 'guests' | 'seating' | 'gallery' | 'reports' | 'data' | 'occasion-settings'
  const [activeTab, setActiveTab] = useState('overview');

  // Occasion being edited in DynamicOccasionForm (defaults to active occasion)
  const activeOccasion = occasions.find(o => String(o.id) === String(activeOccasionId)) || occasions[0] || {};
  const [editingOccasion, setEditingOccasion] = useState(activeOccasion);

  // Guest edit modal state
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

  // Global Platform Metrics Calculation
  const totalOccasions = occasions.length;
  const activeOccasionsCount = occasions.filter(o => o.isActive).length;
  const totalRegisteredGuests = allGuests.length;
  const totalMembersAttending = allGuests
    .filter(g => g.attendanceStatus === 'Attending')
    .reduce((sum, g) => sum + (Number(g.totalMembers) || 0), 0);

  const todayStr = new Date().toISOString().split('T')[0];
  const upcomingCount = occasions.filter(o => (o.eventDate || '') >= todayStr).length;
  const completedCount = totalOccasions - upcomingCount;

  // Active Occasion Specific Metrics
  const occGuests = currentOccasionGuests;
  const occAttending = occGuests.filter(g => g.attendanceStatus === 'Attending');
  const occDeclined = occGuests.filter(g => g.attendanceStatus === 'Declined');
  const occAttendingMembers = occAttending.reduce((sum, g) => sum + (Number(g.totalMembers) || 0), 0);

  const occTables = currentOccasionTables;
  const occTotalSeats = occTables.reduce((sum, t) => sum + (Number(t.capacity) || 0), 0);
  const occOccupiedSeats = occTables.reduce((sum, t) => sum + (Number(t.occupiedSeats) || 0), 0);
  const occAvailableSeats = Math.max(0, occTotalSeats - occOccupiedSeats);
  const occOccupancyRate = occTotalSeats > 0 ? Math.round((occOccupiedSeats / occTotalSeats) * 100) : 0;

  // Excel Exports
  const handleExportSingleExcel = () => {
    try {
      exportToExcel(currentOccasionGuests, currentOccasionTables, activeOccasion);
      showBanner(`Excel report for "${activeOccasion.occasionName}" downloaded!`);
      confetti({ particleCount: 50, spread: 45, origin: { y: 0.2 } });
    } catch (err) {
      showBanner('Failed to generate Excel file: ' + err.message, 'error');
    }
  };

  const handleExportMasterExcel = () => {
    try {
      exportMasterOccasionsExcel(occasions, allGuests);
      showBanner('Master Excel workbook with all celebrations & guests downloaded!');
      confetti({ particleCount: 60, spread: 50, origin: { y: 0.2 } });
    } catch (err) {
      showBanner('Failed to generate Master Excel: ' + err.message, 'error');
    }
  };

  // JSON Exports
  const handleExportAllOccasionsJSON = () => {
    downloadJSON(occasions, 'celebrations-all-occasions.json');
    showBanner('All occasions exported as celebrations-all-occasions.json');
  };

  const handleExportActiveOccasionJSON = () => {
    downloadJSON(activeOccasion, `${activeOccasion.id}-details.json`);
    showBanner(`Occasion details downloaded as ${activeOccasion.id}-details.json`);
  };

  const handleExportAllGuestsJSON = () => {
    downloadJSON(allGuests, 'all-occasions-guests.json');
    showBanner('All guests across all occasions exported as all-occasions-guests.json');
  };

  // JSON Import
  const handleTriggerFileInput = () => {
    if (fileInputRef.current) fileInputRef.current.click();
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

        // Tag imported guests with active occasion ID if not present
        const taggedGuests = validation.guests.map(g => ({
          ...g,
          occasionId: g.occasionId || activeOccasion.id,
        }));

        onImportGuests(taggedGuests);
        showBanner(`Successfully imported ${taggedGuests.length} guests into "${activeOccasion.occasionName}"!`);
      } catch (err) {
        showBanner('Invalid JSON syntax: ' + err.message, 'error');
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  const handleOpenEditOccasion = (occ) => {
    setEditingOccasion(occ);
    onSelectActiveOccasion(occ.id);
    setActiveTab('occasion-settings');
  };

  const handleOpenThemeDesigner = (occ) => {
    onSelectActiveOccasion(occ.id);
    setActiveTab('theme-designer');
  };

  const handleManageOccasionGuests = (occId) => {
    onSelectActiveOccasion(occId);
    setActiveTab('guests');
  };

  const handleManageOccasionSeating = (occId) => {
    onSelectActiveOccasion(occId);
    setActiveTab('seating');
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

      {/* Modern Sidebar Navigation */}
      <aside className="w-full md:w-64 bg-slate-900 text-slate-200 border-r border-slate-800 flex flex-col shrink-0">
        
        {/* Brand header */}
        <div className="p-6 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-purple-500 via-pink-500 to-amber-400 flex items-center justify-center text-white shadow-md">
              <PartyPopper className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-serif font-bold text-base text-white leading-tight">CelebrationOS</h2>
              <span className="text-[11px] text-pink-400 font-medium">Multi-Occasion Platform</span>
            </div>
          </div>
        </div>

        {/* Navigation Items (Sections 11 & 14) */}
        <nav className="p-3.5 space-y-1 flex-1 text-xs sm:text-sm font-semibold overflow-y-auto">
          
          {/* 1. Dashboard */}
          <button
            onClick={() => setActiveTab('overview')}
            className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl transition-all ${
              activeTab === 'overview'
                ? 'bg-purple-600 text-white shadow-md shadow-purple-600/30'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            <LayoutDashboard className="w-4 h-4" />
            <span>Dashboard</span>
          </button>

          {/* 2. All Occasions */}
          <button
            onClick={() => setActiveTab('occasions')}
            className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl transition-all ${
              activeTab === 'occasions'
                ? 'bg-purple-600 text-white shadow-md shadow-purple-600/30'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            <div className="flex items-center gap-3">
              <CalendarDays className="w-4 h-4" />
              <span>All Occasions</span>
            </div>
            <span className="text-[10px] bg-slate-800 px-2 py-0.5 rounded-full text-purple-300">
              {occasions.length}
            </span>
          </button>

          {/* 3. Create Occasion */}
          <button
            onClick={() => setActiveTab('create-occasion')}
            className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl transition-all ${
              activeTab === 'create-occasion'
                ? 'bg-purple-600 text-white shadow-md shadow-purple-600/30'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            <PlusCircle className="w-4 h-4 text-pink-400" />
            <span>Create Occasion</span>
          </button>

          {/* 4. Theme Designer */}
          <button
            onClick={() => setActiveTab('theme-designer')}
            className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl transition-all ${
              activeTab === 'theme-designer'
                ? 'bg-purple-600 text-white shadow-md shadow-purple-600/30'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            <Palette className="w-4 h-4 text-amber-400" />
            <span>Theme Designer</span>
          </button>

          {/* 5. Guest Management */}
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
            <span className="text-[10px] bg-slate-800 px-2 py-0.5 rounded-full text-slate-300">
              {currentOccasionGuests.length}
            </span>
          </button>

          {/* 6. Seating Management */}
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
            <span className="text-[10px] bg-slate-800 px-2 py-0.5 rounded-full text-slate-300">
              {currentOccasionTables.length}
            </span>
          </button>

          {/* 7. Media Gallery */}
          <button
            onClick={() => setActiveTab('gallery')}
            className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl transition-all ${
              activeTab === 'gallery'
                ? 'bg-purple-600 text-white shadow-md shadow-purple-600/30'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            <div className="flex items-center gap-3">
              <ImageIcon className="w-4 h-4" />
              <span>Media Gallery</span>
            </div>
            <span className="text-[10px] bg-slate-800 px-2 py-0.5 rounded-full text-slate-300">
              {(activeOccasion.galleryImages || []).length}
            </span>
          </button>

          {/* 8. Reports & Analytics */}
          <button
            onClick={() => setActiveTab('reports')}
            className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl transition-all ${
              activeTab === 'reports'
                ? 'bg-purple-600 text-white shadow-md shadow-purple-600/30'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            <BarChart3 className="w-4 h-4 text-emerald-400" />
            <span>Reports & Analytics</span>
          </button>

          {/* 9. JSON Backup */}
          <button
            onClick={() => setActiveTab('data')}
            className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl transition-all ${
              activeTab === 'data'
                ? 'bg-purple-600 text-white shadow-md shadow-purple-600/30'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            <FileSpreadsheet className="w-4 h-4" />
            <span>JSON Backup</span>
          </button>

          {/* 10. Occasion Settings */}
          <button
            onClick={() => {
              setEditingOccasion(activeOccasion);
              setActiveTab('occasion-settings');
            }}
            className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl transition-all ${
              activeTab === 'occasion-settings'
                ? 'bg-purple-600 text-white shadow-md shadow-purple-600/30'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            <Settings className="w-4 h-4" />
            <span>Occasion Settings</span>
          </button>
        </nav>

        {/* Sidebar Footer */}
        <div className="p-4 border-t border-slate-800 space-y-2">
          <button
            onClick={handleExportMasterExcel}
            className="w-full py-2.5 px-3 rounded-xl bg-emerald-600/90 hover:bg-emerald-600 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-sm transition-all"
            title="Download Excel report across all occasions"
          >
            <FileSpreadsheet className="w-4 h-4" />
            <span>Master Excel (.xlsx)</span>
          </button>

          <a
            href={`/invite/${activeOccasion.occasionType}/${activeOccasion.id}`}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full py-2 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white text-xs font-semibold flex items-center justify-center gap-2 transition-all"
          >
            <Eye className="w-3.5 h-3.5" />
            <span>Live Invitation</span>
          </a>

          {/* 11. Logout */}
          <button
            onClick={handleLogout}
            className="w-full py-2 px-3 rounded-xl text-xs font-semibold text-rose-400 hover:bg-rose-500/10 flex items-center justify-center gap-2 transition-all"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Main Content Pane */}
      <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto w-full space-y-6">
        
        {/* Global Context Bar: Switch active celebration with 1 click */}
        <OccasionContextBar
          occasions={occasions}
          activeOccasionId={activeOccasionId}
          onSelectOccasion={(id) => {
            onSelectActiveOccasion(id);
            showBanner(`Active occasion context set to "${occasions.find(o => o.id === id)?.occasionName}"`);
          }}
          onOpenCreateOccasion={() => setActiveTab('create-occasion')}
        />

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

        {/* TAB 1: OVERVIEW DASHBOARD */}
        {activeTab === 'overview' && (
          <div className="space-y-6 text-left">
            {/* Global Metrics Cards across all celebrations */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <DashboardCard
                title="Total Occasions"
                value={totalOccasions}
                subtitle={`${activeOccasionsCount} Active Celebrations`}
                icon={CalendarDays}
                colorScheme="purple"
              />

              <DashboardCard
                title="Total Registered Guests"
                value={totalRegisteredGuests}
                subtitle="All guest registrations across platform"
                icon={Users}
                colorScheme="blue"
              />

              <DashboardCard
                title="Members Attending"
                value={totalMembersAttending}
                subtitle="Aggregate confirmed attendees"
                icon={PartyPopper}
                colorScheme="pink"
              />

              <DashboardCard
                title="Upcoming Celebrations"
                value={upcomingCount}
                subtitle={`${completedCount} past celebration events`}
                icon={Sparkles}
                colorScheme="amber"
              />
            </div>

            {/* Active Occasion Focused Overview */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-purple-700">
                  Focused Celebration Overview
                </span>
                <button
                  onClick={() => setActiveTab('occasions')}
                  className="text-xs font-bold text-purple-700 hover:underline"
                >
                  Manage All Occasions ({occasions.length}) →
                </button>
              </div>

              {/* Birthday / Occasion Summary Card */}
              <BirthdaySummaryCard
                birthdayDetails={activeOccasion}
                totalRegisteredGuests={occGuests.length}
                totalMembersAttending={occAttendingMembers}
                onEditClick={() => {
                  setEditingOccasion(activeOccasion);
                  setActiveTab('occasion-settings');
                }}
              />
            </div>

            {/* Occasion Summary Table (Section 8) */}
            <OccasionSummaryTable
              occasions={occasions}
              allGuests={allGuests}
              activeOccasionId={activeOccasionId}
              onSelectOccasion={(id) => onSelectActiveOccasion(id)}
              onEditOccasion={handleOpenEditOccasion}
              onManageGuests={handleManageOccasionGuests}
              onManageSeating={handleManageOccasionSeating}
            />
          </div>
        )}

        {/* TAB 2: ALL OCCASIONS */}
        {activeTab === 'occasions' && (
          <OccasionManager
            occasions={occasions}
            activeOccasionId={activeOccasionId}
            allGuests={allGuests}
            onSelectActiveOccasion={(id) => {
              onSelectActiveOccasion(id);
              showBanner('Active occasion context updated!');
            }}
            onCreateOccasion={(newOcc) => {
              const created = onCreateOccasion(newOcc);
              showBanner(`Occasion "${created.occasionName}" created successfully!`);
              return created;
            }}
            onEditOccasion={handleOpenEditOccasion}
            onOpenThemeDesigner={handleOpenThemeDesigner}
            onManageGuests={handleManageOccasionGuests}
            onManageSeating={handleManageOccasionSeating}
            onDuplicateOccasion={(id) => {
              const dup = onDuplicateOccasion(id);
              showBanner(`Duplicated occasion as "${dup.occasionName}"!`);
            }}
            onToggleActive={(id) => {
              onToggleOccasionActive(id);
              showBanner('Occasion status updated.');
            }}
            onDeleteOccasion={(id) => {
              onDeleteOccasion(id);
              showBanner('Occasion and its guest registry deleted.');
            }}
          />
        )}

        {/* TAB 3: CREATE OCCASION */}
        {activeTab === 'create-occasion' && (
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-sm text-left max-w-4xl mx-auto space-y-5">
            <div>
              <h2 className="text-2xl font-serif font-bold text-slate-900">
                Launch a New Occasion Celebration
              </h2>
              <p className="text-xs text-slate-500 mt-1">
                Select from 18 celebration categories with dynamic themes and custom fields.
              </p>
            </div>

            <DynamicOccasionForm
              occasion={{
                occasionType: 'wedding',
                occasionName: 'New Royal Celebration',
                title: 'Grand Celebration 2026',
                eventDate: new Date(Date.now() + 20 * 86400000).toISOString().split('T')[0],
                partyStartTime: '19:00',
                partyEndTime: '23:00',
                venueName: 'The Royal Ballroom',
                venueAddress: '108 Grand Avenue',
                invitationMessage: 'You are cordially invited to celebrate with us!',
                hostContact: '9876543210',
                seatingEnabled: true,
              }}
              onSaveOccasion={(newOccData) => {
                const created = onCreateOccasion(newOccData);
                showBanner(`Celebration "${created.occasionName}" launched!`);
                setActiveTab('occasions');
              }}
              onCancel={() => setActiveTab('occasions')}
            />
          </div>
        )}

        {/* TAB 4: THEME DESIGNER */}
        {activeTab === 'theme-designer' && (
          <ThemeDesigner
            currentOccasion={activeOccasion}
            onSaveThemeSettings={(themeData) => {
              onUpdateOccasion(activeOccasion.id, themeData);
              showBanner('Custom theme saved & applied to public invitation!');
            }}
          />
        )}

        {/* TAB 5: GUEST MANAGEMENT */}
        {activeTab === 'guests' && (
          <div className="space-y-4 text-left">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 bg-white p-5 rounded-2xl border border-slate-200">
              <div>
                <h3 className="text-lg font-bold font-serif text-slate-900">
                  Guest Registry: {activeOccasion.occasionName}
                </h3>
                <p className="text-xs text-slate-500">
                  Separate guest list for this celebration with unique 10-digit mobile number deduplication.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setActiveTab('add-guest')}
                  className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs flex items-center gap-1.5 shadow-sm"
                >
                  <Plus className="w-4 h-4" />
                  <span>Register Guest</span>
                </button>
              </div>
            </div>

            <GuestTable
              guests={currentOccasionGuests}
              tables={currentOccasionTables}
              onEditGuest={(guest) => {
                setGuestToEdit(guest);
                setIsGuestModalOpen(true);
              }}
              onDeleteGuest={onDeleteGuest}
              occasion={activeOccasion}
            />
          </div>
        )}

        {/* TAB 6: SEATING MANAGEMENT */}
        {activeTab === 'seating' && (
          <div className="space-y-4 text-left">
            {!activeOccasion.seatingEnabled && (
              <div className="p-4 bg-amber-50 border border-amber-200 rounded-2xl text-amber-900 text-xs font-semibold flex items-center justify-between">
                <span>Note: Banquet table seating is currently disabled in Occasion Settings for this celebration.</span>
                <button
                  onClick={() => onUpdateOccasion(activeOccasion.id, { seatingEnabled: true })}
                  className="px-3 py-1 bg-amber-600 text-white rounded-lg text-xs"
                >
                  Enable Seating
                </button>
              </div>
            )}

            <SeatingCards
              tables={currentOccasionTables}
              guests={currentOccasionGuests}
              onUpdateTableCapacity={onUpdateTableCapacity}
              onAddTable={onAddTable}
            />
          </div>
        )}

        {/* TAB 7: ADD GUEST */}
        {activeTab === 'add-guest' && (
          <AddGuestForm
            tables={currentOccasionTables}
            guests={currentOccasionGuests}
            occasion={activeOccasion}
            onSaveGuest={(g) => {
              onSaveGuest({ ...g, occasionId: activeOccasion.id });
              showBanner(`Guest "${g.guestName}" registered for "${activeOccasion.occasionName}"!`);
            }}
            onViewGuestList={() => setActiveTab('guests')}
          />
        )}

        {/* TAB 8: MEDIA GALLERY */}
        {activeTab === 'gallery' && (
          <ImageGalleryManager
            galleryImages={activeOccasion.galleryImages || []}
            onUpdateGallery={(updatedGallery) => {
              onUpdateOccasion(activeOccasion.id, { galleryImages: updatedGallery });
              showBanner('Occasion media gallery updated!');
            }}
          />
        )}

        {/* TAB 9: REPORTS & ANALYTICS */}
        {activeTab === 'reports' && (
          <div className="space-y-6 text-left">
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-sm space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-4 border-b border-slate-100">
                <div>
                  <h3 className="font-serif font-bold text-xl text-slate-900">
                    Platform Analytics & Multi-Occasion Reports
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Consolidated attendance statistics, guest capacity breakdowns, and multi-sheet Excel generation.
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={handleExportSingleExcel}
                    className="px-4 py-2 rounded-xl bg-purple-50 hover:bg-purple-100 text-purple-700 border border-purple-200 text-xs font-bold flex items-center gap-1.5"
                  >
                    <FileSpreadsheet className="w-4 h-4 text-purple-600" />
                    <span>Occasion Excel</span>
                  </button>

                  <button
                    onClick={handleExportMasterExcel}
                    className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold flex items-center gap-1.5 shadow-sm"
                  >
                    <Download className="w-4 h-4" />
                    <span>Download Master Excel</span>
                  </button>
                </div>
              </div>

              {/* Attendance Breakdown Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
                <div className="p-5 rounded-2xl bg-purple-50 border border-purple-100">
                  <span className="text-xs font-bold text-purple-700 uppercase">Total Guest RSVPs</span>
                  <div className="text-3xl font-extrabold text-purple-950 font-serif mt-1">
                    {totalRegisteredGuests}
                  </div>
                  <p className="text-[11px] text-slate-500 mt-1">Across {totalOccasions} active and past events</p>
                </div>

                <div className="p-5 rounded-2xl bg-emerald-50 border border-emerald-100">
                  <span className="text-xs font-bold text-emerald-700 uppercase">Confirmed Attending</span>
                  <div className="text-3xl font-extrabold text-emerald-950 font-serif mt-1">
                    {totalMembersAttending}
                  </div>
                  <p className="text-[11px] text-slate-500 mt-1">Attending members to seat and cater</p>
                </div>

                <div className="p-5 rounded-2xl bg-amber-50 border border-amber-100">
                  <span className="text-xs font-bold text-amber-700 uppercase">Active Occasions</span>
                  <div className="text-3xl font-extrabold text-amber-950 font-serif mt-1">
                    {activeOccasionsCount}
                  </div>
                  <p className="text-[11px] text-slate-500 mt-1">Currently accepting guest RSVPs</p>
                </div>
              </div>

              {/* Occasion Table Breakdown in Reports */}
              <OccasionSummaryTable
                occasions={occasions}
                allGuests={allGuests}
                activeOccasionId={activeOccasionId}
                onSelectOccasion={(id) => onSelectActiveOccasion(id)}
                onEditOccasion={handleOpenEditOccasion}
                onManageGuests={handleManageOccasionGuests}
                onManageSeating={handleManageOccasionSeating}
              />
            </div>
          </div>
        )}

        {/* TAB 10: JSON BACKUP & RESTORE */}
        {activeTab === 'data' && (
          <div className="space-y-6 text-left">
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-sm space-y-6">
              <div>
                <h3 className="font-serif font-bold text-xl text-slate-900">
                  JSON Data Portability, Master Backup & Sync
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Export complete platform databases, individual celebration configs, or restore from a backup JSON.
                </p>
              </div>

              {/* Export Buttons Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                <div className="p-5 rounded-2xl border border-emerald-200 bg-emerald-50/50 flex flex-col justify-between">
                  <div>
                    <FileSpreadsheet className="w-8 h-8 text-emerald-600 mb-2" />
                    <h4 className="font-bold text-sm text-slate-900">Master Excel (.xlsx)</h4>
                    <p className="text-[11px] text-slate-500 mt-1">Multi-sheet report of all occasions & guests.</p>
                  </div>
                  <button
                    onClick={handleExportMasterExcel}
                    className="mt-4 py-2 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs"
                  >
                    Download Master Excel
                  </button>
                </div>

                <div className="p-5 rounded-2xl border border-purple-200 bg-purple-50/50 flex flex-col justify-between">
                  <div>
                    <FileJson className="w-8 h-8 text-purple-600 mb-2" />
                    <h4 className="font-bold text-sm text-slate-900">All Occasions (JSON)</h4>
                    <p className="text-[11px] text-slate-500 mt-1">Exports all {occasions.length} occasion definitions.</p>
                  </div>
                  <button
                    onClick={handleExportAllOccasionsJSON}
                    className="mt-4 py-2 px-3 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs"
                  >
                    Export Occasions JSON
                  </button>
                </div>

                <div className="p-5 rounded-2xl border border-blue-200 bg-blue-50/50 flex flex-col justify-between">
                  <div>
                    <Users className="w-8 h-8 text-blue-600 mb-2" />
                    <h4 className="font-bold text-sm text-slate-900">All Guests (JSON)</h4>
                    <p className="text-[11px] text-slate-500 mt-1">Exports all {allGuests.length} guest records.</p>
                  </div>
                  <button
                    onClick={handleExportAllGuestsJSON}
                    className="mt-4 py-2 px-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs"
                  >
                    Export Guests JSON
                  </button>
                </div>

                <div className="p-5 rounded-2xl border border-amber-200 bg-amber-50/50 flex flex-col justify-between">
                  <div>
                    <Sparkles className="w-8 h-8 text-amber-500 mb-2" />
                    <h4 className="font-bold text-sm text-slate-900">Active Occasion JSON</h4>
                    <p className="text-[11px] text-slate-500 mt-1">Backup config for "{activeOccasion.occasionName}".</p>
                  </div>
                  <button
                    onClick={handleExportActiveOccasionJSON}
                    className="mt-4 py-2 px-3 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs"
                  >
                    Export Active Occasion
                  </button>
                </div>
              </div>

              {/* Import & Reset */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-slate-100">
                <div className="p-5 rounded-2xl border border-slate-200 bg-slate-50 flex flex-col justify-between">
                  <div>
                    <Upload className="w-8 h-8 text-slate-700 mb-2" />
                    <h4 className="font-bold text-sm text-slate-900">Import Guest Dataset (JSON)</h4>
                    <p className="text-xs text-slate-500 mt-1">
                      Upload a JSON array of guests to populate the active celebration.
                    </p>
                  </div>
                  <button
                    onClick={handleTriggerFileInput}
                    className="mt-4 py-2.5 px-3 rounded-xl bg-slate-900 hover:bg-black text-white font-bold text-xs"
                  >
                    Select JSON File
                  </button>
                </div>

                <div className="p-5 rounded-2xl border border-rose-200 bg-rose-50/50 flex flex-col justify-between">
                  <div>
                    <RotateCcw className="w-8 h-8 text-rose-600 mb-2" />
                    <h4 className="font-bold text-sm text-rose-950">Reset Platform to Seed Defaults</h4>
                    <p className="text-xs text-slate-500 mt-1">
                      Clears local modifications and restores all seed occasions and demo guests.
                    </p>
                  </div>
                  <button
                    onClick={() => {
                      if (window.confirm('Reset platform to default seed occasions and guests?')) {
                        onResetDefaults();
                        showBanner('Platform restored to default seed celebrations.');
                      }
                    }}
                    className="mt-4 py-2.5 px-3 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs"
                  >
                    Reset All Data
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 11: OCCASION SETTINGS (DYNAMIC FORM) */}
        {activeTab === 'occasion-settings' && (
          <DynamicOccasionForm
            occasion={editingOccasion}
            onSaveOccasion={(updated) => {
              onUpdateOccasion(updated.id, updated);
              setEditingOccasion(updated);
              showBanner(`Occasion "${updated.occasionName}" updated successfully!`);
            }}
            onCancel={() => setActiveTab('overview')}
          />
        )}
      </main>

      {/* Guest Edit Modal */}
      <GuestModal
        isOpen={isGuestModalOpen}
        onClose={() => {
          setIsGuestModalOpen(false);
          setGuestToEdit(null);
        }}
        guestToEdit={guestToEdit}
        tables={currentOccasionTables}
        guests={currentOccasionGuests}
        onSaveGuest={onSaveGuest}
      />
    </div>
  );
}
