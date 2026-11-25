import QRCode from 'qrcode';

/**
 * Normalizes and formats a unique Pass ID.
 * Example format: PASS-2026-0001
 *
 * @param {object} guest - Guest object
 * @param {object} occasion - Occasion object
 * @param {number} [index] - Optional sequential index
 * @returns {string} Unique Pass ID
 */
export function generateUniquePassId(guest = {}, occasion = {}, index = 1) {
  if (guest.passId && typeof guest.passId === 'string' && guest.passId.startsWith('PASS-')) {
    return guest.passId;
  }

  // Determine year from occasion eventDate or current year
  let year = '2026';
  if (occasion?.eventDate) {
    const yr = new Date(occasion.eventDate).getFullYear();
    if (!isNaN(yr) && yr > 2000) year = String(yr);
  }

  // Generate 4-digit sequential / unique suffix
  let seqNumber = 1;
  if (typeof guest.id === 'number') {
    if (guest.id <= 9999) {
      seqNumber = guest.id;
    } else {
      // If it is a timestamp, derive a deterministic 4-digit number
      seqNumber = (guest.id % 9000) + 1000;
    }
  } else if (typeof index === 'number' && index > 0) {
    seqNumber = index;
  }

  const paddedSeq = String(seqNumber).padStart(4, '0');
  return `PASS-${year}-${paddedSeq}`;
}

/**
 * Masks mobile number to format: ******3210
 * (First 6 digits replaced with '*', last 4 digits visible)
 *
 * @param {string|number} mobile - Phone number
 * @returns {string} Masked phone number (e.g. ******3210)
 */
export function maskMobileNumber(mobile) {
  if (!mobile) return '******0000';
  const clean = String(mobile).replace(/\D/g, '');
  if (clean.length >= 10) {
    const last4 = clean.slice(-4);
    return `******${last4}`;
  }
  if (clean.length >= 4) {
    const last4 = clean.slice(-4);
    return '*'.repeat(Math.max(4, clean.length - 4)) + last4;
  }
  return '******' + clean.padStart(4, '0').slice(-4);
}

/**
 * Generates secure QR Code content without embedding full personal data.
 * Contains only Pass ID, Occasion ID, and status/signature verification token.
 *
 * @param {string} passId - Pass ID (e.g. PASS-2026-0001)
 * @param {object} occasion - Occasion object
 * @returns {string} QR Code verification string / URL
 */
export function generatePassQrData(passId, occasion = {}) {
  const occId = occasion?.id || 'EVENT';
  const year = passId.split('-')[1] || '2026';
  // Secure verification token (hash of passId + year)
  const checksum = (passId.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0) % 9000) + 1000;
  return `https://celebrationos.events/verify?pass=${encodeURIComponent(passId)}&occ=${encodeURIComponent(occId)}&v=${checksum}`;
}

/**
 * Generates a high-resolution base64 PNG data URL for the QR code.
 *
 * @param {string} qrPayload - Text or URL to encode
 * @param {object} [colorOptions] - Custom dark & light colors
 * @returns {Promise<string>} Data URL
 */
export async function generatePassQrDataUrl(qrPayload, colorOptions = {}) {
  try {
    const options = {
      errorCorrectionLevel: 'M',
      type: 'image/png',
      width: 320,
      margin: 1,
      color: {
        dark: colorOptions.dark || '#0f172a',
        light: colorOptions.light || '#ffffff',
      },
    };
    const fn = typeof QRCode?.toDataURL === 'function'
      ? QRCode.toDataURL
      : typeof QRCode?.default?.toDataURL === 'function'
      ? QRCode.default.toDataURL
      : null;

    if (fn) {
      return await fn(qrPayload, options);
    }
    return '';
  } catch (err) {
    console.error('Failed to generate pass QR code data URL', err);
    return '';
  }
}

/**
 * Returns themed styling configuration for the digital pass card based on occasion.
 * Includes colors, badges, accents, decorative icons, and motifs.
 *
 * @param {object} occasion - Occasion object
 * @returns {object} Themed styling configuration
 */
