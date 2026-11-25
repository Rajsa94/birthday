import React, { useState } from 'react';
import {
  Calendar,
  Clock,
  MapPin,
  ExternalLink,
  Sparkles,
  Heart,
  CheckCircle2,
  Users,
  Award,
  Music,
  Wine,
  Gift,
  Phone,
  Image as ImageIcon,
  Camera,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import Countdown from '../components/Countdown';
import BirthdayCake from '../components/BirthdayCake';
import FloatingDecorations from '../components/FloatingDecorations';
import RSVPModal from '../components/RSVPModal';

export default function Invitation({
  birthdayDetails,
  tables,
  guests,
  onSaveRSVP,
}) {
  const [isRSVPModalOpen, setIsRSVPModalOpen] = useState(false);
  const [rsvpInitialStatus, setRsvpInitialStatus] = useState('Attending');
  const [activeGalleryModal, setActiveGalleryModal] = useState(null);

  // Compute live statistics for seating teaser
  const totalCapacity = tables.reduce((sum, t) => sum + (Number(t.capacity) || 0), 0);
  const totalOccupied = tables.reduce((sum, t) => sum + (Number(t.occupiedSeats) || 0), 0);
  const totalAvailable = Math.max(0, totalCapacity - totalOccupied);
  const totalAttendingGuests = guests.filter(g => g.attendanceStatus === 'Attending').length;

  const handleOpenRSVP = (status) => {
    setRsvpInitialStatus(status);
    setIsRSVPModalOpen(true);
    if (status === 'Attending') {
      confetti({
        particleCount: 60,
        spread: 50,
        origin: { y: 0.7 },
        colors: ['#f59e0b', '#ec4899', '#8b5cf6'],
      });
    }
  };

  const profilePhoto = birthdayDetails.profileImage || birthdayDetails.photoUrl;
  const cakePhoto = birthdayDetails.cakeImage;
  const customBackground = birthdayDetails.backgroundImage;
  const gallery = birthdayDetails.galleryImages || [];

  // Theme gradient mappings
  const themeGradients = {
    purple: 'from-purple-950 via-slate-900 to-purple-950',
    pink: 'from-rose-950 via-slate-900 to-pink-950',
    gold: 'from-amber-950 via-slate-900 to-yellow-950',
    emerald: 'from-emerald-950 via-slate-900 to-teal-950',
    rose: 'from-slate-950 via-purple-950 to-slate-950',
  };

  const currentThemeGradient = themeGradients[birthdayDetails.themeColor] || themeGradients.purple;

  return (
    <div className={`relative min-h-screen bg-gradient-to-b ${currentThemeGradient} text-slate-100 overflow-x-hidden`}>
      
      {/* Custom Background Image Overlay if uploaded */}
      {customBackground && (
        <div
          className="fixed inset-0 z-0 bg-cover bg-center bg-no-repeat pointer-events-none opacity-20 filter blur-[2px]"
          style={{ backgroundImage: `url(${customBackground})` }}
        ></div>
      )}

      {/* Background Floating Balloons & Confetti */}
      <FloatingDecorations />

      {/* Hero Section */}
      <section className="relative z-10 pt-8 pb-16 px-4 sm:px-6 max-w-5xl mx-auto text-center">
        
        {/* Celebration Header Ribbon */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-gold-300 text-xs sm:text-sm font-semibold tracking-widest uppercase mb-6 shadow-lg shadow-purple-900/50">
          <Sparkles className="w-4 h-4 text-amber-400 animate-spin" style={{ animationDuration: '6s' }} />
          <span>You Are Cordially Invited</span>
          <Sparkles className="w-4 h-4 text-amber-400 animate-spin" style={{ animationDuration: '6s' }} />
        </div>

        {/* Milestone Headline */}
        <h1 className="text-4xl sm:text-6xl md:text-7xl font-serif font-black tracking-tight leading-tight text-white drop-shadow-xl">
          Celebrating{' '}
          <span className="festive-gradient-text drop-shadow-[0_4px_16px_rgba(236,72,153,0.4)]">
            {birthdayDetails.personName}'s
          </span>
          <br className="hidden sm:inline" />{' '}
          <span className="text-white text-3xl sm:text-5xl md:text-6xl font-light">
            {birthdayDetails.celebrationTitle?.replace(new RegExp(`^${birthdayDetails.personName}('s)?\\s*`, 'i'), '') || 'Milestone Birthday Bash'}
          </span>
        </h1>

        <p className="mt-4 text-base sm:text-lg md:text-xl text-pink-200/90 font-light max-w-2xl mx-auto leading-relaxed">
          {birthdayDetails.tagline}
        </p>

        {/* Portrait & Cake Dual Showcase */}
        <div className="mt-10 mb-12 flex flex-col md:flex-row items-center justify-center gap-8 md:gap-14">
          
          {/* Birthday Person Photo with Glowing Halo */}
          <div className="relative group">
            {/* Glowing Ring */}
            <div className="absolute -inset-2 bg-gradient-to-tr from-pink-500 via-amber-400 to-purple-600 rounded-full blur-lg opacity-70 group-hover:opacity-100 transition duration-500 animate-pulse-glow"></div>
            
            <div className="relative w-48 h-48 sm:w-56 sm:h-56 md:w-64 md:h-64 rounded-full overflow-hidden border-4 border-amber-300/80 shadow-2xl bg-slate-900">
              {profilePhoto ? (
                <img
                  src={profilePhoto}
                  alt={birthdayDetails.personName}
                  className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-5xl">🎂</div>
              )}
            </div>

            {/* Badge overlay */}
            <div className="absolute bottom-1 right-2 sm:bottom-2 sm:right-3 bg-gradient-to-r from-amber-500 to-pink-600 text-white font-bold text-xs sm:text-sm px-3.5 py-1 rounded-full shadow-lg border-2 border-white flex items-center gap-1.5">
              <Award className="w-4 h-4 text-amber-200" />
              <span>Milestone Guest of Honor</span>
            </div>
          </div>

          {/* Birthday Cake (Uploaded photo or Animated SVG) */}
          <div className="flex flex-col items-center">
            {cakePhoto ? (
              <div className="relative group text-center">
                <div className="w-52 sm:w-60 h-52 sm:h-60 rounded-3xl overflow-hidden border-4 border-pink-300/80 shadow-2xl bg-slate-900 group-hover:scale-105 transition-transform">
                  <img
                    src={cakePhoto}
                    alt="Birthday Cake"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="mt-2 text-xs font-bold text-pink-200 bg-white/10 px-3 py-1 rounded-full border border-white/20 inline-flex items-center gap-1">
                  <span>🎂 The Birthday Cake</span>
                </div>
              </div>
            ) : (
              <BirthdayCake />
            )}
          </div>
        </div>

        {/* Live Countdown Section */}
        <div className="my-8">
          <Countdown targetDate={birthdayDetails.eventDateTime || `${birthdayDetails.birthdayDate}T${birthdayDetails.partyStartTime || '19:00'}:00`} />
        </div>

        {/* Main Invitation Message Card */}
        <div className="max-w-2xl mx-auto my-8 p-6 sm:p-8 rounded-3xl bg-white/10 backdrop-blur-xl border border-white/20 shadow-2xl text-center">
          <div className="w-12 h-12 mx-auto rounded-full bg-pink-500/20 text-pink-300 flex items-center justify-center mb-4">
            <Heart className="w-6 h-6 fill-pink-400 text-pink-400 animate-pulse" />
          </div>

          <h3 className="text-xl sm:text-2xl font-serif font-bold text-white mb-3">
            A Message From {birthdayDetails.personName}
          </h3>

          <p className="text-sm sm:text-base text-purple-100/90 leading-relaxed font-light italic">
            "{birthdayDetails.invitationMessage}"
          </p>

          <div className="mt-6 pt-5 border-t border-white/15 flex flex-wrap items-center justify-center gap-4 text-xs font-semibold text-amber-300">
            <span className="flex items-center gap-1.5">
              <Wine className="w-4 h-4 text-pink-400" /> Gourmet Dinner & Cocktails
            </span>
            <span>•</span>
            <span className="flex items-center gap-1.5">
              <Music className="w-4 h-4 text-purple-400" /> Live DJ & Dance Floor
            </span>
            <span>•</span>
            <span className="flex items-center gap-1.5">
              <Gift className="w-4 h-4 text-amber-400" /> Dress Code: {birthdayDetails.dressCode}
            </span>
          </div>
        </div>

        {/* Event Key Details Cards (Date, Time, Venue, Maps) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 max-w-4xl mx-auto my-8 text-left">
          
          {/* Card 1: Date & Time */}
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-5 border border-white/15 shadow-lg flex flex-col justify-between">
            <div>
              <div className="w-10 h-10 rounded-xl bg-purple-500/30 text-purple-300 flex items-center justify-center mb-3">
                <Calendar className="w-5 h-5" />
              </div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-purple-300 block">Date & Time</span>
              <h4 className="text-base font-bold text-white mt-1">
                {birthdayDetails.displayDate || birthdayDetails.birthdayDate}
              </h4>
              <p className="text-xs text-pink-200 mt-1 flex items-center gap-1">
                <Clock className="w-3.5 h-3.5" />
                <span>{birthdayDetails.displayTime || '07:00 PM onwards'}</span>
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-white/10 text-[11px] text-purple-200/80">
              Please arrive 15 minutes prior for welcome drinks and photos.
            </div>
          </div>

          {/* Card 2: Venue & Location */}
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-5 border border-white/15 shadow-lg flex flex-col justify-between">
            <div>
              <div className="w-10 h-10 rounded-xl bg-pink-500/30 text-pink-300 flex items-center justify-center mb-3">
                <MapPin className="w-5 h-5" />
              </div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-pink-300 block">Venue</span>
              <h4 className="text-base font-bold text-white mt-1">{birthdayDetails.venueName}</h4>
              <p className="text-xs text-slate-300 mt-1 line-clamp-2">
                {birthdayDetails.venueAddress}
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-white/10 flex items-center justify-between">
              {birthdayDetails.googleMapsUrl ? (
                <a
                  href={birthdayDetails.googleMapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-amber-300 hover:text-amber-200 underline decoration-amber-400 underline-offset-2 transition-colors"
                >
                  <span>Open in Google Maps</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              ) : (
                <span className="text-xs text-slate-400">Map directions available</span>
              )}
            </div>
          </div>

          {/* Card 3: Seating & Capacity Live Pulse */}
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-5 border border-white/15 shadow-lg flex flex-col justify-between sm:col-span-2 md:col-span-1">
            <div>
              <div className="w-10 h-10 rounded-xl bg-amber-500/30 text-amber-300 flex items-center justify-center mb-3">
                <Users className="w-5 h-5" />
              </div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-amber-300 block">Seating Availability</span>
              <div className="flex items-baseline gap-2 mt-1">
                <span className="text-2xl font-bold text-white font-serif">{totalAvailable}</span>
                <span className="text-xs text-slate-300">of {totalCapacity} seats remaining</span>
              </div>
              <p className="text-xs text-emerald-300 mt-1 flex items-center gap-1 font-medium">
                <CheckCircle2 className="w-3.5 h-3.5" /> {totalAttendingGuests} RSVPs recorded
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-white/10 text-[11px] text-amber-200/80 flex items-center justify-between">
              <span>Host: {birthdayDetails.hostContact}</span>
            </div>
          </div>
        </div>

        {/* Action RSVP Buttons (Call to Action) */}
        <div className="mt-10 max-w-md mx-auto space-y-3">
          {/* Main "I'll Attend" Button */}
          <button
            onClick={() => handleOpenRSVP('Attending')}
            className="w-full group relative inline-flex items-center justify-center p-0.5 rounded-2xl font-bold text-white overflow-hidden shadow-2xl shadow-pink-600/40 hover:shadow-pink-600/60 transition-all duration-300 transform hover:-translate-y-0.5 active:scale-95"
          >
            <span className="w-full h-full bg-gradient-to-r from-pink-500 via-purple-600 to-amber-500 group-hover:from-pink-600 group-hover:to-amber-600 px-8 py-4 rounded-2xl flex items-center justify-center gap-3 text-lg font-bold tracking-wide">
              <Sparkles className="w-5 h-5 text-gold-300 animate-spin" style={{ animationDuration: '4s' }} />
              <span>I'll Attend</span>
              <span className="text-xs bg-white/20 px-2 py-0.5 rounded-md uppercase font-sans">RSVP Now</span>
            </span>
          </button>

          {/* "Sorry, I Can't Attend" Button */}
          <button
            onClick={() => handleOpenRSVP('Declined')}
            className="w-full py-3 px-6 rounded-2xl text-sm font-semibold text-purple-200 hover:text-white bg-white/5 hover:bg-white/10 border border-white/15 transition-all backdrop-blur-sm flex items-center justify-center gap-2"
          >
            <Heart className="w-4 h-4 text-pink-400" />
            <span>Sorry, I Can't Attend</span>
          </button>
        </div>

        {/* Photo Gallery Showcase (if photos uploaded) */}
        {gallery.length > 0 && (
          <div className="mt-16 pt-12 border-t border-white/10 text-left">
            <div className="text-center max-w-xl mx-auto mb-8">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 text-xs font-bold text-amber-300 mb-2">
                <Camera className="w-3.5 h-3.5" />
                <span>Memory Lane</span>
              </div>
              <h3 className="text-2xl sm:text-3xl font-serif font-bold text-white">
                Celebration Photo Moments
              </h3>
              <p className="text-xs sm:text-sm text-pink-200/80 mt-1">
                A glimpse into our cherished milestones and joyous memories together.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 max-w-5xl mx-auto">
              {gallery.map((item, idx) => (
                <div
                  key={item.id || idx}
                  onClick={() => setActiveGalleryModal(item)}
                  className="group relative rounded-2xl overflow-hidden aspect-[4/3] bg-slate-900 border border-white/15 shadow-lg cursor-pointer transform hover:-translate-y-1 transition-all"
                >
                  <img
                    src={item.url}
                    alt={item.caption}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent opacity-80 group-hover:opacity-100 transition-opacity flex items-end p-4">
                    <p className="text-xs font-semibold text-white drop-shadow">
                      {item.caption}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Seating Table Preview Cards on Invitation */}
        <div className="mt-16 pt-12 border-t border-white/10 text-left">
          <div className="text-center max-w-xl mx-auto mb-8">
            <h3 className="text-2xl font-serif font-bold text-white">
              Banquet Table Seating Layout
            </h3>
            <p className="text-xs sm:text-sm text-pink-200/80 mt-1">
              Tables are reserved per group. Check live seat availability before selecting your table.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3 max-w-5xl mx-auto">
            {tables.map(table => {
              const capacity = Number(table.capacity) || 8;
              const occupied = Number(table.occupiedSeats) || 0;
              const available = Math.max(0, capacity - occupied);
              const isFull = available <= 0;

              return (
                <div
                  key={table.id}
                  className={`rounded-2xl p-4 border backdrop-blur-md transition-all ${
                    isFull
                      ? 'bg-white/5 border-white/10 opacity-60'
                      : 'bg-white/10 border-white/20 hover:border-pink-400 hover:bg-white/15'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-bold text-white text-sm">{table.tableName || `Table ${table.id}`}</span>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      isFull ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30' : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                    }`}>
                      {isFull ? 'Full' : `${available} Left`}
                    </span>
                  </div>

                  {/* Seat dots representation */}
                  <div className="flex flex-wrap gap-1.5 my-3">
                    {Array.from({ length: capacity }).map((_, idx) => (
                      <span
                        key={idx}
                        title={idx < occupied ? 'Occupied' : 'Available'}
                        className={`w-3.5 h-3.5 rounded-full ${
                          idx < occupied
                            ? 'bg-rose-400 shadow-sm'
                            : 'bg-emerald-400/80 ring-1 ring-emerald-300'
                        }`}
                      ></span>
                    ))}
                  </div>

                  <div className="text-[11px] text-purple-200/80 flex justify-between pt-1 border-t border-white/10">
                    <span>{occupied} of {capacity} Occupied</span>
                    <span className="font-semibold text-white">{Math.round((occupied / capacity) * 100)}%</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* RSVP Modal */}
      <RSVPModal
        isOpen={isRSVPModalOpen}
        onClose={() => setIsRSVPModalOpen(false)}
        initialStatus={rsvpInitialStatus}
        tables={tables}
        guests={guests}
        birthdayDetails={birthdayDetails}
        onSaveRSVP={onSaveRSVP}
      />

      {/* Gallery Photo Lightbox Modal */}
      {activeGalleryModal && (
        <div
          onClick={() => setActiveGalleryModal(null)}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md cursor-pointer"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="max-w-3xl w-full bg-slate-900 rounded-3xl overflow-hidden border border-white/20 shadow-2xl"
          >
            <div className="max-h-[75vh] overflow-hidden bg-black flex items-center justify-center">
              <img
                src={activeGalleryModal.url}
                alt={activeGalleryModal.caption}
                className="max-w-full max-h-[75vh] object-contain"
              />
            </div>
            <div className="p-4 bg-slate-900 flex items-center justify-between">
              <p className="text-sm font-semibold text-white">{activeGalleryModal.caption}</p>
              <button
                onClick={() => setActiveGalleryModal(null)}
                className="px-3 py-1 rounded-xl bg-white/10 hover:bg-white/20 text-xs font-bold text-white"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
