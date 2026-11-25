import React, { useState } from 'react';
import { X, Search, Phone, Ticket, AlertCircle, ArrowRight } from 'lucide-react';
import DigitalEventPass from './DigitalEventPass';
import { normalizeIndianMobile } from '../utils/validation';

export default function PassLookupModal({
  isOpen,
  onClose,
  occasion,
  guests = [],
  tables = [],
  onOpenRSVP,
}) {
  const [mobileInput, setMobileInput] = useState('');
  const [matchedGuest, setMatchedGuest] = useState(null);
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleSearch = (e) => {
    e.preventDefault();
    setError('');

    const norm = normalizeIndianMobile(mobileInput);
    if (!norm) {
      setError('Please enter a valid 10-digit mobile number.');
      return;
    }

    const found = guests.find(g => {
      const gNorm = normalizeIndianMobile(g.mobileNumber);
      return gNorm === norm && g.attendanceStatus === 'Attending';
    });

    if (found) {
      setMatchedGuest(found);
    } else {
      setError('No active attending reservation found for this mobile number in this celebration.');
      setMatchedGuest(null);
    }
  };

  const handleReset = () => {
    setMatchedGuest(null);
    setMobileInput('');
    setError('');
  };

  const selectedTableObj = matchedGuest
    ? tables.find(t => Number(t.id) === Number(matchedGuest.tableNumber))
    : null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md overflow-y-auto animate-fade-in">
      <div className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-slate-100 overflow-hidden my-6">
        
        {/* Header */}
        <div className="p-5 bg-gradient-to-r from-slate-900 via-purple-950 to-slate-900 text-white relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-all cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>

          <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-amber-300 mb-1">
            <Ticket className="w-4 h-4 text-amber-400" />
            <span>Digital Event Pass Portal</span>
          </div>
          <h3 className="text-xl font-serif font-bold text-white">
            {matchedGuest ? 'Your Digital Event Pass' : 'Retrieve Your Event Pass'}
          </h3>
          <p className="text-xs text-purple-200 mt-0.5">
            {occasion?.celebrationTitle || occasion?.title || 'Celebration Invitation'}
          </p>
        </div>

        {/* Content */}
        <div className="p-6">
          {matchedGuest ? (
            <div>
              <div className="flex justify-end mb-2">
                <button
                  onClick={handleReset}
                  className="text-xs font-semibold text-purple-600 hover:text-purple-800 flex items-center gap-1 cursor-pointer"
                >
                  <Search className="w-3.5 h-3.5" />
                  <span>Check another number</span>
                </button>
              </div>

              <DigitalEventPass
                guest={matchedGuest}
                occasion={occasion}
                tableName={selectedTableObj ? selectedTableObj.tableName : (matchedGuest.tableNumber ? `Table ${matchedGuest.tableNumber}` : 'Open Seating')}
                onClose={onClose}
                showActions={true}
              />
            </div>
          ) : (
            <div className="space-y-4">
              <p className="text-xs sm:text-sm text-slate-600">
                Already registered for this celebration? Enter your 10-digit mobile number below to instantly view, download, or share your official VIP Event Pass.
              </p>

              <form onSubmit={handleSearch} className="space-y-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Registered Mobile Number
                  </label>
                  <div className="relative">
                    <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400">
                      +91
                    </span>
                    <input
                      type="tel"
                      value={mobileInput}
                      onChange={(e) => {
                        setMobileInput(e.target.value);
                        if (error) setError('');
                      }}
                      placeholder="9876543210"
                      maxLength={14}
                      className="w-full pl-12 pr-4 py-3 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-purple-500 font-mono text-sm tracking-wide text-slate-800"
                    />
                  </div>
                  {error && (
                    <div className="mt-2 text-xs text-rose-600 flex items-center gap-1 bg-rose-50 p-2.5 rounded-lg border border-rose-100">
                      <AlertCircle className="w-4 h-4 shrink-0" />
                      <span>{error}</span>
                    </div>
                  )}
                </div>

                <button
                  type="submit"
                  className="w-full py-3 px-4 rounded-xl font-bold text-sm text-white bg-purple-600 hover:bg-purple-700 shadow-md shadow-purple-600/30 transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Search className="w-4 h-4" />
                  <span>Find My Pass</span>
                </button>
              </form>

              {onOpenRSVP && (
                <div className="pt-3 border-t border-slate-100 text-center">
                  <p className="text-xs text-slate-500">Haven't reserved your spot yet?</p>
                  <button
                    type="button"
                    onClick={() => {
                      onClose();
                      onOpenRSVP('Attending');
                    }}
                    className="mt-1.5 inline-flex items-center gap-1 text-xs font-bold text-purple-600 hover:text-purple-800 cursor-pointer"
                  >
                    <span>Click here to RSVP now</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
