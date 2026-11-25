import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Cake, ShieldCheck, Sparkles, Heart } from 'lucide-react';
import confetti from 'canvas-confetti';

export default function Navbar({ birthdayDetails = {} }) {
  const location = useLocation();
  const isAdmin = location.pathname.startsWith('/admin');

  const triggerConfetti = () => {
    confetti({
      particleCount: 70,
      spread: 60,
      origin: { y: 0.1 },
      colors: ['#f59e0b', '#ec4899', '#8b5cf6', '#3b82f6'],
    });
  };

  const displayName = birthdayDetails?.personName ? `${birthdayDetails.personName}'s Bash` : "Aria's 25th";

  return (
    <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b border-purple-100 shadow-sm">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        
        {/* Brand / Logo */}
        <Link to="/" className="flex items-center gap-2.5 group">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-purple-600 via-pink-600 to-amber-400 flex items-center justify-center text-white shadow-md shadow-pink-500/20 group-hover:scale-105 transition-transform">
            <Cake className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <span className="font-serif font-bold text-lg sm:text-xl text-slate-900 group-hover:text-purple-700 transition-colors">
              {displayName}
            </span>
            <span className="hidden sm:inline-block text-[11px] font-semibold text-pink-600 bg-pink-50 px-2 py-0.5 rounded-full ml-2 border border-pink-200">
              Celebration & RSVP
            </span>
          </div>
        </Link>

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