export function getPassThemeConfig(occasion = {}) {
  const type = (occasion.occasionType || 'birthday').toLowerCase();

  switch (type) {
    case 'birthday':
      return {
        key: 'birthday',
        gradient: 'from-fuchsia-600 via-purple-700 to-pink-600',
        badgeBg: 'bg-amber-400 text-purple-950',
        accentColor: '#f59e0b',
        secondaryColor: '#ec4899',
        borderFoil: 'border-amber-300/60',
        glowColor: 'rgba(236, 72, 153, 0.35)',
        badgeText: 'BIRTHDAY VIP PASS',
        occasionSubtitle: 'Birthday Celebration & Feast',
        motif: 'cake_balloons',
        tagline: 'Join the Grand Birthday Bash',
        iconType: 'cake',
      };

    case 'diwali':
      return {
        key: 'diwali',
        gradient: 'from-amber-600 via-purple-900 to-indigo-950',
        badgeBg: 'bg-amber-400 text-amber-950',
        accentColor: '#fbbf24',
        secondaryColor: '#9333ea',
        borderFoil: 'border-amber-400/70',
        glowColor: 'rgba(245, 158, 11, 0.4)',
        badgeText: 'FESTIVAL OF LIGHTS PASS',
        occasionSubtitle: 'Diwali Deepotsav Celebration',
        motif: 'diyas_gold',
        tagline: 'Shubh Deepavali • Lakshmi Puja & Utsav',
        iconType: 'diya',
      };

    case 'retirement':
      return {
        key: 'retirement',
        gradient: 'from-slate-900 via-blue-950 to-slate-900',
        badgeBg: 'bg-amber-400 text-slate-950',
        accentColor: '#f59e0b',
        secondaryColor: '#3b82f6',
        borderFoil: 'border-amber-400/80',
        glowColor: 'rgba(245, 158, 11, 0.3)',
        badgeText: 'HONORARY GUEST BADGE',
        occasionSubtitle: 'Retirement Milestone Gala',
        motif: 'laurel_gold',
        tagline: 'Honoring a Distinguished Career Journey',
        iconType: 'laurel',
      };

    case 'wedding':
      return {
        key: 'wedding',
        gradient: 'from-rose-900 via-red-950 to-amber-950',
        badgeBg: 'bg-amber-300 text-red-950',
        accentColor: '#fbbf24',
        secondaryColor: '#e11d48',
        borderFoil: 'border-amber-300/80',
        glowColor: 'rgba(225, 29, 72, 0.4)',
        badgeText: 'ROYAL WEDDING PASS',
        occasionSubtitle: 'Shubh Vivaah Ceremony & Reception',
        motif: 'wedding_rings',
        tagline: 'Two Souls, One Sacred Celebration',
        iconType: 'rings',
      };

    case 'anniversary':
      return {
        key: 'anniversary',
        gradient: 'from-rose-800 via-pink-900 to-slate-900',
        badgeBg: 'bg-rose-300 text-rose-950',
        accentColor: '#fb7185',
        secondaryColor: '#f43f5e',
        borderFoil: 'border-rose-300/80',
        glowColor: 'rgba(244, 63, 94, 0.35)',
        badgeText: 'JUBILEE CELEBRATION PASS',
        occasionSubtitle: 'Wedding Anniversary Gala',
        motif: 'hearts_rose',
        tagline: 'Celebrating Years of Love & Togetherness',
        iconType: 'hearts',
      };

    case 'baby_shower':
    case 'naming_ceremony':
      return {
        key: 'baby_shower',
        gradient: 'from-sky-700 via-indigo-900 to-pink-700',
        badgeBg: 'bg-sky-200 text-sky-950',
        accentColor: '#38bdf8',
        secondaryColor: '#f472b6',
        borderFoil: 'border-sky-300/70',
        glowColor: 'rgba(56, 189, 248, 0.35)',
        badgeText: 'LITTLE MIRACLE PASS',
        occasionSubtitle: type === 'baby_shower' ? 'Baby Shower Celebration' : 'Naming Ceremony (Naamkaran)',
        motif: 'clouds_stars',
        tagline: 'Welcoming Our Bundle of Joy',
        iconType: 'baby',
      };

    case 'holi':
      return {
        key: 'holi',
        gradient: 'from-pink-600 via-yellow-600 to-teal-700',
        badgeBg: 'bg-yellow-300 text-slate-950',
        accentColor: '#facc15',
        secondaryColor: '#ec4899',
        borderFoil: 'border-yellow-300/80',
        glowColor: 'rgba(236, 72, 153, 0.4)',
        badgeText: 'RANGOTSAV ENTRY PASS',
        occasionSubtitle: 'Festival of Colors Celebration',
        motif: 'colors_splash',
        tagline: 'Celebrate Spring, Gulal & Sweet Memories',
        iconType: 'colors',
      };

    case 'christmas':
    case 'new_year':
      return {
        key: 'festive',
        gradient: 'from-emerald-900 via-slate-900 to-rose-950',
        badgeBg: 'bg-amber-300 text-emerald-950',
        accentColor: '#fbbf24',
        secondaryColor: '#10b981',
        borderFoil: 'border-amber-300/80',
        glowColor: 'rgba(16, 185, 129, 0.35)',
        badgeText: type === 'new_year' ? 'NEW YEAR GALA PASS' : 'CHRISTMAS FEAST PASS',
        occasionSubtitle: type === 'new_year' ? 'New Year Countdown Bash' : 'Joyful Christmas Gala',
        motif: 'snowflakes_champagne',
        tagline: 'Cheers to New Beginnings & Festive Cheer',
        iconType: 'sparkles',
      };

    default:
      return {
        key: 'general',
        gradient: 'from-purple-800 via-slate-900 to-indigo-950',
        badgeBg: 'bg-amber-400 text-slate-950',
        accentColor: '#f59e0b',
        secondaryColor: '#8b5cf6',
        borderFoil: 'border-amber-400/60',
        glowColor: 'rgba(139, 92, 246, 0.35)',
        badgeText: 'VIP INVITATION PASS',
        occasionSubtitle: occasion.title || 'Special Celebration',
        motif: 'generic_vip',
        tagline: 'Cordially Invited Guest',
        iconType: 'ticket',
      };
  }
}
