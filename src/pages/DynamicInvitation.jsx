import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
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
  Camera,
  Share2,
  Check,
  Briefcase,
  Ticket,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import Countdown from '../components/Countdown';
import DynamicDecorations from '../components/decorations/DynamicDecorations';
import OccasionHeroGraphic from '../components/decorations/OccasionHeroGraphic';
import RSVPModal from '../components/RSVPModal';
import PassLookupModal from '../components/PassLookupModal';
import { getThemeById } from '../themes/themeCatalog';
import { OCCASIONS_CATALOG } from '../data/occasionsCatalog';

export default function DynamicInvitation({
  occasion,
  tables = [],
  guests = [],
  onSaveRSVP,
}) {
  const [isRSVPModalOpen, setIsRSVPModalOpen] = useState(false);
  const [isPassLookupOpen, setIsPassLookupOpen] = useState(false);
  const [rsvpInitialStatus, setRsvpInitialStatus] = useState('Attending');
  const [activeGalleryModal, setActiveGalleryModal] = useState(null);
  const [copiedLink, setCopiedLink] = useState(false);

  if (!occasion) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 bg-slate-950 text-white text-center">
        <div className="space-y-3">
          <p className="text-xl font-bold font-serif">Occasion not found</p>
          <Link to="/" className="text-purple-400 hover:underline text-sm block">
            Return to Homepage
          </Link>
        </div>
      </div>
    );
  }

  // Resolve Theme
  const baseTheme = getThemeById(occasion?.themeId, occasion?.occasionType) || {};
  const customTheme = occasion?.customTheme || {};

  const themeColors = {
    ...(baseTheme.colors || {}),
    primary: customTheme.primaryColor || baseTheme.colors?.primary || '#ec4899',
    secondary: customTheme.secondaryColor || baseTheme.colors?.secondary || '#8b5cf6',
    accent: customTheme.accentColor || baseTheme.colors?.accent || '#f59e0b',
  };

  const cardBg = baseTheme.colors?.cardBg || 'rgba(255, 255, 255, 0.08)';
  const cardBorder = baseTheme.colors?.cardBorder || 'rgba(255, 255, 255, 0.16)';

  const catalogItem = OCCASIONS_CATALOG.find(c => c.id === occasion?.occasionType) || OCCASIONS_CATALOG[0];

  // Seating statistics
  const seatingEnabled = occasion.seatingEnabled !== false;
  const totalCapacity = tables.reduce((sum, t) => sum + (Number(t.capacity) || 0), 0);
  const totalOccupied = tables.reduce((sum, t) => sum + (Number(t.occupiedSeats) || 0), 0);
  const totalAvailable = Math.max(0, totalCapacity - totalOccupied);
  const totalAttendingGuests = guests.filter(g => g.attendanceStatus === 'Attending').length;

  const handleOpenRSVP = (status) => {
    setRsvpInitialStatus(status);
    setIsRSVPModalOpen(true);
    if (status === 'Attending') {
      confetti({
        particleCount: 75,
        spread: 60,
        origin: { y: 0.7 },
        colors: [themeColors.primary, themeColors.secondary, themeColors.accent],
      });
    }
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: occasion.title,
        text: occasion.invitationMessage,
        url: window.location.href,
      }).catch(() => {});
    } else {
      navigator.clipboard.writeText(window.location.href);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2500);
    }
  };

  const profilePhoto = occasion.profileImage || occasion.heroImage;
  const secondaryPhoto = occasion.secondaryImage;
  const customBackground = occasion.backgroundImage;
  const gallery = occasion.galleryImages || [];

  return (
    <div
      className={`relative min-h-screen bg-gradient-to-b ${baseTheme.colors?.bgGradient || 'from-purple-950 via-slate-900 to-purple-950'} text-slate-100 overflow-x-hidden`}
      style={{
        '--theme-primary': themeColors.primary,
        '--theme-secondary': themeColors.secondary,
        '--theme-accent': themeColors.accent,
      }}
    >
      {/* Custom Background Image if provided */}
      {customBackground && (
        <div
          className="fixed inset-0 z-0 bg-cover bg-center bg-no-repeat pointer-events-none opacity-20 filter blur-[2px]"
          style={{ backgroundImage: `url(${customBackground})` }}
        ></div>
      )}

      {/* Floating Animated Celebratory Elements */}
      {customTheme.animationsEnabled !== false && (
        <DynamicDecorations type={baseTheme.decorations?.type || 'balloons'} theme={{ colors: themeColors }} />
      )}

      {/* Main Content Section */}
      <section className="relative z-10 pt-8 pb-16 px-4 sm:px-6 max-w-5xl mx-auto text-center">
        
        {/* Top Header Badge */}
        <div
          className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full backdrop-blur-md border text-xs sm:text-sm font-semibold tracking-widest uppercase mb-6 shadow-lg"
          style={{
            backgroundColor: `${themeColors.primary}25`,
            borderColor: `${themeColors.accent}50`,
            color: themeColors.accent,
          }}
        >
          <Sparkles className="w-4 h-4 animate-spin" style={{ animationDuration: '6s' }} />
          <span>{baseTheme.bannerTag || catalogItem?.badgeText || 'Special Celebration'}</span>
          <Sparkles className="w-4 h-4 animate-spin" style={{ animationDuration: '6s' }} />
        </div>

        {/* Milestone Headline */}
        <h1
          className="text-4xl sm:text-6xl md:text-7xl font-serif font-black tracking-tight leading-tight text-white drop-shadow-2xl"
          style={{
            fontFamily: customTheme.font === 'cinzel' ? '"Cinzel", serif' : customTheme.font === 'outfit' ? '"Outfit", sans-serif' : '"Playfair Display", serif',
          }}
        >
          {occasion.title}
        </h1>

        <p className="mt-4 text-base sm:text-lg md:text-xl text-slate-200/90 font-light max-w-2xl mx-auto leading-relaxed">
          {occasion.tagline || occasion.invitationMessage}
        </p>

        {/* Hero Showcase (Photos & Custom Occasion Centerpiece) */}
        <div className="mt-10 mb-12 flex flex-col md:flex-row items-center justify-center gap-8 md:gap-14">
          
          {/* Main Portrait Showcase if photo available */}
          {profilePhoto ? (
            <div className="relative group">
              <div
                className="absolute -inset-2 rounded-full blur-xl opacity-70 group-hover:opacity-100 transition duration-500 animate-pulse-glow"
                style={{
                  background: `linear-gradient(45deg, ${themeColors.primary}, ${themeColors.accent}, ${themeColors.secondary})`,
                }}
              ></div>

              <div
                className="relative w-48 h-48 sm:w-56 sm:h-56 md:w-64 md:h-64 rounded-full overflow-hidden border-4 shadow-2xl bg-slate-900"
                style={{ borderColor: themeColors.accent }}
              >
                <img
                  src={profilePhoto}
                  alt={occasion.personName || occasion.title}
                  className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500"
                />
              </div>

              {/* Tag Badge */}
              <div
                className="absolute bottom-2 right-2 text-white font-bold text-xs sm:text-sm px-3.5 py-1 rounded-full shadow-lg border border-white flex items-center gap-1.5"
                style={{
                  background: `linear-gradient(135deg, ${themeColors.primary}, ${themeColors.secondary})`,
                }}
              >
                <span>{catalogItem.emoji}</span>
                <span>{occasion.personName || occasion.hostName || catalogItem.name}</span>
              </div>
            </div>
          ) : null}

          {/* Secondary Photo (e.g. Groom for Wedding or Partner) */}
          {secondaryPhoto && (
            <div className="relative group">
              <div
                className="relative w-44 h-44 sm:w-52 sm:h-52 rounded-full overflow-hidden border-4 shadow-2xl bg-slate-900"
                style={{ borderColor: themeColors.accent }}
              >
                <img
                  src={secondaryPhoto}
                  alt={occasion.groomName || 'Partner'}
                  className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500"
                />
              </div>
              <div
                className="absolute bottom-2 right-2 text-white font-bold text-xs px-3 py-1 rounded-full shadow border border-white"
                style={{ background: themeColors.primary }}
              >
                <span>{occasion.groomName || 'Groom'}</span>
              </div>
            </div>
          )}

          {/* Occasion Interactive Centerpiece Graphic */}
          <div className="flex flex-col items-center">
            <OccasionHeroGraphic
              graphicType={baseTheme?.heroGraphic || 'cake'}
              customImage={occasion?.cakeImage}
              occasion={occasion}
            />
          </div>
        </div>

        {/* Live Countdown Section */}
        <div className="my-8">
          <Countdown targetDate={occasion?.eventDateTime || `${occasion?.eventDate || '2026-12-25'}T${occasion?.partyStartTime || '19:00'}:00`} />
        </div>

        {/* Main Invitation Message Card */}
        <div
          className="max-w-2xl mx-auto my-8 p-6 sm:p-8 rounded-3xl backdrop-blur-xl border shadow-2xl text-center"
          style={{
            backgroundColor: cardBg,
            borderColor: cardBorder,
          }}
        >
          <div
            className="w-12 h-12 mx-auto rounded-full flex items-center justify-center mb-4 text-2xl shadow-inner"
            style={{ backgroundColor: `${themeColors.primary}30` }}
          >
            {catalogItem?.emoji || '🎉'}
          </div>

          <h3 className="text-xl sm:text-2xl font-serif font-bold text-white mb-3">
            Invitation From {occasion.hostName || occasion.personName || 'The Hosts'}
          </h3>

          <p className="text-sm sm:text-base text-purple-100/90 leading-relaxed font-light italic">
            "{occasion.invitationMessage}"
          </p>

          {/* Custom Fields Highlights if present */}
          {occasion.customFields && occasion.customFields.length > 0 && (
            <div className="mt-5 pt-4 border-t border-white/10 flex flex-wrap items-center justify-center gap-3 text-xs">
              {occasion.customFields.map((cf, idx) => (
                <span
                  key={idx}
                  className="px-3 py-1 rounded-full bg-white/10 border border-white/15 text-amber-200 font-semibold"
                >
                  <strong>{cf.label}:</strong> {cf.value}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Wedding / Multi-Event Itinerary Schedule (if present) */}
        {occasion.eventSchedule && occasion.eventSchedule.length > 0 && (
          <div className="max-w-3xl mx-auto my-10 text-left">
            <div className="text-center mb-6">
              <span className="text-xs font-bold uppercase tracking-widest text-amber-300 block mb-1">
                Ceremonial Schedule
              </span>
              <h3 className="text-2xl sm:text-3xl font-serif font-bold text-white">
                Events & Rituals Itinerary
              </h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {occasion.eventSchedule.map((ev, idx) => (
                <div
                  key={idx}
                  className="p-5 rounded-2xl backdrop-blur-md border shadow-lg flex flex-col justify-between"
                  style={{
                    backgroundColor: cardBg,
                    borderColor: cardBorder,
                  }}
                >
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-amber-300 block mb-1">
                      Event #{idx + 1}
                    </span>
                    <h4 className="text-base font-bold text-white">{ev.title}</h4>
                    <p className="text-xs text-pink-200 mt-1 flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5 text-amber-400" />
                      <span>{ev.date} • {ev.time}</span>
                    </p>
                  </div>
                  <div className="mt-3 pt-2 border-t border-white/10 text-xs text-slate-300 flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-pink-400 shrink-0" />
                    <span className="truncate">{ev.venue}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Retirement Career Milestones Timeline (if present) */}
        {occasion.careerMilestones && occasion.careerMilestones.length > 0 && (
          <div className="max-w-3xl mx-auto my-10 text-left">
            <div className="text-center mb-6">
              <span className="text-xs font-bold uppercase tracking-widest text-amber-300 block mb-1">
                Career Journey
              </span>
              <h3 className="text-2xl sm:text-3xl font-serif font-bold text-white">
                Milestones & Leadership Legacy
              </h3>
            </div>

            <div className="space-y-3">
              {occasion.careerMilestones.map((m, idx) => (
                <div
                  key={idx}
                  className="p-4 rounded-2xl backdrop-blur-md border flex items-center gap-4 shadow-sm"
                  style={{
                    backgroundColor: cardBg,
                    borderColor: cardBorder,
                  }}
                >
                  <div className="w-16 text-center font-bold font-serif text-lg text-amber-300 shrink-0 border-r border-white/15 pr-3">
                    {m.year}
                  </div>
                  <p className="text-xs sm:text-sm text-slate-200 font-medium">
                    {m.title}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Event Key Logistics (Date, Time, Venue, Seating) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 max-w-4xl mx-auto my-8 text-left">
          
          {/* Card 1: Date & Time */}
          <div
            className="backdrop-blur-md rounded-2xl p-5 border shadow-lg flex flex-col justify-between"
            style={{
              backgroundColor: cardBg,
              borderColor: cardBorder,
            }}
          >
            <div>
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center mb-3 text-white"
                style={{ backgroundColor: `${themeColors.primary}40` }}
              >
                <Calendar className="w-5 h-5 text-amber-300" />
              </div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-purple-300 block">Date & Time</span>
              <h4 className="text-base font-bold text-white mt-1">
                {occasion.displayDate || occasion.eventDate}
              </h4>
              <p className="text-xs text-pink-200 mt-1 flex items-center gap-1">
                <Clock className="w-3.5 h-3.5" />
                <span>{occasion.displayTime || occasion.partyStartTime || '07:00 PM'}</span>
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-white/10 text-[11px] text-purple-200/80">
              Please arrive promptly to share in the celebrations.
            </div>
          </div>

          {/* Card 2: Venue */}
          <div
            className="backdrop-blur-md rounded-2xl p-5 border shadow-lg flex flex-col justify-between"
            style={{
              backgroundColor: cardBg,
              borderColor: cardBorder,
            }}
          >
            <div>
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center mb-3 text-white"
                style={{ backgroundColor: `${themeColors.secondary}40` }}
              >
                <MapPin className="w-5 h-5 text-pink-300" />
              </div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-pink-300 block">Celebration Venue</span>
              <h4 className="text-base font-bold text-white mt-1">{occasion.venueName}</h4>
              <p className="text-xs text-slate-300 mt-1 line-clamp-2">
                {occasion.venueAddress}
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-white/10">
              {occasion.googleMapsUrl ? (
                <a
                  href={occasion.googleMapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-amber-300 hover:underline"
                >
                  <span>Open in Google Maps</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              ) : (
                <span className="text-xs text-slate-400">Map directions available</span>
              )}
            </div>
          </div>

          {/* Card 3: Seating / Host info */}
          <div
            className="backdrop-blur-md rounded-2xl p-5 border shadow-lg flex flex-col justify-between sm:col-span-2 md:col-span-1"
            style={{
              backgroundColor: cardBg,
              borderColor: cardBorder,
            }}
          >
            <div>
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center mb-3 text-white"
                style={{ backgroundColor: `${themeColors.accent}30` }}
              >
                <Users className="w-5 h-5 text-amber-300" />
              </div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-amber-300 block">
                {seatingEnabled ? 'Seating Capacity' : 'RSVP Roster'}
              </span>

              {seatingEnabled ? (
                <>
                  <div className="flex items-baseline gap-2 mt-1">
                    <span className="text-2xl font-bold text-white font-serif">{totalAvailable}</span>
                    <span className="text-xs text-slate-300">of {totalCapacity} seats remaining</span>
                  </div>
                  <p className="text-xs text-emerald-300 mt-1 flex items-center gap-1 font-medium">
                    <CheckCircle2 className="w-3.5 h-3.5" /> {totalAttendingGuests} RSVPs recorded
                  </p>
                </>
              ) : (
                <div className="mt-1">
                  <span className="text-2xl font-bold text-white font-serif">{totalAttendingGuests}</span>
                  <span className="text-xs text-slate-300 ml-1.5">Guests Confirmed</span>
                </div>
              )}
            </div>

            <div className="mt-4 pt-3 border-t border-white/10 text-[11px] text-amber-200/80 flex items-center justify-between">
              <span>Helpline: {occasion.hostContact || 'Host Desk'}</span>
            </div>
          </div>
        </div>

        {/* Action RSVP Buttons */}
        <div className="mt-10 max-w-md mx-auto space-y-3">
          <button
            onClick={() => handleOpenRSVP('Attending')}
            className="w-full group relative inline-flex items-center justify-center p-0.5 rounded-2xl font-bold text-white overflow-hidden shadow-2xl transition-all duration-300 transform hover:-translate-y-0.5 active:scale-95"
            style={{
              boxShadow: `0 12px 30px ${themeColors.primary}60`,
            }}
          >
            <span
              className="w-full h-full px-8 py-4 rounded-2xl flex items-center justify-center gap-3 text-lg font-bold tracking-wide"
              style={{
                background: `linear-gradient(135deg, ${themeColors.primary}, ${themeColors.secondary}, ${themeColors.accent})`,
              }}
            >
              <Sparkles className="w-5 h-5 animate-spin" style={{ animationDuration: '4s' }} />
              <span>I'll Attend</span>
              <span className="text-xs bg-white/20 px-2 py-0.5 rounded-md uppercase font-sans">RSVP Now</span>
            </span>
          </button>

          <div className="flex items-center gap-2">
            <button
              onClick={() => handleOpenRSVP('Declined')}
              className="flex-1 py-3 px-4 rounded-2xl text-xs sm:text-sm font-semibold text-purple-200 hover:text-white bg-white/5 hover:bg-white/10 border border-white/15 transition-all backdrop-blur-sm flex items-center justify-center gap-2 cursor-pointer"
            >
              <Heart className="w-4 h-4 text-pink-400" />
              <span>Sorry, I Can't Attend</span>
            </button>

            <button
              onClick={handleShare}
              className="py-3 px-4 rounded-2xl text-xs font-semibold text-amber-300 hover:text-white bg-white/5 hover:bg-white/10 border border-white/15 transition-all backdrop-blur-sm flex items-center justify-center gap-1.5 cursor-pointer"
              title="Share Invitation"
            >
              {copiedLink ? <Check className="w-4 h-4 text-emerald-400" /> : <Share2 className="w-4 h-4" />}
              <span>{copiedLink ? 'Link Copied' : 'Share'}</span>
            </button>
          </div>

          {/* Retrieve Existing Pass Button */}
          <div className="pt-2 text-center">
            <button
              type="button"
              onClick={() => setIsPassLookupOpen(true)}
              className="inline-flex items-center gap-2 py-2 px-4 rounded-xl text-xs font-bold text-amber-300 hover:text-white bg-white/5 hover:bg-white/15 border border-amber-400/30 transition-all backdrop-blur-sm cursor-pointer shadow-sm"
            >
              <Ticket className="w-3.5 h-3.5 text-amber-400" />
              <span>Already RSVP'd? View / Download Your Event Pass</span>
            </button>
          </div>
        </div>

        {/* Gallery Showcase (if present) */}
        {gallery.length > 0 && (
          <div className="mt-16 pt-12 border-t border-white/10 text-left">
            <div className="text-center max-w-xl mx-auto mb-8">
              <span className="text-xs font-bold uppercase tracking-widest text-amber-300 block mb-1">
                Visual Memories
              </span>
              <h3 className="text-2xl sm:text-3xl font-serif font-bold text-white">
                Celebration Photo Showcase
              </h3>
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

        {/* Dynamic Banquet Table Preview Cards (if seatingEnabled) */}
        {seatingEnabled && tables.length > 0 && (
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
        )}
      </section>

      {/* RSVP Modal configured for this specific occasion */}
      <RSVPModal
        isOpen={isRSVPModalOpen}
        onClose={() => setIsRSVPModalOpen(false)}
        initialStatus={rsvpInitialStatus}
        tables={tables}
        guests={guests}
        birthdayDetails={occasion}
        onSaveRSVP={onSaveRSVP}
      />

      {/* Digital Pass Lookup Modal */}
      <PassLookupModal
        isOpen={isPassLookupOpen}
        onClose={() => setIsPassLookupOpen(false)}
        occasion={occasion}
        guests={guests}
        tables={tables}
        onOpenRSVP={handleOpenRSVP}
      />

      {/* Gallery Photo Modal */}
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
