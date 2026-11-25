import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Sparkles, ShieldCheck, Heart, PartyPopper, ChevronDown } from 'lucide-react';
import confetti from 'canvas-confetti';
import { OCCASIONS_CATALOG } from '../data/occasionsCatalog';

export default function Navbar({ currentOccasion, occasions = [] }) {
  const location = useLocation();
  const isAdmin = location.pathname.startsWith('/admin');
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const triggerConfetti = () => {
    confetti({
      particleCount: 70,
      spread: 60,
      origin: { y: 0.1 },
      colors: ['#f59e0b', '#ec4899', '#8b5cf6', '#3b82f6'],
    });
  };

  const catalogItem = currentOccasion
    ? OCCASIONS_CATALOG.find(c => c.id === currentOccasion.occasionType) || OCCASIONS_CATALOG[0]
    : OCCASIONS_CATALOG[0];

  const brandName = currentOccasion?.occasionName || "CelebrationOS";

  return (
    <header className="sticky top-0 z-40 bg-white/85 backdrop-blur-md border-b border-purple-100 shadow-sm">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        
        {/* Brand / Logo */}
        <div className="flex items-center gap-3">
          <Link to="/" className="flex items-center gap-2.5 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-purple-600 via-pink-600 to-amber-400 flex items-center justify-center text-white shadow-md shadow-pink-500/20 group-hover:scale-105 transition-transform text-xl">
              {catalogItem?.emoji || '🎉'}
            </div>
            <div>
              <span className="font-serif font-bold text-base sm:text-lg text-slate-900 group-hover:text-purple-700 transition-colors block truncate max-w-[170px] sm:max-w-xs">
                {brandName}
              </span>
              <span className="hidden sm:inline-block text-[10px] font-bold text-purple-700 bg-purple-50 px-2 py-0.5 rounded-full border border-purple-200">
                {catalogItem?.name || 'Celebration'}
              </span>
            </div>
          </Link>

          {/* Quick Celebrations Switcher Dropdown (Only on public pages when multiple occasions exist) */}
          {!isAdmin && occasions.length > 1 && (
            <div className="relative hidden md:block">
              <button
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="px-2.5 py-1.5 rounded-xl border border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-700 text-xs font-semibold flex items-center gap-1 transition-all"
              >
                <span>Browse Celebrations</span>
                <ChevronDown className="w-3.5 h-3.5" />
              </button>

              {dropdownOpen && (
                <div
                  onMouseLeave={() => setDropdownOpen(false)}
                  className="absolute left-0 mt-1.5 w-64 bg-white rounded-2xl shadow-xl border border-slate-100 py-2 z-50 text-left animate-scale-up"
                >
                  <div className="px-3 py-1 text-[10px] uppercase font-bold text-slate-400 border-b border-slate-100">
                    Active Celebrations ({occasions.length})
                  </div>
                  <div className="max-h-60 overflow-y-auto">
                    {occasions.map((occ) => {
                      const item = OCCASIONS_CATALOG.find(c => c.id === occ.occasionType);
                      return (
                        <Link
                          key={occ.id}
                          to={`/invite/${occ.occasionType}/${occ.id}`}
                          onClick={() => setDropdownOpen(false)}
                          className="flex items-center gap-2 px-3 py-2 text-xs text-slate-800 hover:bg-purple-50 hover:text-purple-700 transition-colors"
                        >
                          <span className="text-base">{item?.emoji || '🎉'}</span>
                          <div className="truncate">
                            <span className="font-bold block truncate">{occ.occasionName}</span>
                            <span className="text-[10px] text-slate-400">{occ.displayDate || occ.eventDate}</span>
                          </div>
                        </Link>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2.5">
          {/* Confetti button */}
          <button
            onClick={triggerConfetti}
            title="Celebrate with Confetti!"
            className="px-3 py-1.5 rounded-xl text-xs font-semibold bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-200/80 flex items-center gap-1.5 transition-all active:scale-95"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-500" />
            <span className="hidden sm:inline">Celebrate</span>
          </button>

          {/* Navigation Links */}
          {isAdmin ? (
            <Link
              to="/"
              className="px-3.5 py-1.5 rounded-xl text-xs sm:text-sm font-semibold text-purple-700 hover:text-purple-900 bg-purple-50 hover:bg-purple-100 border border-purple-200 transition-all flex items-center gap-1.5"
            >
              <Heart className="w-3.5 h-3.5 text-pink-500" />
              <span>Public Invitation</span>
            </Link>
          ) : (
            <Link
              to="/admin/login"
              className="px-3.5 py-1.5 rounded-xl text-xs sm:text-sm font-semibold text-slate-700 hover:text-purple-700 bg-slate-100 hover:bg-slate-200 border border-slate-200 transition-all flex items-center gap-1.5"
            >
              <ShieldCheck className="w-4 h-4 text-purple-600" />
              <span>Admin Portal</span>
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}
