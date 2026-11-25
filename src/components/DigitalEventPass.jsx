import React, { useState, useEffect, useRef } from 'react';
import {
  Download,
  Share2,
  Copy,
  Check,
  ShieldCheck,
  Calendar,
  Clock,
  MapPin,
  Users,
  Ticket,
  Printer,
  Sparkles,
  Heart,
  Award,
  Flame,
  Cake,
  ExternalLink,
} from 'lucide-react';
import { toPng, toBlob } from 'html-to-image';
import confetti from 'canvas-confetti';
import {
  generateUniquePassId,
  maskMobileNumber,
  generatePassQrData,
  generatePassQrDataUrl,
  getPassThemeConfig,
} from '../utils/passGenerator';

export default function DigitalEventPass({
  guest = {},
  occasion = {},
  tableName = '',
  onClose,
  showActions = true,
  isModal = false,
}) {
  const passCardRef = useRef(null);
  const [qrCodeUrl, setQrCodeUrl] = useState('');
  const [isDownloading, setIsDownloading] = useState(false);
  const [copiedPassId, setCopiedPassId] = useState(false);
  const [shareSuccess, setShareSuccess] = useState(false);

  // Computed properties
  const passId = generateUniquePassId(guest, occasion);
  const maskedMobile = maskMobileNumber(guest.mobileNumber);
  const theme = getPassThemeConfig(occasion);

  // Formatted Event Time & Date
  const eventDate = occasion.displayDate || occasion.eventDate || 'Date to be announced';
  const eventTime = occasion.displayTime || occasion.partyStartTime || '5:00 PM onwards';
  const venue = occasion.venueName || 'Grand Palace Banquets';
  const address = occasion.venueAddress || '';
  const totalMembers = guest.totalMembers || 1;
  const resolvedTable = tableName || (guest.tableNumber ? `Table ${guest.tableNumber}` : 'Open Seating');

  // Generate QR code on load
  useEffect(() => {
    let isMounted = true;
    const qrPayload = generatePassQrData(passId, occasion);
    generatePassQrDataUrl(qrPayload, {
      dark: '#0f172a',
      light: '#ffffff',
    }).then((url) => {
      if (isMounted) setQrCodeUrl(url);
    });

    return () => {
      isMounted = false;
    };
  }, [passId, occasion]);

  // Copy Pass ID
  const handleCopyPassId = () => {
    navigator.clipboard.writeText(passId);
    setCopiedPassId(true);
    setTimeout(() => setCopiedPassId(false), 2500);
  };

  // Download Pass as PNG
  const handleDownloadImage = async () => {
    if (!passCardRef.current || isDownloading) return;

    try {
      setIsDownloading(true);

      // Trigger celebratory confetti
      confetti({
        particleCount: 60,
        spread: 60,
        origin: { y: 0.6 },
        colors: [theme.accentColor, theme.secondaryColor, '#10b981'],
      });

      // Render high-res PNG image
      const dataUrl = await toPng(passCardRef.current, {
        cacheBust: true,
        pixelRatio: 2.5,
        quality: 0.95,
      });

      const guestSlug = (guest.guestName || 'Guest').replace(/[^a-zA-Z0-9]/g, '_');
      const filename = `EventPass_${passId}_${guestSlug}.png`;

      const link = document.createElement('a');
      link.download = filename;
      link.href = dataUrl;
      link.click();
    } catch (err) {
      console.error('Failed to generate pass image', err);
      alert('Could not generate the pass image automatically. You can take a screenshot or print this pass.');
    } finally {
      setIsDownloading(false);
    }
  };

  // Share Pass via Web Share API or WhatsApp
  const handleSharePass = async () => {
    const shareText = `🎟️ *OFFICIAL EVENT PASS*\n` +
      `*Event:* ${occasion.celebrationTitle || occasion.title || 'Celebration'}\n` +
      `*Guest:* ${guest.guestName}\n` +
      `*Pass ID:* ${passId}\n` +
      `*Party Size:* ${totalMembers} Member(s)\n` +
      `*Date:* ${eventDate}\n` +
      `*Time:* ${eventTime}\n` +
      `*Venue:* ${venue}\n` +
      `*Status:* VALID\n\n` +
      `View invitation: ${window.location.href}`;

    // Try sharing file directly if supported
    if (navigator.share && passCardRef.current) {
      try {
        const blob = await toBlob(passCardRef.current, { pixelRatio: 2, cacheBust: true });
        if (blob && navigator.canShare && navigator.canShare({ files: [new File([blob], 'pass.png', { type: 'image/png' })] })) {
          const file = new File([blob], `EventPass_${passId}.png`, { type: 'image/png' });
          await navigator.share({
            title: `${occasion.title || 'Event'} - Digital Pass`,
            text: shareText,
            files: [file],
          });
          setShareSuccess(true);
          setTimeout(() => setShareSuccess(false), 2500);
          return;
        }

        // Fallback to text share
        await navigator.share({
          title: `${occasion.title || 'Event'} - Digital Pass`,
          text: shareText,
          url: window.location.href,
        });
        setShareSuccess(true);
        setTimeout(() => setShareSuccess(false), 2500);
        return;
      } catch (err) {
        if (err.name !== 'AbortError') {
          console.warn('Share API error, falling back to WhatsApp', err);
        }
      }
    }

    // Direct WhatsApp share fallback
    const whatsappUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(shareText)}`;
    window.open(whatsappUrl, '_blank');
  };

  // Render Theme-Specific Decorative Header Motif
  const renderThemeMotif = () => {
    switch (theme.motif) {
      case 'cake_balloons':
        return (
          <div className="absolute top-2 right-3 flex items-center gap-1.5 opacity-25 pointer-events-none">
            <span className="text-2xl animate-bounce">🎈</span>
            <Cake className="w-8 h-8 text-amber-300" />
            <span className="text-2xl">✨</span>
          </div>
        );

      case 'diyas_gold':
        return (
          <div className="absolute top-2 right-3 flex items-center gap-2 opacity-30 pointer-events-none">
            <Flame className="w-7 h-7 text-amber-300 fill-amber-400" />
            <Sparkles className="w-6 h-6 text-yellow-200" />
          </div>
        );

      case 'laurel_gold':
        return (
          <div className="absolute top-2 right-3 flex items-center gap-1.5 opacity-25 pointer-events-none">
            <Award className="w-8 h-8 text-amber-300" />
            <span className="text-xl">⭐</span>
          </div>
        );

      case 'wedding_rings':
        return (
          <div className="absolute top-2 right-3 flex items-center gap-1.5 opacity-30 pointer-events-none">
            <Heart className="w-7 h-7 text-rose-300 fill-rose-400" />
            <span className="text-xl">💍</span>
          </div>
        );

      case 'hearts_rose':
        return (
          <div className="absolute top-2 right-3 flex items-center gap-1.5 opacity-30 pointer-events-none">
            <Heart className="w-7 h-7 text-pink-300 fill-pink-400" />
            <span className="text-xl">🥂</span>
          </div>
        );

      case 'colors_splash':
        return (
          <div className="absolute top-2 right-3 flex items-center gap-1.5 opacity-30 pointer-events-none">
            <span className="text-2xl">🎨</span>
            <Sparkles className="w-7 h-7 text-yellow-300" />
          </div>
        );

      default:
        return (
          <div className="absolute top-2 right-3 flex items-center gap-1.5 opacity-20 pointer-events-none">
            <Sparkles className="w-7 h-7 text-white" />
          </div>
        );
    }
  };

  return (
    <div className="w-full max-w-md mx-auto text-left">
      
      {/* "Your Event Pass is Ready!" Celebration Announcement */}
      <div className="text-center mb-4 space-y-1">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold shadow-sm">
          <ShieldCheck className="w-4 h-4 text-emerald-600" />
          <span>Your Event Pass is Ready!</span>
        </div>
        <p className="text-xs text-slate-500">
          Present this official digital pass or QR code upon arrival at the venue.
        </p>
      </div>

      {/* ======================================================== */}
      {/* THE CAPTURABLE DIGITAL EVENT PASS CARD                  */}
      {/* ======================================================== */}
      <div
        ref={passCardRef}
        id="digital-event-pass-card"
        className="relative bg-slate-900 text-white rounded-3xl overflow-hidden shadow-2xl border-2 border-slate-700/60 select-none font-sans"
        style={{
          boxShadow: `0 20px 45px -10px ${theme.glowColor}, 0 0 1px 1px rgba(255,255,255,0.1)`,
        }}
      >
        {/* Pass Top Banner */}
        <div className={`relative p-5 pb-4 bg-gradient-to-r ${theme.gradient} text-white border-b border-white/10`}>
          {renderThemeMotif()}

          <div className="flex items-center justify-between gap-2 mb-2">
            {/* Themed Badge */}
            <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider ${theme.badgeBg} shadow-sm`}>
              {theme.badgeText}
            </span>

            {/* Pass Status: VALID */}
            <div className="flex items-center gap-1.5 bg-black/40 backdrop-blur-md px-2.5 py-1 rounded-full border border-emerald-400/40">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              <span className="text-[11px] font-black tracking-widest text-emerald-300 uppercase">VALID</span>
            </div>
          </div>

          {/* Event Title */}
          <h3 className="text-xl sm:text-2xl font-serif font-black tracking-tight text-white leading-tight drop-shadow-sm pr-10">
            {occasion.celebrationTitle || occasion.title || occasion.occasionName || 'Celebration'}
          </h3>

          {/* Occasion Category */}
          <p className="text-xs text-white/90 font-medium mt-0.5 flex items-center gap-1">
            <Sparkles className="w-3.5 h-3.5 text-amber-300 shrink-0" />
            <span className="truncate">{theme.occasionSubtitle}</span>
          </p>
        </div>

        {/* Pass Details Body */}
        <div className="p-5 bg-gradient-to-b from-slate-900 to-slate-950 space-y-4">
          
          {/* Guest Identity Card */}
          <div className="bg-white/5 rounded-2xl p-3.5 border border-white/10 flex items-center justify-between gap-3">
            <div>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                Primary Guest Name
              </span>
              <h4 className="text-base sm:text-lg font-bold text-white tracking-tight flex items-center gap-1.5">
                <span>{guest.guestName || 'Valued Guest'}</span>
              </h4>
            </div>

            {/* Masked Mobile Pill */}
            <div className="text-right">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                Mobile Number
              </span>
              <span className="font-mono text-xs sm:text-sm font-semibold text-amber-300">
                {maskedMobile}
              </span>
            </div>
          </div>

          {/* Key Event Metrics Grid */}
          <div className="grid grid-cols-2 gap-2.5 text-xs">
            {/* Total Members */}
            <div className="bg-white/5 rounded-xl p-2.5 border border-white/5 flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-purple-500/20 text-purple-300 flex items-center justify-center shrink-0">
                <Users className="w-4 h-4" />
              </div>
              <div className="min-w-0">
                <span className="text-[10px] text-slate-400 block uppercase">Party Size</span>
                <span className="font-bold text-white text-xs sm:text-sm truncate block">
                  {totalMembers} {totalMembers === 1 ? 'Guest' : 'Members'}
                </span>
              </div>
            </div>

            {/* Table Number */}
            <div className="bg-white/5 rounded-xl p-2.5 border border-white/5 flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-pink-500/20 text-pink-300 flex items-center justify-center shrink-0">
                <Ticket className="w-4 h-4" />
              </div>
              <div className="min-w-0">
                <span className="text-[10px] text-slate-400 block uppercase">Seating Table</span>
                <span className="font-bold text-amber-300 text-xs sm:text-sm truncate block">
                  {resolvedTable}
                </span>
              </div>
            </div>

            {/* Event Date */}
            <div className="bg-white/5 rounded-xl p-2.5 border border-white/5 flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-blue-500/20 text-blue-300 flex items-center justify-center shrink-0">
                <Calendar className="w-4 h-4" />
              </div>
              <div className="min-w-0">
                <span className="text-[10px] text-slate-400 block uppercase">Event Date</span>
                <span className="font-bold text-white text-xs truncate block">{eventDate}</span>
              </div>
            </div>

            {/* Event Time */}
            <div className="bg-white/5 rounded-xl p-2.5 border border-white/5 flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-emerald-500/20 text-emerald-300 flex items-center justify-center shrink-0">
                <Clock className="w-4 h-4" />
              </div>
              <div className="min-w-0">
                <span className="text-[10px] text-slate-400 block uppercase">Party Time</span>
                <span className="font-bold text-white text-xs truncate block">{eventTime}</span>
              </div>
            </div>
          </div>

          {/* Venue Info */}
          <div className="bg-white/5 rounded-xl p-2.5 border border-white/5 flex items-start gap-2 text-xs">
            <div className="w-7 h-7 rounded-lg bg-rose-500/20 text-rose-300 flex items-center justify-center shrink-0 mt-0.5">
              <MapPin className="w-4 h-4" />
            </div>
            <div className="min-w-0 flex-1">
              <span className="text-[10px] text-slate-400 block uppercase">Venue Address</span>
              <p className="font-semibold text-white text-xs leading-snug">{venue}</p>
              {address && (
                <p className="text-[11px] text-slate-300/80 leading-tight mt-0.5 truncate">{address}</p>
              )}
            </div>
          </div>
        </div>

        {/* ======================================================== */}
        {/* TICKET NOTCH & PERFORATED DIVIDER                       */}
        {/* ======================================================== */}
        <div className="relative py-2 flex items-center bg-slate-950">
          {/* Left Cutout Hole */}
          <div className="absolute -left-3 w-6 h-6 rounded-full bg-slate-900 border-r-2 border-slate-700/80"></div>

          {/* Dashed Perforation Line */}
          <div className="w-full border-t-2 border-dashed border-slate-700 mx-4"></div>

          {/* Right Cutout Hole */}
          <div className="absolute -right-3 w-6 h-6 rounded-full bg-slate-900 border-l-2 border-slate-700/80"></div>
        </div>

        {/* ======================================================== */}
        {/* PASS STUB: QR CODE & UNIQUE PASS ID                     */}
        {/* ======================================================== */}
        <div className="p-5 pt-3 bg-slate-950 flex items-center justify-between gap-4">
          
          {/* QR Code Graphic Container */}
          <div className="relative w-24 h-24 sm:w-28 sm:h-28 bg-white p-1.5 rounded-2xl shadow-md border-2 border-amber-400/60 shrink-0 flex items-center justify-center">
            {qrCodeUrl ? (
              <img
                src={qrCodeUrl}
                alt={`QR Code for ${passId}`}
                className="w-full h-full object-contain"
              />
            ) : (
              <div className="text-[10px] text-slate-500 text-center font-mono">Generating QR...</div>
            )}
            <div className="absolute -bottom-2 px-1.5 py-0.5 bg-slate-900 border border-amber-400/50 rounded-md text-[8px] font-bold text-amber-300 uppercase tracking-tighter">
              Scan & Verify
            </div>
          </div>

          {/* Pass Identification & Security Barcode */}
          <div className="flex-1 min-w-0 space-y-2">
            <div>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                Unique Pass ID
              </span>
              <div className="font-mono text-sm sm:text-base font-black text-amber-300 tracking-wider">
                {passId}
              </div>
            </div>

            {/* Security Notice */}
            <div className="text-[10px] text-slate-400 leading-tight">
              <span className="block text-slate-300 font-medium">Official Digital Invite Pass</span>
              <span>Valid for registered party size only. Non-transferable.</span>
            </div>

            {/* Visual Simulated Barcode Strip */}
            <div className="pt-1 opacity-60">
              <div className="h-4 w-full flex items-center gap-[2px] overflow-hidden">
                {Array.from({ length: 38 }).map((_, idx) => (
                  <span
                    key={idx}
                    className="h-full bg-slate-300"
                    style={{
                      width: idx % 3 === 0 ? '3px' : idx % 2 === 0 ? '1px' : '2px',
                      opacity: idx % 4 === 0 ? 0.3 : 1,
                    }}
                  ></span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ======================================================== */}
      {/* ACTION CONTROLS: DOWNLOAD PNG, SHARE, COPY ID            */}
      {/* ======================================================== */}
      {showActions && (
        <div className="mt-4 space-y-2.5">
          {/* Primary Action: Download PNG */}
          <button
            type="button"
            onClick={handleDownloadImage}
            disabled={isDownloading}
            className="w-full py-3.5 px-5 rounded-2xl font-bold text-sm text-white bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-700 hover:from-emerald-500 hover:to-teal-600 shadow-lg shadow-emerald-700/30 transition-all flex items-center justify-center gap-2 transform active:scale-[0.98] disabled:opacity-60 cursor-pointer"
          >
            {isDownloading ? (
              <>
                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                <span>Generating High-Res Pass...</span>
              </>
            ) : (
              <>
                <Download className="w-4 h-4" />
                <span>Download Event Pass (PNG)</span>
              </>
            )}
          </button>

          {/* Secondary Actions: Share & Copy Pass ID */}
          <div className="grid grid-cols-2 gap-2">
            {/* Share Pass */}
            <button
              type="button"
              onClick={handleSharePass}
              className="py-2.5 px-3 rounded-xl font-semibold text-xs text-slate-700 bg-white hover:bg-slate-50 border border-slate-200 shadow-sm transition-all flex items-center justify-center gap-1.5 cursor-pointer"
            >
              {shareSuccess ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-600" />
                  <span className="text-emerald-700 font-bold">Shared!</span>
                </>
              ) : (
                <>
                  <Share2 className="w-3.5 h-3.5 text-purple-600" />
                  <span>Share Pass</span>
                </>
              )}
            </button>

            {/* Copy Pass ID */}
            <button
              type="button"
              onClick={handleCopyPassId}
              className="py-2.5 px-3 rounded-xl font-semibold text-xs text-slate-700 bg-white hover:bg-slate-50 border border-slate-200 shadow-sm transition-all flex items-center justify-center gap-1.5 cursor-pointer"
            >
              {copiedPassId ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-600" />
                  <span className="text-emerald-700 font-bold">Pass ID Copied!</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5 text-amber-600" />
                  <span>Copy Pass ID</span>
                </>
              )}
            </button>
          </div>

          {/* Close or Return callback if in modal */}
          {onClose && (
            <button
              type="button"
              onClick={onClose}
              className="w-full py-2.5 text-xs font-semibold text-slate-500 hover:text-slate-800 transition-colors"
            >
              Done & Return to Invitation
            </button>
          )}
        </div>
      )}
    </div>
  );
}
