import React from 'react';
import { Calendar, Clock, MapPin, Edit3, Eye, Sparkles, Users, PartyPopper } from 'lucide-react';

export default function BirthdaySummaryCard({
  birthdayDetails,
  totalRegisteredGuests = 0,
  totalMembersAttending = 0,
  onEditClick,
}) {
  const profilePhoto = birthdayDetails.profileImage || birthdayDetails.photoUrl;

  return (
    <div className="relative rounded-3xl bg-gradient-to-r from-purple-900 via-indigo-900 to-slate-900 text-white p-6 sm:p-7 shadow-xl border border-purple-800/50 overflow-hidden text-left">
      {/* Background Decorative Glow */}
      <div className="absolute top-0 right-0 w-80 h-80 bg-pink-500/10 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-0 left-1/3 w-60 h-60 bg-amber-400/10 rounded-full blur-3xl pointer-events-none"></div>

      <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
        
        {/* Left: Avatar & Event Info */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5">
          {/* Profile Photo */}
          <div className="relative shrink-0">
            <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl overflow-hidden border-2 border-amber-300 shadow-lg bg-slate-800">
              {profilePhoto ? (
                <img
                  src={profilePhoto}
                  alt={birthdayDetails.personName}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center font-bold text-2xl text-purple-300">
                  {birthdayDetails.personName?.charAt(0) || '🎂'}
                </div>
              )}
            </div>
            <div className="absolute -bottom-1.5 -right-1.5 bg-gradient-to-r from-amber-400 to-pink-500 text-slate-950 p-1 rounded-lg shadow-sm">
              <Sparkles className="w-3.5 h-3.5" />
            </div>
          </div>

          {/* Details */}
          <div className="space-y-1.5">
            <div className="inline-flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-amber-300 bg-white/10 px-2.5 py-0.5 rounded-full">
              <span>Event Overview</span>
            </div>

            <h3 className="text-xl sm:text-2xl font-serif font-black text-white tracking-tight">
              {birthdayDetails.personName}
            </h3>

            <p className="text-xs sm:text-sm text-pink-200/90 font-medium">
              {birthdayDetails.celebrationTitle}
            </p>

            <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-purple-200/90 pt-1">
              <span className="flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5 text-amber-400" />
                {birthdayDetails.displayDate || birthdayDetails.birthdayDate}
              </span>
              <span className="flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-pink-400" />
                {birthdayDetails.displayTime || '07:00 PM onwards'}
              </span>
              <span className="flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-emerald-400" />
                {birthdayDetails.venueName}
              </span>
            </div>
          </div>
        </div>

        {/* Right: Quick Numbers & Action Button */}
        <div className="flex flex-col sm:flex-row md:flex-col items-start md:items-end justify-between gap-4 shrink-0 pt-4 md:pt-0 border-t md:border-t-0 border-white/10">
          <div className="flex items-center gap-4">
            <div className="bg-white/10 backdrop-blur-md px-3.5 py-2 rounded-2xl border border-white/15 text-center">
              <span className="text-[10px] uppercase font-bold text-slate-300 block">Registered</span>
              <strong className="text-lg font-serif text-white">{totalRegisteredGuests}</strong>
              <span className="text-[10px] text-pink-200 block">Guests</span>
            </div>

            <div className="bg-white/10 backdrop-blur-md px-3.5 py-2 rounded-2xl border border-white/15 text-center">
              <span className="text-[10px] uppercase font-bold text-slate-300 block">Attending</span>
              <strong className="text-lg font-serif text-amber-300">{totalMembersAttending}</strong>
              <span className="text-[10px] text-amber-200 block">Members</span>
            </div>
          </div>

          <button
            onClick={onEditClick}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white font-bold text-xs sm:text-sm shadow-md transition-all active:scale-95"
          >
            <Edit3 className="w-4 h-4" />
            <span>Edit Birthday Details</span>
          </button>
        </div>
      </div>
    </div>
  );
}
