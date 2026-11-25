/**
 * Master Theme Catalog for Multi-Occasion Dynamic Theme Engine
 * Every theme defines colors, typography, background gradients, floating decorations,
 * and decorative hero graphics for full visual identity transformation.
 */

export const THEMES_CATALOG = [
  // 1. BIRTHDAY THEMES
  {
    id: 'birthday-purple-pink',
    name: 'Silver Jubilee & Rose Glam',
    occasionType: 'birthday',
    colors: {
      primary: '#ec4899',
      secondary: '#8b5cf6',
      accent: '#f59e0b',
      bgGradient: 'from-purple-950 via-slate-900 to-purple-950',
      headerGradient: 'from-pink-400 via-purple-300 to-amber-300',
      buttonGradient: 'from-pink-500 via-purple-600 to-amber-500',
      badgeBg: 'bg-pink-500/20 text-pink-300 border-pink-400/40',
      cardBg: 'rgba(255, 255, 255, 0.08)',
      cardBorder: 'rgba(255, 255, 255, 0.16)',
    },
    fonts: {
      heading: '"Playfair Display", serif',
      body: '"Outfit", sans-serif',
      accent: '"Great Vibes", cursive',
    },
    decorations: {
      type: 'balloons',
      palette: ['#ec4899', '#a855f7', '#fbbf24', '#38bdf8'],
    },
    heroGraphic: 'cake',
    bannerTag: 'Happy Birthday Celebration',
  },
  {
    id: 'birthday-golden-glow',
    name: 'Midnight Gold & Champagne',
    occasionType: 'birthday',
    colors: {
      primary: '#f59e0b',
      secondary: '#d97706',
      accent: '#fde047',
      bgGradient: 'from-amber-950 via-slate-950 to-amber-950',
      headerGradient: 'from-amber-300 via-yellow-200 to-amber-500',
      buttonGradient: 'from-amber-500 via-yellow-500 to-amber-600',
      badgeBg: 'bg-amber-500/20 text-amber-300 border-amber-400/40',
      cardBg: 'rgba(255, 255, 255, 0.07)',
      cardBorder: 'rgba(245, 158, 11, 0.25)',
    },
    fonts: {
      heading: '"Playfair Display", serif',
      body: '"Outfit", sans-serif',
      accent: '"Great Vibes", cursive',
    },
    decorations: {
      type: 'balloons',
      palette: ['#fbbf24', '#f59e0b', '#d97706', '#fef08a'],
    },
    heroGraphic: 'cake',
    bannerTag: 'Milestone Birthday Gala',
  },

  // 2. WEDDING THEMES
  {
    id: 'wedding-royal-red',
    name: 'Royal Rajputana Red & Gold',
    occasionType: 'wedding',
    colors: {
      primary: '#be123c',
      secondary: '#881337',
      accent: '#f59e0b',
      bgGradient: 'from-rose-950 via-slate-950 to-red-950',
      headerGradient: 'from-amber-300 via-rose-300 to-yellow-200',
      buttonGradient: 'from-rose-600 via-red-700 to-amber-500',
      badgeBg: 'bg-rose-500/20 text-rose-300 border-rose-400/40',
      cardBg: 'rgba(255, 255, 255, 0.08)',
      cardBorder: 'rgba(244, 63, 94, 0.25)',
    },
    fonts: {
      heading: '"Playfair Display", serif',
      body: '"Outfit", sans-serif',
      accent: '"Great Vibes", cursive',
    },
    decorations: {
      type: 'petals',
      palette: ['#f43f5e', '#e11d48', '#fbbf24', '#fda4af'],
    },
    heroGraphic: 'mandap',
    bannerTag: 'Shubh Vivaah Ceremony',
  },
  {
    id: 'wedding-ivory-emerald',
    name: 'Palatial Ivory & Emerald Royale',
    occasionType: 'wedding',
    colors: {
      primary: '#059669',
      secondary: '#064e3b',
      accent: '#fbbf24',
      bgGradient: 'from-emerald-950 via-slate-950 to-teal-950',
      headerGradient: 'from-emerald-300 via-amber-200 to-teal-200',
      buttonGradient: 'from-emerald-600 via-teal-700 to-amber-500',
      badgeBg: 'bg-emerald-500/20 text-emerald-300 border-emerald-400/40',
      cardBg: 'rgba(255, 255, 255, 0.07)',
      cardBorder: 'rgba(16, 185, 129, 0.25)',
    },
    fonts: {
      heading: '"Playfair Display", serif',
      body: '"Outfit", sans-serif',
      accent: '"Great Vibes", cursive',
    },
    decorations: {
      type: 'petals',
      palette: ['#34d399', '#fbbf24', '#10b981', '#fef08a'],
    },
    heroGraphic: 'mandap',
    bannerTag: 'Royal Matrimonial Celebration',
  },

  // 3. DIWALI THEMES
  {
    id: 'diwali-gold-purple',
    name: 'Deepavali Royal Purple & Golden Diyas',
    occasionType: 'diwali',
    colors: {
      primary: '#f59e0b',
      secondary: '#7c3aed',
      accent: '#fbbf24',
      bgGradient: 'from-purple-950 via-slate-950 to-indigo-950',
      headerGradient: 'from-amber-300 via-yellow-200 to-orange-400',
      buttonGradient: 'from-amber-500 via-orange-600 to-purple-600',
      badgeBg: 'bg-amber-500/20 text-amber-300 border-amber-400/40',
      cardBg: 'rgba(255, 255, 255, 0.08)',
      cardBorder: 'rgba(245, 158, 11, 0.3)',
    },
    fonts: {
      heading: '"Playfair Display", serif',
      body: '"Outfit", sans-serif',
      accent: '"Great Vibes", cursive',
    },
    decorations: {
      type: 'diyas',
      palette: ['#f59e0b', '#fbbf24', '#f97316', '#eab308'],
    },
    heroGraphic: 'diya',
    bannerTag: 'Festival of Lights & Prosperity',
  },

  // 4. RETIREMENT THEMES
  {
    id: 'retirement-navy-gold',
    name: 'Executive Navy Blue & Distinguished Gold',
    occasionType: 'retirement',
    colors: {
      primary: '#1d4ed8',
      secondary: '#0f172a',
      accent: '#f59e0b',
      bgGradient: 'from-slate-950 via-blue-950 to-slate-950',
      headerGradient: 'from-amber-300 via-blue-200 to-yellow-100',
      buttonGradient: 'from-blue-600 via-indigo-700 to-amber-500',
      badgeBg: 'bg-blue-500/20 text-blue-300 border-blue-400/40',
      cardBg: 'rgba(255, 255, 255, 0.07)',
      cardBorder: 'rgba(59, 130, 246, 0.25)',
    },
    fonts: {
      heading: '"Playfair Display", serif',
      body: '"Outfit", sans-serif',
      accent: '"Great Vibes", cursive',
    },
    decorations: {
      type: 'laurels',
      palette: ['#fbbf24', '#60a5fa', '#d97706', '#93c5fd'],
    },
    heroGraphic: 'plaque',
    bannerTag: 'Honor, Legacy & Achievement',
  },

  // 5. ANNIVERSARY THEMES
  {
    id: 'anniversary-rose-gold',
    name: 'Romantic Rose Gold & Champagne',
    occasionType: 'anniversary',
    colors: {
      primary: '#f43f5e',
      secondary: '#881337',
      accent: '#fbcfe8',
      bgGradient: 'from-rose-950 via-slate-950 to-pink-950',
      headerGradient: 'from-pink-300 via-rose-200 to-amber-200',
      buttonGradient: 'from-rose-500 via-pink-600 to-amber-400',
      badgeBg: 'bg-pink-500/20 text-pink-300 border-pink-400/40',
      cardBg: 'rgba(255, 255, 255, 0.08)',
      cardBorder: 'rgba(244, 63, 94, 0.25)',
    },
    fonts: {
      heading: '"Playfair Display", serif',
      body: '"Outfit", sans-serif',
      accent: '"Great Vibes", cursive',
    },
    decorations: {
      type: 'petals',
      palette: ['#fb7185', '#f43f5e', '#fbcfe8', '#fda4af'],
    },
    heroGraphic: 'rings',
    bannerTag: 'Celebrating Unconditional Love',
  },

  // 6. BABY SHOWER THEMES
  {
    id: 'babyshower-pastel-sky',
    name: 'Gentle Pastel Clouds & Starlight',
    occasionType: 'babyshower',
    colors: {
      primary: '#38bdf8',
      secondary: '#f472b6',
      accent: '#fef08a',
      bgGradient: 'from-indigo-950 via-slate-900 to-sky-950',
      headerGradient: 'from-sky-300 via-pink-300 to-yellow-200',
      buttonGradient: 'from-sky-500 via-pink-500 to-amber-400',
      badgeBg: 'bg-sky-500/20 text-sky-300 border-sky-400/40',
      cardBg: 'rgba(255, 255, 255, 0.09)',
      cardBorder: 'rgba(56, 189, 248, 0.3)',
    },
    fonts: {
      heading: '"Playfair Display", serif',
      body: '"Outfit", sans-serif',
      accent: '"Great Vibes", cursive',
    },
    decorations: {
      type: 'clouds',
      palette: ['#38bdf8', '#f472b6', '#a78bfa', '#fef08a'],
    },
    heroGraphic: 'baby',
    bannerTag: 'A Blessed Bundle of Joy',
  },

  // 7. HOLI THEMES
  {
    id: 'holi-vibrant-splash',
    name: 'Gulal Splashes & Festival of Colors',
    occasionType: 'holi',
    colors: {
      primary: '#ec4899',
      secondary: '#06b6d4',
      accent: '#eab308',
      bgGradient: 'from-slate-950 via-purple-950 to-pink-950',
      headerGradient: 'from-pink-400 via-yellow-300 to-cyan-300',
      buttonGradient: 'from-pink-500 via-amber-500 to-cyan-500',
      badgeBg: 'bg-yellow-500/20 text-yellow-300 border-yellow-400/40',
      cardBg: 'rgba(255, 255, 255, 0.09)',
      cardBorder: 'rgba(236, 72, 153, 0.3)',
    },
    fonts: {
      heading: '"Playfair Display", serif',
      body: '"Outfit", sans-serif',
      accent: '"Great Vibes", cursive',
    },
    decorations: {
      type: 'colors',
      palette: ['#ec4899', '#06b6d4', '#eab308', '#10b981'],
    },
    heroGraphic: 'colorSplash',
    bannerTag: 'Colors, Laughter & Joy',
  },

  // 8. HOUSEWARMING THEMES
  {
    id: 'housewarming-terracotta',
    name: 'Auspicious Kalash & Marigold Terracotta',
    occasionType: 'housewarming',
    colors: {
      primary: '#ea580c',
      secondary: '#9a3412',
      accent: '#fbbf24',
      bgGradient: 'from-orange-950 via-slate-950 to-amber-950',
      headerGradient: 'from-amber-300 via-orange-300 to-yellow-200',
      buttonGradient: 'from-orange-600 via-amber-600 to-yellow-500',
      badgeBg: 'bg-orange-500/20 text-orange-300 border-orange-400/40',
      cardBg: 'rgba(255, 255, 255, 0.08)',
      cardBorder: 'rgba(234, 88, 12, 0.3)',
    },
    fonts: {
      heading: '"Playfair Display", serif',
      body: '"Outfit", sans-serif',
      accent: '"Great Vibes", cursive',
    },
    decorations: {
      type: 'diyas',
      palette: ['#ea580c', '#fbbf24', '#f97316', '#eab308'],
    },
    heroGraphic: 'kalash',
    bannerTag: 'Griha Pravesh & Shubh Vastu',
  },

  // 9. CHRISTMAS & NEW YEAR
  {
    id: 'christmas-crimson-pine',
    name: 'Crimson Velvet & Evergreen Pine',
    occasionType: 'christmas',
    colors: {
      primary: '#dc2626',
      secondary: '#166534',
      accent: '#fef08a',
      bgGradient: 'from-emerald-950 via-slate-950 to-red-950',
      headerGradient: 'from-red-300 via-amber-200 to-emerald-300',
      buttonGradient: 'from-red-600 via-emerald-700 to-amber-500',
      badgeBg: 'bg-red-500/20 text-red-300 border-red-400/40',
      cardBg: 'rgba(255, 255, 255, 0.08)',
      cardBorder: 'rgba(220, 38, 38, 0.3)',
    },
    fonts: {
      heading: '"Playfair Display", serif',
      body: '"Outfit", sans-serif',
      accent: '"Great Vibes", cursive',
    },
    decorations: {
      type: 'snow',
      palette: ['#ffffff', '#fef08a', '#86efac', '#fca5a5'],
    },
    heroGraphic: 'champagne',
    bannerTag: 'Season of Joy & Peace',
  },
  {
    id: 'newyear-midnight-gold',
    name: 'Midnight Starlight & Champagne Sparklers',
    occasionType: 'newyear',
    colors: {
      primary: '#a855f7',
      secondary: '#0f172a',
      accent: '#fbbf24',
      bgGradient: 'from-purple-950 via-slate-950 to-indigo-950',
      headerGradient: 'from-amber-300 via-purple-300 to-cyan-200',
      buttonGradient: 'from-purple-600 via-indigo-600 to-amber-500',
      badgeBg: 'bg-purple-500/20 text-purple-300 border-purple-400/40',
      cardBg: 'rgba(255, 255, 255, 0.08)',
      cardBorder: 'rgba(168, 85, 247, 0.3)',
    },
    fonts: {
      heading: '"Playfair Display", serif',
      body: '"Outfit", sans-serif',
      accent: '"Great Vibes", cursive',
    },
    decorations: {
      type: 'stars',
      palette: ['#fbbf24', '#a855f7', '#38bdf8', '#fef08a'],
    },
    heroGraphic: 'champagne',
    bannerTag: 'Ringing in the New Year',
  },

  // 10. EID THEMES
  {
    id: 'eid-emerald-gold',
    name: 'Crescent Moon & Emerald Arabesque',
    occasionType: 'eid',
    colors: {
      primary: '#059669',
      secondary: '#064e3b',
      accent: '#fbbf24',
      bgGradient: 'from-emerald-950 via-slate-950 to-teal-950',
      headerGradient: 'from-emerald-300 via-amber-200 to-teal-200',
      buttonGradient: 'from-emerald-600 via-teal-700 to-amber-500',
      badgeBg: 'bg-emerald-500/20 text-emerald-300 border-emerald-400/40',
      cardBg: 'rgba(255, 255, 255, 0.08)',
      cardBorder: 'rgba(5, 150, 105, 0.3)',
    },
    fonts: {
      heading: '"Playfair Display", serif',
      body: '"Outfit", sans-serif',
      accent: '"Great Vibes", cursive',
    },
    decorations: {
      type: 'stars',
      palette: ['#34d399', '#fbbf24', '#a7f3d0', '#fef08a'],
    },
    heroGraphic: 'diya',
    bannerTag: 'Eid Mubarak Celebration',
  },

  // 11. CORPORATE & GRADUATION
  {
    id: 'corporate-executive-blue',
    name: 'Corporate Sapphire & Stature',
    occasionType: 'corporate',
    colors: {
      primary: '#2563eb',
      secondary: '#0f172a',
      accent: '#38bdf8',
      bgGradient: 'from-slate-950 via-blue-950 to-slate-950',
      headerGradient: 'from-blue-300 via-sky-200 to-white',
      buttonGradient: 'from-blue-600 via-indigo-600 to-sky-500',
      badgeBg: 'bg-blue-500/20 text-blue-300 border-blue-400/40',
      cardBg: 'rgba(255, 255, 255, 0.07)',
      cardBorder: 'rgba(37, 99, 235, 0.25)',
    },
    fonts: {
      heading: '"Playfair Display", serif',
      body: '"Outfit", sans-serif',
      accent: '"Great Vibes", cursive',
    },
    decorations: {
      type: 'laurels',
      palette: ['#38bdf8', '#60a5fa', '#93c5fd', '#ffffff'],
    },
    heroGraphic: 'plaque',
    bannerTag: 'Annual Excellence & Keynote',
  },
  {
    id: 'graduation-crimson-gold',
    name: 'Academic Regalia & Convocation Gold',
    occasionType: 'graduation',
    colors: {
      primary: '#4338ca',
      secondary: '#1e1b4b',
      accent: '#f59e0b',
      bgGradient: 'from-indigo-950 via-slate-950 to-slate-950',
      headerGradient: 'from-amber-300 via-indigo-200 to-yellow-100',
      buttonGradient: 'from-indigo-600 via-purple-700 to-amber-500',
      badgeBg: 'bg-indigo-500/20 text-indigo-300 border-indigo-400/40',
      cardBg: 'rgba(255, 255, 255, 0.07)',
      cardBorder: 'rgba(99, 102, 241, 0.25)',
    },
    fonts: {
      heading: '"Playfair Display", serif',
      body: '"Outfit", sans-serif',
      accent: '"Great Vibes", cursive',
    },
    decorations: {
      type: 'stars',
      palette: ['#fbbf24', '#818cf8', '#f59e0b', '#c7d2fe'],
    },
    heroGraphic: 'plaque',
    bannerTag: 'Honoring the Graduating Class',
  },

  // 12. CUSTOM & GENERAL
  {
    id: 'custom-celebration',
    name: 'Universal Festive Splendor',
    occasionType: 'custom',
    colors: {
      primary: '#7c3aed',
      secondary: '#db2777',
      accent: '#f59e0b',
      bgGradient: 'from-purple-950 via-slate-900 to-pink-950',
      headerGradient: 'from-pink-400 via-purple-300 to-amber-300',
      buttonGradient: 'from-purple-600 via-pink-600 to-amber-500',
      badgeBg: 'bg-purple-500/20 text-purple-300 border-purple-400/40',
      cardBg: 'rgba(255, 255, 255, 0.08)',
      cardBorder: 'rgba(255, 255, 255, 0.16)',
    },
    fonts: {
      heading: '"Playfair Display", serif',
      body: '"Outfit", sans-serif',
      accent: '"Great Vibes", cursive',
    },
    decorations: {
      type: 'confetti',
      palette: ['#ec4899', '#8b5cf6', '#fbbf24', '#10b981'],
    },
    heroGraphic: 'champagne',
    bannerTag: 'Special Occasion Gathering',
  },
];

/**
 * Returns the theme object by ID or resolves the best default theme for an occasion type
 */
export function getThemeById(themeId, occasionType = 'birthday') {
  if (themeId) {
    const found = THEMES_CATALOG.find(t => t.id === themeId);
    if (found) return found;
  }
  // Fallback by occasionType
  const match = THEMES_CATALOG.find(t => t.occasionType === occasionType);
  return match || THEMES_CATALOG[0];
}
