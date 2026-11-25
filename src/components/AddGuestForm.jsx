import React, { useState, useEffect } from 'react';
import { UserPlus, User, Phone, Users, MessageSquare, AlertCircle, CheckCircle2, Sparkles, Check } from 'lucide-react';
import TableSelector from './TableSelector';
import { canTableAccommodate } from '../utils/seating';
import { validateGuestMobile } from '../utils/validation';

export default function AddGuestForm({
  tables,
  guests,
  onSaveGuest,
  onViewGuestList,
}) {
  const [guestName, setGuestName] = useState('');
  const [mobileNumber, setMobileNumber] = useState('');
  const [totalMembers, setTotalMembers] = useState(1);
  const [attendanceStatus, setAttendanceStatus] = useState('Attending');
  const [tableNumber, setTableNumber] = useState('');
  const [message, setMessage] = useState('');
  const [errors, setErrors] = useState({});
  const [successInfo, setSuccessInfo] = useState(null);

  // If table capacity changes or total members change, check if table can still accommodate
  useEffect(() => {
    if (tableNumber && attendanceStatus === 'Attending') {
      const check = canTableAccommodate(tableNumber, totalMembers, tables, guests);
      if (!check.valid) {
        setTableNumber('');
      }
    }
  }, [totalMembers, tables, guests, tableNumber, attendanceStatus]);

  const validate = () => {
    const errs = {};

    if (!guestName.trim()) {
      errs.guestName = 'Guest full name is required.';
    } else if (guestName.trim().length < 2) {
      errs.guestName = 'Name must be at least 2 characters.';
    }

    // Strict Unique Mobile Validation
    const mobileCheck = validateGuestMobile(mobileNumber, guests, null);
    if (!mobileCheck.valid) {
      errs.mobileNumber = mobileCheck.error;
    }

    if (attendanceStatus === 'Attending') {
      if (!totalMembers || totalMembers < 1) {
        errs.totalMembers = 'Party size must be at least 1.';
      } else if (totalMembers > 10) {
        errs.totalMembers = 'Maximum group capacity per booking is 10.';
      }

      if (!tableNumber) {
        errs.tableNumber = 'Please assign a seating table for attending guests.';
      } else {
        const check = canTableAccommodate(tableNumber, totalMembers, tables, guests);
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

    const mobileCheck = validateGuestMobile(mobileNumber, guests, null);
    const newGuest = {
      id: Date.now(),
      guestName: guestName.trim(),
      mobileNumber: mobileCheck.normalized,
      totalMembers: attendanceStatus === 'Attending' ? Number(totalMembers) : 0,
      tableNumber: attendanceStatus === 'Attending' ? Number(tableNumber) : 0,
      attendanceStatus,
      message: message.trim(),
      registeredAt: new Date().toISOString(),
    };

    onSaveGuest(newGuest);
    setSuccessInfo(newGuest);

    // Reset form
    setGuestName('');
    setMobileNumber('');
    setTotalMembers(1);
    setTableNumber('');
    setMessage('');
    setAttendanceStatus('Attending');
    setErrors({});

    setTimeout(() => {
      setSuccessInfo(null);
    }, 6000);
  };

  return (
    <div className="space-y-6 text-left max-w-4xl">
      {/* Title */}
      <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200/80 shadow-sm flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <div className="w-8 h-8 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center font-bold">
              <UserPlus className="w-4 h-4" />
            </div>
            <h2 className="text-xl sm:text-2xl font-serif font-bold text-slate-900">
              Manual Guest Registration
            </h2>
          </div>
          <p className="text-xs sm:text-sm text-slate-500">
            Directly register VIPs and guests from the admin panel with strict mobile deduplication and real-time seating availability.
          </p>
        </div>

        {onViewGuestList && (
          <button
            type="button"
            onClick={onViewGuestList}
            className="px-4 py-2.5 rounded-xl border border-purple-200 text-purple-700 hover:bg-purple-50 text-xs sm:text-sm font-bold transition-all shrink-0"
          >
            View Guest Roster ({guests.length})
          </button>
        )}
      </div>

      {/* Success Notification */}
      {successInfo && (
        <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs sm:text-sm font-medium flex items-center justify-between shadow-sm animate-fade-in">
          <div className="flex items-center gap-2.5">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
            <div>
              <strong>"{successInfo.guestName}"</strong> has been successfully registered!{' '}
              {successInfo.attendanceStatus === 'Attending' ? (
                <span>Assigned to Table {successInfo.tableNumber} with party of {successInfo.totalMembers}.</span>
              ) : (
                <span>Marked as Not Attending.</span>
              )}
            </div>
          </div>
          <button
            onClick={() => setSuccessInfo(null)}
            className="text-emerald-700 hover:text-emerald-900 font-bold text-xs ml-3"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Form Card */}
      <form onSubmit={handleSubmit} className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-sm space-y-6">
        
        {/* Attendance Status Selection */}
        <div>
          <label className="block text-xs font-bold text-slate-700 mb-2">
            Attendance Status *
          </label>
          <div className="grid grid-cols-2 gap-3 max-w-md">
            <button
              type="button"
              onClick={() => setAttendanceStatus('Attending')}
              className={`p-3 rounded-2xl text-xs sm:text-sm font-bold border transition-all flex items-center justify-center gap-2 ${
                attendanceStatus === 'Attending'
                  ? 'bg-purple-600 text-white border-purple-600 shadow-md shadow-purple-600/20'
                  : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
              }`}
            >
              <Sparkles className="w-4 h-4 text-gold-300" />
              <span>Attending</span>
            </button>

            <button
              type="button"
              onClick={() => setAttendanceStatus('Declined')}
              className={`p-3 rounded-2xl text-xs sm:text-sm font-bold border transition-all flex items-center justify-center gap-2 ${
                attendanceStatus === 'Declined'
                  ? 'bg-slate-800 text-white border-slate-800 shadow-md'
                  : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
              }`}
            >
              <span>Not Attending (Declined)</span>
            </button>
          </div>
        </div>

        {/* Guest Details */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          {/* Full Name */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Guest Full Name *
            </label>
            <div className="relative">
              <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={guestName}
                onChange={(e) => setGuestName(e.target.value)}
                placeholder="e.g. Ramesh Chandra"
                className={`w-full pl-10 pr-3.5 py-2.5 rounded-xl border text-sm text-slate-900 focus:outline-none focus:ring-2 transition-all ${
                  errors.guestName ? 'border-rose-400 focus:ring-rose-200' : 'border-slate-200 focus:ring-purple-200 focus:border-purple-500'
                }`}
              />
            </div>
            {errors.guestName && (
              <p className="text-xs text-rose-600 mt-1 flex items-center gap-1 font-medium">
                <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                {errors.guestName}
              </p>
            )}
          </div>

          {/* Mobile Number */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Mobile Number (10-digit Indian) *
            </label>
            <div className="relative">
              <Phone className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="tel"
                value={mobileNumber}
                onChange={(e) => setMobileNumber(e.target.value)}
                placeholder="e.g. 9876543210"
                maxLength={14}
                className={`w-full pl-10 pr-3.5 py-2.5 rounded-xl border text-sm text-slate-900 focus:outline-none focus:ring-2 transition-all ${
                  errors.mobileNumber ? 'border-rose-400 focus:ring-rose-200' : 'border-slate-200 focus:ring-purple-200 focus:border-purple-500'
                }`}
              />
            </div>
            {errors.mobileNumber ? (
              <p className="text-xs text-rose-600 mt-1 flex items-start gap-1 font-medium">
                <AlertCircle className="w-3.5 h-3.5 shrink-0 mt-0.5" />
                <span>{errors.mobileNumber}</span>
              </p>
            ) : (
              <span className="text-[11px] text-slate-400 mt-1 block">
                Must be unique. A mobile number can register only once.
              </span>
            )}
          </div>
        </div>

        {/* Attending Specific Fields */}
        {attendanceStatus === 'Attending' && (
          <div className="space-y-5 pt-3 border-t border-slate-100">
            {/* Number of Members */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Number of Members Attending (Party Size) *
              </label>
              <div className="flex items-center gap-2 max-w-md">
                {[1, 2, 3, 4, 5, 6, 7, 8].map((num) => (
                  <button
                    key={num}
                    type="button"
                    onClick={() => setTotalMembers(num)}
                    className={`flex-1 py-2 rounded-xl text-xs sm:text-sm font-bold border transition-all ${
                      totalMembers === num
                        ? 'bg-purple-600 text-white border-purple-600 shadow-sm scale-105'
                        : 'bg-slate-50 text-slate-700 border-slate-200 hover:border-purple-300'
                    }`}
                  >
                    {num}
                  </button>
                ))}
              </div>
              <span className="text-[11px] text-slate-500 mt-1 block">
                Party of {totalMembers} including lead guest.
              </span>
              {errors.totalMembers && (
                <p className="text-xs text-rose-600 mt-1 flex items-center gap-1 font-medium">
                  <AlertCircle className="w-3.5 h-3.5" />
                  {errors.totalMembers}
                </p>
              )}
            </div>

            {/* Dynamic Table Selector */}
            <TableSelector
              tables={tables}
              selectedTableId={tableNumber}
              onSelectTable={(id) => setTableNumber(id)}
              partySize={totalMembers}
              error={errors.tableNumber}
            />
          </div>
        )}

        {/* Optional Message */}
        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1">
            Optional Notes / Special Wishes
          </label>
          <div className="relative">
            <MessageSquare className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
            <textarea
              rows={2}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="e.g. VIP guest, dietary preferences, or birthday greeting..."
              className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-slate-200 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-purple-200 focus:border-purple-500 resize-none"
            ></textarea>
          </div>
        </div>

        {/* Submit Button */}
        <div className="pt-2 flex justify-end">
          <button
            type="submit"
            className="w-full sm:w-auto px-8 py-3.5 rounded-2xl font-bold text-white bg-gradient-to-r from-purple-600 via-pink-600 to-amber-500 hover:from-purple-700 hover:to-amber-600 shadow-lg shadow-purple-600/30 transition-all flex items-center justify-center gap-2 transform active:scale-95"
          >
            <Check className="w-4 h-4" />
            <span>Confirm & Register Guest</span>
          </button>
        </div>
      </form>
    </div>
  );
}
