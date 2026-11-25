import React, { useState, useEffect } from 'react';
import { X, Check, AlertCircle, User, Phone, Users, MessageSquare } from 'lucide-react';
import { canTableAccommodate } from '../utils/seating';

export default function GuestModal({
  isOpen,
  onClose,
  guestToEdit = null, // null for new guest, object for edit
  tables,
  guests,
  onSaveGuest,
}) {
  const isEditing = Boolean(guestToEdit);

  const [guestName, setGuestName] = useState('');
  const [mobileNumber, setMobileNumber] = useState('');
  const [totalMembers, setTotalMembers] = useState(1);
  const [tableNumber, setTableNumber] = useState('');
  const [attendanceStatus, setAttendanceStatus] = useState('Attending');
  const [message, setMessage] = useState('');
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (guestToEdit) {
      setGuestName(guestToEdit.guestName || '');
      setMobileNumber(guestToEdit.mobileNumber || '');
      setTotalMembers(guestToEdit.totalMembers || 1);
      setTableNumber(guestToEdit.tableNumber || '');
      setAttendanceStatus(guestToEdit.attendanceStatus || 'Attending');
      setMessage(guestToEdit.message || '');
    } else {
      setGuestName('');
      setMobileNumber('');
      setTotalMembers(1);
      setTableNumber('');
      setAttendanceStatus('Attending');
      setMessage('');
    }
    setErrors({});
  }, [guestToEdit, isOpen]);

  if (!isOpen) return null;

  const validate = () => {
    const errs = {};
    if (!guestName.trim()) {
      errs.guestName = 'Guest name is required.';
    }

    const cleanPhone = mobileNumber.replace(/\D/g, '');
    if (!cleanPhone) {
      errs.mobileNumber = 'Mobile number is required.';
    } else if (cleanPhone.length < 10 || cleanPhone.length > 13) {
      errs.mobileNumber = 'Valid 10-digit mobile number required.';
    }

    if (attendanceStatus === 'Attending') {
      if (!totalMembers || totalMembers < 1) {
        errs.totalMembers = 'Party size must be at least 1.';
      }
      if (!tableNumber) {
        errs.tableNumber = 'Please assign a table.';
      } else {
        const check = canTableAccommodate(
          tableNumber,
          totalMembers,
          tables,
          guests,
          guestToEdit ? guestToEdit.id : null
        );
        if (!check.valid) {
          errs.tableNumber = check.message;
        }
      }
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;

    const saved = {
      id: guestToEdit ? guestToEdit.id : Date.now(),
      guestName: guestName.trim(),
      mobileNumber: mobileNumber.replace(/\D/g, ''),
      totalMembers: attendanceStatus === 'Attending' ? Number(totalMembers) : 0,
      tableNumber: attendanceStatus === 'Attending' ? Number(tableNumber) : 0,
      attendanceStatus,
      message: message.trim(),
      registeredAt: guestToEdit ? guestToEdit.registeredAt : new Date().toISOString(),
    };

    onSaveGuest(saved);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-slate-100 overflow-hidden my-8 text-left">
        {/* Header */}
        <div className="p-6 bg-gradient-to-r from-purple-700 to-indigo-800 text-white flex items-center justify-between">
          <div>
            <h3 className="text-xl font-bold font-serif">
              {isEditing ? `Edit Guest: ${guestToEdit.guestName}` : 'Add New Guest Registration'}
            </h3>
            <p className="text-xs text-purple-200 mt-0.5">
              {isEditing ? 'Update guest details and seating assignment' : 'Manually register a guest to the database'}
            </p>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Guest Name */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Guest Full Name *
            </label>
            <div className="relative">
              <User className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={guestName}
                onChange={(e) => setGuestName(e.target.value)}
                placeholder="Full Name"
                className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-slate-200 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-purple-200 focus:border-purple-500"
              />
            </div>
            {errors.guestName && (
              <p className="text-xs text-rose-600 mt-1">{errors.guestName}</p>
            )}
          </div>

          {/* Mobile Number */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Mobile Number *
            </label>
            <div className="relative">
              <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="tel"
                value={mobileNumber}
                onChange={(e) => setMobileNumber(e.target.value)}
                placeholder="10-digit number"
                className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-slate-200 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-purple-200 focus:border-purple-500"
              />
            </div>
            {errors.mobileNumber && (
              <p className="text-xs text-rose-600 mt-1">{errors.mobileNumber}</p>
            )}
          </div>

          {/* Attendance Status */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Attendance Status *
            </label>
            <select
              value={attendanceStatus}
              onChange={(e) => setAttendanceStatus(e.target.value)}
              className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-purple-200 focus:border-purple-500 bg-white"
            >
              <option value="Attending">Attending</option>
              <option value="Declined">Declined (Not Attending)</option>
            </select>
          </div>

          {attendanceStatus === 'Attending' && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Party Size */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Total Members *
                </label>
                <div className="relative">
                  <Users className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="number"
                    min="1"
                    max="10"
                    value={totalMembers}
                    onChange={(e) => setTotalMembers(Number(e.target.value))}
                    className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-slate-200 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-purple-200 focus:border-purple-500"
                  />
                </div>
                {errors.totalMembers && (
                  <p className="text-xs text-rose-600 mt-1">{errors.totalMembers}</p>
                )}
              </div>

              {/* Table assignment */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Assign Table *
                </label>
                <select
                  value={tableNumber}
                  onChange={(e) => setTableNumber(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-purple-200 focus:border-purple-500 bg-white"
                >
                  <option value="">-- Choose Table --</option>
                  {tables.map((t) => (
                    <option key={t.id} value={t.id}>
                      {t.tableName || `Table ${t.id}`} ({t.availableSeats} of {t.capacity} free)
                    </option>
                  ))}
                </select>
                {errors.tableNumber && (
                  <p className="text-xs text-rose-600 mt-1">{errors.tableNumber}</p>
                )}
              </div>
            </div>
          )}

          {/* Message */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Personal Note / Message
            </label>
            <div className="relative">
              <MessageSquare className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              <textarea
                rows={2}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Optional greeting or notes"
                className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-200 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-purple-200 focus:border-purple-500 resize-none"
              ></textarea>
            </div>
          </div>

          {/* Action buttons */}
          <div className="pt-3 flex items-center justify-end gap-3 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl text-sm font-semibold text-slate-600 hover:bg-slate-100 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 rounded-xl text-sm font-bold text-white bg-purple-600 hover:bg-purple-700 shadow-md shadow-purple-600/30 transition-all flex items-center gap-1.5"
            >
              <Check className="w-4 h-4" />
              <span>{isEditing ? 'Save Changes' : 'Add Guest'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
