import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import InvitationRouteWrapper from './pages/InvitationRouteWrapper';
import AdminLogin from './pages/AdminLogin';
import AdminDashboard from './pages/AdminDashboard';
import {
  getStoredOccasions,
  saveStoredOccasions,
  getOccasionById,
  getActiveOccasionId,
  setActiveOccasionId as persistActiveOccasionId,
  createOccasion,
  updateOccasion,
  deleteOccasion,
  duplicateOccasion,
  toggleOccasionActive,
  getStoredMultiGuests,
  saveStoredMultiGuests,
  getTablesForOccasion,
  saveTablesForOccasion,
} from './utils/occasionStorage';
import { recalculateTableOccupancy } from './utils/seating';
import { normalizeIndianMobile } from './utils/validation';
import { getAdminAuth } from './utils/storage';
import { generateUniquePassId } from './utils/passGenerator';

function AppContent() {
  const [occasions, setOccasions] = useState(getStoredOccasions);
  const [activeOccasionId, setActiveOccasionId] = useState(getActiveOccasionId);
  const [allGuests, setAllGuests] = useState(getStoredMultiGuests);
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState(getAdminAuth);

  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith('/admin');

  // Resolve current active occasion safely
  const safeOccasions = Array.isArray(occasions) && occasions.length > 0 ? occasions : getStoredOccasions();
  const activeOccasion = safeOccasions.find(o => o && String(o.id) === String(activeOccasionId)) || safeOccasions[0];
  const targetOccasionId = activeOccasion?.id || 'occasion-birthday-1';

  // Resolve guests and tables for current active occasion context
  const currentOccasionGuests = (allGuests || []).filter(g => g && String(g.occasionId) === String(targetOccasionId));
  const currentOccasionTables = getTablesForOccasion(targetOccasionId);

  // Sync Active Occasion ID
  const handleSelectActiveOccasion = (id) => {
    setActiveOccasionId(id);
    persistActiveOccasionId(id);
  };

  // RSVP Submission from Public Invitation Page
  const handleSaveRSVP = (newGuest, occasionId) => {
    const targetOccasionId = occasionId || activeOccasionId;
    const norm = normalizeIndianMobile(newGuest.mobileNumber);

    // Enforce unique mobile number per occasion!
    const occGuests = allGuests.filter(g => String(g.occasionId) === String(targetOccasionId));
    const isDuplicate = occGuests.some(g => normalizeIndianMobile(g.mobileNumber) === norm);

    if (isDuplicate) {
      throw new Error('This mobile number is already registered. Please contact the administrator if you need to update your registration.');
    }

    const targetOccasion = occasions.find(o => String(o.id) === String(targetOccasionId)) || occasions[0];
    const passId = newGuest.passId || generateUniquePassId(newGuest, targetOccasion, allGuests.length + 1);

    const sanitizedGuest = {
      ...newGuest,
      occasionId: targetOccasionId,
      mobileNumber: norm,
      passId,
    };

    const updatedAllGuests = [sanitizedGuest, ...allGuests];
    setAllGuests(updatedAllGuests);
    saveStoredMultiGuests(updatedAllGuests);

    // Recalculate seating for that occasion
    const occasionTables = getTablesForOccasion(targetOccasionId);
    const updatedOccasionGuests = updatedAllGuests.filter(g => String(g.occasionId) === String(targetOccasionId));
    const recalculated = recalculateTableOccupancy(occasionTables, updatedOccasionGuests);
    saveTablesForOccasion(targetOccasionId, recalculated);
  };

  // Admin Manual Guest Add or Edit
  const handleSaveGuestFromAdmin = (guest) => {
    const targetOccasionId = guest.occasionId || activeOccasionId;
    const norm = normalizeIndianMobile(guest.mobileNumber);
    const targetOccasion = occasions.find(o => String(o.id) === String(targetOccasionId)) || occasions[0];
    const passId = guest.passId || generateUniquePassId(guest, targetOccasion, allGuests.length + 1);

    const sanitizedGuest = {
      ...guest,
      occasionId: targetOccasionId,
      mobileNumber: norm,
      passId,
    };

    const index = allGuests.findIndex(g => g.id === guest.id);
    let updated;
    if (index >= 0) {
      updated = [...allGuests];
      updated[index] = sanitizedGuest;
    } else {
      updated = [sanitizedGuest, ...allGuests];
    }

    setAllGuests(updated);
    saveStoredMultiGuests(updated);

    // Recalculate seating for target occasion
    const occasionTables = getTablesForOccasion(targetOccasionId);
    const occGuests = updated.filter(g => String(g.occasionId) === String(targetOccasionId));
    const recalculated = recalculateTableOccupancy(occasionTables, occGuests);
    saveTablesForOccasion(targetOccasionId, recalculated);
  };

  // Delete Guest from Admin
  const handleDeleteGuest = (guestId) => {
    const guestToDelete = allGuests.find(g => g.id === guestId);
    const targetOccasionId = guestToDelete?.occasionId || activeOccasionId;

    const updated = allGuests.filter(g => g.id !== guestId);
    setAllGuests(updated);
    saveStoredMultiGuests(updated);

    // Recalculate seating for that occasion
    const occasionTables = getTablesForOccasion(targetOccasionId);
    const occGuests = updated.filter(g => String(g.occasionId) === String(targetOccasionId));
    const recalculated = recalculateTableOccupancy(occasionTables, occGuests);
    saveTablesForOccasion(targetOccasionId, recalculated);
  };

  // Add Table to Active Occasion
  const handleAddTable = (newTable) => {
    const updatedTables = [...currentOccasionTables, newTable];
    const recalculated = recalculateTableOccupancy(updatedTables, currentOccasionGuests);
    saveTablesForOccasion(activeOccasionId, recalculated);
  };

  // Update Table Capacity for Active Occasion
  const handleUpdateTableCapacity = (tableId, newCapacity) => {
    const updatedTables = currentOccasionTables.map(t =>
      t.id === tableId ? { ...t, capacity: Math.max(1, newCapacity) } : t
    );
    const recalculated = recalculateTableOccupancy(updatedTables, currentOccasionGuests);
    saveTablesForOccasion(activeOccasionId, recalculated);
  };

  // Create New Occasion
  const handleCreateOccasion = (newOccData) => {
    const created = createOccasion(newOccData);
    const updatedOccasions = getStoredOccasions();
    setOccasions(updatedOccasions);
    handleSelectActiveOccasion(created.id);
    return created;
  };

  // Update Occasion
  const handleUpdateOccasion = (id, data) => {
    const updated = updateOccasion(id, data);
    setOccasions(getStoredOccasions());
    return updated;
  };

  // Delete Occasion
  const handleDeleteOccasion = (id) => {
    const remaining = deleteOccasion(id);
    setOccasions(remaining);
    setAllGuests(getStoredMultiGuests());
    if (activeOccasionId === id) {
      handleSelectActiveOccasion(remaining[0]?.id || '');
    }
  };

  // Duplicate Occasion
  const handleDuplicateOccasion = (id) => {
    const duplicated = duplicateOccasion(id);
    setOccasions(getStoredOccasions());
    handleSelectActiveOccasion(duplicated.id);
    return duplicated;
  };

  // Toggle Occasion Active
  const handleToggleOccasionActive = (id) => {
    toggleOccasionActive(id);
    setOccasions(getStoredOccasions());
  };

  // Import Guests Dataset
  const handleImportGuests = (importedGuests) => {
    const updated = [...importedGuests, ...allGuests];
    setAllGuests(updated);
    saveStoredMultiGuests(updated);

    const occasionTables = getTablesForOccasion(activeOccasionId);
    const occGuests = updated.filter(g => String(g.occasionId) === String(activeOccasionId));
    saveTablesForOccasion(activeOccasionId, recalculateTableOccupancy(occasionTables, occGuests));
  };

  // Reset Platform to Defaults
  const handleResetDefaults = () => {
    localStorage.removeItem('platform_occasions_v1');
    localStorage.removeItem('platform_active_occasion_id_v1');
    localStorage.removeItem('platform_multi_guests_v1');
    localStorage.removeItem('platform_multi_tables_v1');

    const freshOccasions = getStoredOccasions();
    const freshGuests = getStoredMultiGuests();
    setOccasions(freshOccasions);
    setActiveOccasionId(freshOccasions[0].id);
    setAllGuests(freshGuests);
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-800">
      {/* Universal Top Navigation with Celebrations Switcher */}
      <Navbar currentOccasion={activeOccasion} occasions={occasions} />

      {/* Main Routed Content */}
      <div className="flex-1">
        <Routes>
          {/* Public Invitation: Default / Active Occasion */}
          <Route
            path="/"
            element={
              <InvitationRouteWrapper
                occasions={occasions}
                allGuests={allGuests}
                onSaveRSVP={handleSaveRSVP}
              />
            }
          />

          {/* Public Invitation: Specific Occasion URL (e.g. /invite/wedding/occasion-wedding-2) */}
          <Route
            path="/invite/:occasionType/:id"
            element={
              <InvitationRouteWrapper
                occasions={occasions}
                allGuests={allGuests}
                onSaveRSVP={handleSaveRSVP}
              />
            }
          />

          {/* Short URL /invite/:id */}
          <Route
            path="/invite/:id"
            element={
              <InvitationRouteWrapper
                occasions={occasions}
                allGuests={allGuests}
                onSaveRSVP={handleSaveRSVP}
              />
            }
          />

          {/* Admin Login */}
          <Route
            path="/admin/login"
            element={
              <AdminLogin
                onLoginSuccess={() => setIsAdminAuthenticated(true)}
              />
            }
          />

          {/* Admin Dashboard */}
          <Route
            path="/admin"
            element={
              isAdminAuthenticated ? (
                <AdminDashboard
                  occasions={occasions}
                  activeOccasionId={activeOccasionId}
                  allGuests={allGuests}
                  currentOccasionGuests={currentOccasionGuests}
                  currentOccasionTables={currentOccasionTables}
                  onSelectActiveOccasion={handleSelectActiveOccasion}
                  onCreateOccasion={handleCreateOccasion}
                  onUpdateOccasion={handleUpdateOccasion}
                  onDeleteOccasion={handleDeleteOccasion}
                  onDuplicateOccasion={handleDuplicateOccasion}
                  onToggleOccasionActive={handleToggleOccasionActive}
                  onSaveGuest={handleSaveGuestFromAdmin}
                  onDeleteGuest={handleDeleteGuest}
                  onAddTable={handleAddTable}
                  onUpdateTableCapacity={handleUpdateTableCapacity}
                  onImportGuests={handleImportGuests}
                  onResetDefaults={handleResetDefaults}
                />
              ) : (
                <Navigate to="/admin/login" replace />
              )
            }
          />

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>

      {/* Footer on public pages */}
      {!isAdminRoute && <Footer birthdayDetails={activeOccasion} />}
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  );
}
