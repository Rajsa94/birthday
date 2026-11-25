import React, { useState, useEffect } from 'react';
import { X, Check, Heart, Sparkles, AlertCircle, Phone, User, Users, MessageSquare, Calendar, MapPin, Ticket } from 'lucide-react';
import confetti from 'canvas-confetti';
import TableSelector from './TableSelector';
import { canTableAccommodate } from '../utils/seating';

export default function RSVPModal({
  isOpen,
  onClose,
  initialStatus = 'Attending', // 'Attending' | 'Declined'
  tables,
  guests,
  birthdayDetails,
  onSaveRSVP,
}) {
  const [attendanceStatus, setAttendanceStatus] = useState(initialStatus);
  const [guestName, setGuestName] = useState('');
  const [mobileNumber, setMobileNumber] = useState('');
  const [totalMembers, setTotalMembers] = useState(1);
  const [tableNumber, setTableNumber] = useState('');
  const [message, setMessage] = useState('');
  const [errors, setErrors] = useState({});
  const [submittedData, setSubmittedData] = useState(null);

  // Sync initialStatus when modal opens
  useEffect(() => {
    if (isOpen) {
      setAttendanceStatus(initialStatus);
      setErrors({});
      setSubmittedData(null);
    }
  }, [isOpen, initialStatus]);

  // Reset selected table if group size changes and selected table cannot accommodate
  useEffect(() => {
    if (tableNumber && attendanceStatus === 'Attending') {
      const check = canTableAccommodate(tableNumber, totalMembers, tables, guests);
      if (!check.valid) {
        setTableNumber('');
      }
    }
  }, [totalMembers, tables, guests, tableNumber, attendanceStatus]);

  if (!isOpen) return null;

  const validateForm = () => {
    const errs = {};

    if (!guestName.trim()) {
      errs.guestName = 'Please enter your full name.';
    } else if (guestName.trim().length < 2) {
      errs.guestName = 'Name must be at least 2 characters.';
    }

    // Clean mobile: digits only
    const cleanPhone = mobileNumber.replace(/\D/g, '');
    if (!cleanPhone) {
      errs.mobileNumber = 'Mobile number is required.';
    } else if (cleanPhone.length < 10 || cleanPhone.length > 13) {
      errs.mobileNumber = 'Please enter a valid 10-digit mobile number.';
    }

    if (attendanceStatus === 'Attending') {
      if (!totalMembers || totalMembers < 1) {
        errs.totalMembers = 'Party size must be at least 1.';
      } else if (totalMembers > 8) {
        errs.totalMembers = 'Maximum group capacity per booking is 8.';
      }

      if (!tableNumber) {
        errs.tableNumber = 'Please choose a seating table.';
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
    if (!validateForm()) return;

    const newGuest = {
      id: Date.now(),
      guestName: guestName.trim(),
      mobileNumber: mobileNumber.replace(/\D/g, ''),
      totalMembers: attendanceStatus === 'Attending' ? Number(totalMembers) : 0,
      tableNumber: attendanceStatus === 'Attending' ? Number(tableNumber) : 0,
      attendanceStatus,
      message: message.trim(),
      registeredAt: new Date().toISOString(),
    };

    onSaveRSVP(newGuest);
    setSubmittedData(newGuest);

    if (attendanceStatus === 'Attending') {
      confetti({
        particleCount: 120,
        spread: 80,
        origin: { y: 0.5 },
        colors: ['#f59e0b', '#ec4899', '#8b5cf6', '#3b82f6', '#10b981'],
      });
    }
  };

  const handleResetAndClose = () => {
    setGuestName('');
    setMobileNumber('');
    setTotalMembers(1);
    setTableNumber('');
    setMessage('');
    setErrors({});
    setSubmittedData(null);
    onClose();
  };

  const selectedTableObj = tables.find(t => Number(t.id) === Number(tableNumber));

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm overflow-y-auto animate-fade-in">
      <div className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-slate-100 overflow-hidden my-8">
        
        {/* Modal Header */}
        <div className={`p-6 text-white relative ${attendanceStatus === 'Attending' ? 'bg-gradient-to-r from-purple-700 via-pink-600 to-amber-500' : 'bg-gradient-to-r from-slate-700 via-slate-800 to-slate-900'}`}>
          <button
            onClick={handleResetAndClose}
            className="absolute top-4 right-4 w-9 h-9 rounded-full bg-black/20 hover:bg-black/35 flex items-center justify-center text-white transition-all"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-pink-200 mb-1">
            <Sparkles className="w-4 h-4 text-gold-300" />
            <span>Official Guest RSVP</span>
          </div>

          <h3 className="text-2xl font-serif font-bold text-white tracking-tight">
            {submittedData
              ? (attendanceStatus === 'Attending' ? '🎉 RSVP Confirmed!' : '💌 Thank You for Letting Us Know')
              : (attendanceStatus === 'Attending' ? "Reserve Your Spot at Aria's Bash" : 'Send Your Birthday Wishes')}
          </h3>
          <p className="text-xs sm:text-sm text-pink-100/90 mt-1">
            {submittedData
              ? 'Your response has been recorded in the guest management registry.'
              : `${birthdayDetails.displayDate} • ${birthdayDetails.venueName}`}
          </p>
        </div>

        {/* Modal Body */}
        <div className="p-6">
          {submittedData ? (
            /* SUCCESS CONFIRMATION TICKET */
            <div className="space-y-5 text-center py-2 animate-scale-up">
              <div className="w-16 h-16 mx-auto rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center shadow-inner">
                <Check className="w-8 h-8 stroke-[3]" />
              </div>

              <div>
                <h4 className="text-xl font-bold text-slate-900 font-serif">
                  {attendanceStatus === 'Attending'
                    ? `We can't wait to see you, ${submittedData.guestName}!`
                    : `We'll miss you, ${submittedData.guestName}!`}
                </h4>
                <p className="text-sm text-slate-500 mt-1">
                  {attendanceStatus === 'Attending'
                    ? 'Your table reservation has been locked in.'
                    : 'Thank you for sending your heartfelt birthday greetings.'}
                </p>
              </div>

              {attendanceStatus === 'Attending' && (
                <div className="bg-gradient-to-br from-purple-50 to-pink-50 border border-purple-200/80 rounded-2xl p-4 text-left shadow-sm relative overflow-hidden">
                  <div className="absolute top-2 right-2 opacity-10">
                    <Ticket className="w-24 h-24 text-purple-900" />
                  </div>

                  <div className="flex items-center justify-between pb-3 border-b border-purple-200">
                    <div>
                      <span className="text-[11px] font-bold text-purple-600 uppercase tracking-widest">Entry Pass</span>
                      <h5 className="font-bold text-slate-900">{birthdayDetails.celebrationTitle}</h5>
                    </div>
                    <span className="px-2.5 py-1 bg-purple-600 text-white rounded-lg text-xs font-bold shadow-sm">
                      Pass #{submittedData.id.toString().slice(-4)}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-3 pt-3 text-xs">
                    <div>
                      <span className="text-slate-500 block">Lead Guest</span>
                      <span className="font-semibold text-slate-800 text-sm">{submittedData.guestName}</span>
                    </div>
                    <div>
                      <span className="text-slate-500 block">Party Size</span>
                      <span className="font-semibold text-slate-800 text-sm">{submittedData.totalMembers} Member(s)</span>
                    </div>
                    <div>
                      <span className="text-slate-500 block">Assigned Table</span>
                      <span className="font-bold text-purple-700 text-sm">
                        {selectedTableObj ? selectedTableObj.tableName : `Table ${submittedData.tableNumber}`}
                      </span>
                    </div>
                    <div>
                      <span className="text-slate-500 block">Mobile No.</span>
                      <span className="font-semibold text-slate-800 text-sm">+91 {submittedData.mobileNumber}</span>
                    </div>
                  </div>

                  <div className="mt-3 pt-2 border-t border-purple-200/60 flex items-center gap-1.5 text-[11px] text-slate-600">
                    <MapPin className="w-3.5 h-3.5 text-pink-500 shrink-0" />
                    <span className="truncate">{birthdayDetails.venueName}</span>
                  </div>
                </div>
              )}

              <button
                type="button"
                onClick={handleResetAndClose}
                className="w-full py-3 px-6 rounded-xl font-bold text-white bg-purple-600 hover:bg-purple-700 shadow-md shadow-purple-600/30 transition-all"
              >
                Done & Return to Invitation
              </button>
            </div>
          ) : (
            /* RSVP INPUT FORM */
            <form onSubmit={handleSubmit} className="space-y-4 text-left">
              
              {/* Attendance toggle */}
              <div className="grid grid-cols-2 gap-2 p-1 bg-slate-100 rounded-xl">
                <button
                  type="button"
                  onClick={() => setAttendanceStatus('Attending')}
                  className={`py-2 px-3 text-xs sm:text-sm font-bold rounded-lg transition-all flex items-center justify-center gap-1.5 ${
                    attendanceStatus === 'Attending'
                      ? 'bg-white text-purple-700 shadow-sm'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <Sparkles className="w-4 h-4 text-amber-500" />
                  <span>I'll Attend</span>
                </button>
                <button
                  type="button"
                  onClick={() => setAttendanceStatus('Declined')}
                  className={`py-2 px-3 text-xs sm:text-sm font-bold rounded-lg transition-all flex items-center justify-center gap-1.5 ${
                    attendanceStatus === 'Declined'
                      ? 'bg-white text-slate-800 shadow-sm'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <Heart className="w-4 h-4 text-rose-500" />
                  <span>Can't Attend</span>
                </button>
              </div>

              {/* Guest Name */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Guest Full Name <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={guestName}
                    onChange={(e) => setGuestName(e.target.value)}
                    placeholder="e.g. Rajesh Sharma"
                    className={`w-full pl-9 pr-3 py-2.5 rounded-xl border text-sm text-slate-900 focus:outline-none focus:ring-2 transition-all ${
                      errors.guestName ? 'border-rose-400 focus:ring-rose-200' : 'border-slate-200 focus:ring-purple-200 focus:border-purple-500'
                    }`}
                  />
                </div>
                {errors.guestName && (
                  <p className="text-xs text-rose-600 mt-1 flex items-center gap-1">
                    <AlertCircle className="w-3.5 h-3.5" /> {errors.guestName}
                  </p>
                )}
              </div>

              {/* Mobile Number */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Mobile Number <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="tel"
                    value={mobileNumber}
                    onChange={(e) => setMobileNumber(e.target.value)}
                    placeholder="e.g. 9876543210"
                    maxLength={13}
                    className={`w-full pl-9 pr-3 py-2.5 rounded-xl border text-sm text-slate-900 focus:outline-none focus:ring-2 transition-all ${
                      errors.mobileNumber ? 'border-rose-400 focus:ring-rose-200' : 'border-slate-200 focus:ring-purple-200 focus:border-purple-500'
                    }`}
                  />
                </div>
                {errors.mobileNumber && (
                  <p className="text-xs text-rose-600 mt-1 flex items-center gap-1">
                    <AlertCircle className="w-3.5 h-3.5" /> {errors.mobileNumber}
                  </p>
                )}
              </div>

              {/* Attending Specific Fields */}
              {attendanceStatus === 'Attending' && (
                <>
                  {/* Total Members */}
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Number of People Attending <span className="text-rose-500">*</span>
                    </label>
                    <div className="flex items-center gap-2">
                      {[1, 2, 3, 4, 5, 6].map((num) => (
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
                      Party of {totalMembers} including yourself.
                    </span>
                    {errors.totalMembers && (
                      <p className="text-xs text-rose-600 mt-1 flex items-center gap-1">
                        <AlertCircle className="w-3.5 h-3.5" /> {errors.totalMembers}
                      </p>
                    )}
                  </div>

                  {/* Table Selection System */}
                  <TableSelector
                    tables={tables}
                    selectedTableId={tableNumber}
                    onSelectTable={(id) => setTableNumber(id)}
                    partySize={totalMembers}
                    error={errors.tableNumber}
                  />
                </>
              )}

              {/* Optional message */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  {attendanceStatus === 'Attending' ? 'Special Note / Dietary Requests (Optional)' : 'Send Aria a Birthday Wish (Optional)'}
                </label>
                <div className="relative">
                  <MessageSquare className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  <textarea
                    rows={2}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder={attendanceStatus === 'Attending' ? "Can't wait to celebrate! Any special diet or song requests?" : 'Wishing you the happiest birthday Aria!'}
                    className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-200 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-purple-200 focus:border-purple-500 resize-none"
                  ></textarea>
                </div>
              </div>

              {/* Submit Button */}
              <div className="pt-2">
                <button
                  type="submit"
                  className={`w-full py-3.5 px-6 rounded-xl font-bold text-white shadow-lg transition-all transform active:scale-95 flex items-center justify-center gap-2 ${
                    attendanceStatus === 'Attending'
                      ? 'bg-gradient-to-r from-purple-600 via-pink-600 to-amber-500 hover:from-purple-700 hover:to-amber-600 shadow-purple-600/30'
                      : 'bg-slate-800 hover:bg-slate-900 shadow-slate-800/30'
                  }`}
                >
                  <Sparkles className="w-4 h-4 text-gold-300" />
                  <span>{attendanceStatus === 'Attending' ? 'Confirm My Attendance & Seat' : 'Submit My Regards'}</span>
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
