import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Invitation from './pages/Invitation';
import AdminLogin from './pages/AdminLogin';
import AdminDashboard from './pages/AdminDashboard';
import {
  getStoredBirthday,
  getStoredGuests,
  getStoredTables,
  saveStoredGuests,
  saveStoredTables,
  resetToDefaultData,
  getAdminAuth,
} from './utils/storage';
import { recalculateTableOccupancy } from './utils/seating';

function AppContent() {
  const [birthdayDetails, setBirthdayDetails] = useState(getStoredBirthday);
  const [guests, setGuests] = useState(getStoredGuests);
  const [tables, setTables] = useState(() => getStoredTables(getStoredGuests()));
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState(getAdminAuth);

  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith('/admin');

  // Keep tables occupancy synced with guests whenever guests change
  const syncGuestsAndTables = (updatedGuests, customTables = null) => {
    const baseTables = customTables || tables;
    const recalculated = recalculateTableOccupancy(baseTables, updatedGuests);
    setGuests(updatedGuests);
    setTables(recalculated);
    saveStoredGuests(updatedGuests);
    saveStoredTables(recalculated);
  };

  // RSVP Submission from Public Page
  const handleSaveRSVP = (newGuest) => {
    // Check if duplicate mobile exists
    const existingIndex = guests.findIndex(g => g.mobileNumber === newGuest.mobileNumber);
    let updatedGuests;
    if (existingIndex >= 0) {
      updatedGuests = [...guests];
      updatedGuests[existingIndex] = { ...updatedGuests[existingIndex], ...newGuest };
    } else {
      updatedGuests = [newGuest, ...guests];
    }
    syncGuestsAndTables(updatedGuests);
  };

  // Add or Edit guest from Admin
  const handleSaveGuestFromAdmin = (guest) => {
    const index = guests.findIndex(g => g.id === guest.id);
    let updated;
    if (index >= 0) {
      updated = [...guests];
      updated[index] = guest;
    } else {
      updated = [guest, ...guests];
    }
    syncGuestsAndTables(updated);
  };

  // Delete guest from Admin
  const handleDeleteGuest = (guestId) => {
    const updated = guests.filter(g => g.id !== guestId);
    syncGuestsAndTables(updated);
  };

  // Add new banquet table
  const handleAddTable = (newTable) => {
    const updatedTables = [...tables, newTable];
    syncGuestsAndTables(guests, updatedTables);
  };

  // Update existing table capacity
  const handleUpdateTableCapacity = (tableId, newCapacity) => {
    const updatedTables = tables.map(t =>
      t.id === tableId ? { ...t, capacity: Math.max(1, newCapacity) } : t
    );
    syncGuestsAndTables(guests, updatedTables);
  };

  // Import guest list from JSON file
  const handleImportGuests = (importedGuests) => {
    syncGuestsAndTables(importedGuests);
  };

  // Reset to initial demo default data
  const handleResetDefaults = () => {
    const { birthday, guests: defGuests, tables: defTables } = resetToDefaultData();
    setBirthdayDetails(birthday);
    setGuests(defGuests);
    setTables(defTables);
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-800">
      {/* Universal Top Navigation */}
      <Navbar />

      {/* Main Routed Content */}
      <div className="flex-1">
        <Routes>
          {/* Public Invitation Page */}
          <Route
            path="/"
            element={
              <Invitation
                birthdayDetails={birthdayDetails}
                tables={tables}
                guests={guests}
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

          {/* Admin Dashboard (Protected Demo Route) */}
          <Route
            path="/admin"
            element={
              isAdminAuthenticated ? (
                <AdminDashboard
                  birthdayDetails={birthdayDetails}
                  tables={tables}
                  guests={guests}
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
      {!isAdminRoute && <Footer birthdayDetails={birthdayDetails} />}
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
