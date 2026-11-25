import React from 'react';
import { Link } from 'react-router-dom';
import { Heart, Sparkles, MapPin, Phone, ShieldCheck } from 'lucide-react';

export default function Footer({ birthdayDetails }) {
  return (
    <footer className="relative bg-slate-950 text-slate-300 pt-12 pb-8 border-t border-purple-950/60 overflow-hidden">
      {/* Background soft glow */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-96 h-40 bg-pink-600/10 rounded-full blur-3xl pointer-events-none"></div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pb-8 border-b border-slate-800 text-center md:text-left">
          
          {/* Col 1: Birthday Person & Title */}
          <div>
            <div className="flex items-center justify-center md:justify-start gap-2 mb-2">
              <span className="text-xl">🎂</span>
              <h4 className="font-serif font-bold text-xl text-white">
                {birthdayDetails?.personName || "Aria Sharma"}
              </h4>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed max-w-sm mx-auto md:mx-0">
              {birthdayDetails?.tagline || "A Silver Jubilee Celebration of Elegance, Laughter & Joy."}
            </p>
            <div className="mt-3 flex items-center justify-center md:justify-start gap-1 text-xs text-amber-400 font-medium">
              <Sparkles className="w-3.5 h-3.5" />
              <span>#AriaTurns25 • #MilestoneBash</span>
            </div>
          </div>

          {/* Col 2: Event Venue & Contact */}
          <div className="space-y-2 text-xs text-slate-400">
            <h5 className="font-bold text-white uppercase tracking-wider text-[11px] mb-2">Venue & Inquiries</h5>
            <div className="flex items-start justify-center md:justify-start gap-2">
              <MapPin className="w-4 h-4 text-pink-500 shrink-0 mt-0.5" />
              <span>{birthdayDetails?.venueAddress || "Royal Orchid Palace, Indiranagar, Bengaluru"}</span>
            </div>
            <div className="flex items-center justify-center md:justify-start gap-2">
              <Phone className="w-4 h-4 text-amber-400 shrink-0" />
              <span>Host RSVP Helpline: {birthdayDetails?.hostContact || "+91 98765 43210"}</span>
            </div>
          </div>

          {/* Col 3: Portal Links & Note */}
          <div className="flex flex-col items-center md:items-end justify-between space-y-4">
            <div className="text-center md:text-right">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block mb-2">
                Organizer & Management
              </span>
              <Link
                to="/admin/login"
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-700 text-xs font-semibold text-slate-200 hover:text-white transition-all shadow-sm"
              >
                <ShieldCheck className="w-3.5 h-3.5 text-purple-400" />
                <span>Admin Login Dashboard</span>
              </Link>
            </div>
            <p className="text-[11px] text-slate-500 text-center md:text-right">
              Frontend-only Demo • Dynamic LocalStorage Persistence
            </p>
          </div>
        </div>

        {/* Bottom copyright */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-2">
          <p>© {new Date().getFullYear()} {birthdayDetails?.personName} Birthday Celebration. All rights reserved.</p>
          <p className="flex items-center gap-1">
            Made with <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500 inline" /> for an unforgettable night
          </p>
        </div>
      </div>
    </footer>
  );
}
