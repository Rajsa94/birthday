import React, { useState } from 'react';
import { Sparkles, Heart, Award, Wine } from 'lucide-react';
import confetti from 'canvas-confetti';
import BirthdayCake from '../BirthdayCake';

export default function OccasionHeroGraphic({
  graphicType = 'cake',
  customImage = null,
  occasion = {},
}) {
  const [interactiveActive, setInteractiveActive] = useState(true);

  const triggerCelebrationConfetti = (colors = ['#f59e0b', '#ec4899', '#8b5cf6']) => {
    confetti({
      particleCount: 75,
      spread: 70,
      origin: { y: 0.6 },
      colors,
    });
  };

  // If user uploaded a custom hero / cake image, show it framed gracefully
  if (customImage) {
    return (
      <div className="relative group text-center select-none">
        <div className="w-56 sm:w-64 h-56 sm:h-64 rounded-3xl overflow-hidden border-4 border-amber-300/80 shadow-2xl bg-slate-900 group-hover:scale-105 transition-transform duration-300">
          <img
            src={customImage}
            alt={occasion.occasionName || 'Celebration Centerpiece'}
            className="w-full h-full object-cover"
          />
        </div>
        <div className="mt-2 text-xs font-bold text-amber-200 bg-white/10 px-3 py-1 rounded-full border border-white/20 inline-flex items-center gap-1">
          <Sparkles className="w-3.5 h-3.5 text-amber-400" />
          <span>{occasion.occasionName || 'Centerpiece'}</span>
        </div>
      </div>
    );
  }

  // 1. Birthday Cake
  if (graphicType === 'cake' || occasion.occasionType === 'birthday') {
    return <BirthdayCake />;
  }

  // 2. Grand Diwali / Sacred Diya
  if (graphicType === 'diya' || occasion.occasionType === 'diwali') {
    return (
      <div
        onClick={() => {
          setInteractiveActive(!interactiveActive);
          triggerCelebrationConfetti(['#f59e0b', '#fbbf24', '#f97316', '#7c3aed']);
        }}
        className="relative group cursor-pointer select-none py-2 flex flex-col items-center"
        title="Tap to ignite festival blessings!"
      >
        <svg viewBox="0 0 320 260" className="w-56 sm:w-64 h-auto drop-shadow-2xl transition-transform group-hover:scale-105">
          <defs>
            <linearGradient id="diyaBrass" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#fef08a" />
              <stop offset="40%" stopColor="#f59e0b" />
              <stop offset="100%" stopColor="#b45309" />
            </linearGradient>
            <linearGradient id="diyaFlame" x1="0%" y1="100%" x2="0%" y2="0%">
              <stop offset="0%" stopColor="#ea580c" />
              <stop offset="35%" stopColor="#f97316" />
              <stop offset="70%" stopColor="#fbbf24" />
              <stop offset="100%" stopColor="#ffffff" />
            </linearGradient>
            <filter id="diyaGlow" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="4" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
          </defs>

          {/* Rangoli Mandala Base */}
          <circle cx="160" cy="210" r="85" fill="none" stroke="#fbbf24" strokeWidth="2" strokeDasharray="4,4" opacity="0.6" />
          <circle cx="160" cy="210" r="70" fill="none" stroke="#f43f5e" strokeWidth="1.5" opacity="0.5" />

          {/* Floating Marigold Petals */}
          <circle cx="90" cy="215" r="7" fill="#f59e0b" />
          <circle cx="230" cy="215" r="7" fill="#f59e0b" />
          <circle cx="110" cy="235" r="6" fill="#ea580c" />
          <circle cx="210" cy="235" r="6" fill="#ea580c" />
          <circle cx="160" cy="245" r="6.5" fill="#f59e0b" />

          {/* Diya Clay / Brass Bowl */}
          <path
            d="M 60 170 C 70 230, 250 230, 260 170 C 240 185, 200 195, 160 195 C 120 195, 80 185, 60 170 Z"
            fill="url(#diyaBrass)"
          />
          <ellipse cx="160" cy="170" rx="100" ry="25" fill="#d97706" />
          <ellipse cx="160" cy="172" rx="90" ry="20" fill="#92400e" />

          {/* Oil Reservoir Surface */}
          <ellipse cx="160" cy="174" rx="75" ry="14" fill="#78350f" />

          {/* Cotton Wick */}
          <line x1="160" y1="165" x2="160" y2="140" stroke="#fde68a" strokeWidth="4" strokeLinecap="round" />

          {/* Flickering Flame */}
          {interactiveActive ? (
            <g className="animate-pulse" filter="url(#diyaGlow)">
              <path
                d="M 160 65 C 145 105, 138 125, 160 145 C 182 125, 175 105, 160 65 Z"
                fill="url(#diyaFlame)"
              />
              <circle cx="160" cy="125" r="9" fill="#fef08a" />
            </g>
          ) : (
            <path d="M 160 140 Q 155 120 162 105 Q 165 95 160 80" stroke="#cbd5e1" strokeWidth="2" fill="none" opacity="0.6" strokeDasharray="3,3" />
          )}
        </svg>

        <div className="bg-amber-500/20 text-amber-200 text-xs font-bold px-3 py-1 rounded-full border border-amber-400/40 inline-flex items-center gap-1.5 shadow-sm">
          <Sparkles className="w-3.5 h-3.5 text-amber-300" />
          <span>{interactiveActive ? 'Auspicious Diya Lit • Tap to Rebless' : 'Tap to Light the Sacred Diya'}</span>
        </div>
      </div>
    );
  }

  // 3. Royal Wedding Mandap / Varmala
  if (graphicType === 'mandap' || occasion.occasionType === 'wedding') {
    return (
      <div
        onClick={() => triggerCelebrationConfetti(['#be123c', '#e11d48', '#fbbf24', '#f43f5e'])}
        className="relative group cursor-pointer select-none py-2 flex flex-col items-center"
      >
        <svg viewBox="0 0 320 260" className="w-56 sm:w-64 h-auto drop-shadow-2xl transition-transform group-hover:scale-105">
          <defs>
            <linearGradient id="goldArch" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#fef08a" />
              <stop offset="50%" stopColor="#f59e0b" />
              <stop offset="100%" stopColor="#b45309" />
            </linearGradient>
            <linearGradient id="roseGarland" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#f43f5e" />
              <stop offset="50%" stopColor="#e11d48" />
              <stop offset="100%" stopColor="#be123c" />
            </linearGradient>
          </defs>

          {/* Pillars */}
          <rect x="50" y="80" width="16" height="150" rx="4" fill="url(#goldArch)" />
          <rect x="254" y="80" width="16" height="150" rx="4" fill="url(#goldArch)" />

          {/* Arch Top */}
          <path d="M 40 85 Q 160 25 280 85" stroke="url(#goldArch)" strokeWidth="12" fill="none" strokeLinecap="round" />
          <path d="M 50 100 Q 160 45 270 100" stroke="#f43f5e" strokeWidth="6" fill="none" strokeLinecap="round" />

          {/* Floral Garlands (Toran / Varmala) */}
          <path d="M 55 110 Q 110 145 160 115 Q 210 145 265 110" stroke="#fda4af" strokeWidth="4" fill="none" strokeDasharray="3,3" />

          {/* Central Auspicious Kalash */}
          <ellipse cx="160" cy="210" rx="36" ry="12" fill="#b45309" />
          <path d="M 140 185 C 130 215, 190 215, 180 185 Z" fill="url(#goldArch)" />
          <circle cx="160" cy="172" r="14" fill="#a16207" />
          {/* Mango Leaves */}
          <path d="M 160 172 Q 135 155 140 145 Q 155 160 160 172 Z" fill="#15803d" />
          <path d="M 160 172 Q 185 155 180 145 Q 165 160 160 172 Z" fill="#15803d" />
          <circle cx="160" cy="142" r="4" fill="#ef4444" />
        </svg>

        <div className="bg-rose-500/20 text-rose-200 text-xs font-bold px-3 py-1 rounded-full border border-rose-400/40 inline-flex items-center gap-1.5 shadow-sm">
          <Heart className="w-3.5 h-3.5 text-rose-400 fill-rose-400" />
          <span>Shubh Vivaah Mandap • Tap to Celebrate</span>
        </div>
      </div>
    );
  }

  // 4. Interlocking Rings (Anniversary & Engagement)
  if (graphicType === 'rings' || occasion.occasionType === 'anniversary' || occasion.occasionType === 'engagement') {
    return (
      <div
        onClick={() => triggerCelebrationConfetti(['#f43f5e', '#ec4899', '#fbbf24', '#fbcfe8'])}
        className="relative group cursor-pointer select-none py-2 flex flex-col items-center"
      >
        <svg viewBox="0 0 320 240" className="w-56 sm:w-64 h-auto drop-shadow-2xl transition-transform group-hover:scale-105">
          <defs>
            <linearGradient id="ringGold" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#fef08a" />
              <stop offset="50%" stopColor="#f59e0b" />
              <stop offset="100%" stopColor="#b45309" />
            </linearGradient>
            <linearGradient id="ringDiamond" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#ffffff" />
              <stop offset="60%" stopColor="#bae6fd" />
              <stop offset="100%" stopColor="#38bdf8" />
            </linearGradient>
          </defs>

          {/* Left Ring */}
          <ellipse cx="130" cy="130" rx="55" ry="55" fill="none" stroke="url(#ringGold)" strokeWidth="14" />
          {/* Right Ring */}
          <ellipse cx="190" cy="130" rx="55" ry="55" fill="none" stroke="url(#ringGold)" strokeWidth="14" />

          {/* Solitaire Diamond on Right Ring */}
          <polygon points="190,55 178,72 202,72" fill="url(#ringDiamond)" />
          <polygon points="190,55 202,72 196,75 190,55" fill="#e0f2fe" opacity="0.8" />
          <circle cx="190" cy="62" r="3" fill="#ffffff" className="animate-ping" />

          {/* Glowing Heart floating in center */}
          <path
            d="M 160 115 C 150 95, 120 100, 135 125 L 160 148 L 185 125 C 200 100, 170 95, 160 115 Z"
            fill="#f43f5e"
            className="animate-pulse"
          />
        </svg>

        <div className="bg-pink-500/20 text-pink-200 text-xs font-bold px-3 py-1 rounded-full border border-pink-400/40 inline-flex items-center gap-1.5 shadow-sm">
          <Heart className="w-3.5 h-3.5 text-pink-400 fill-pink-400" />
          <span>Years of Togetherness • Tap to Cheer</span>
        </div>
      </div>
    );
  }

  // 5. Retirement Honor Plaque
  if (graphicType === 'plaque' || occasion.occasionType === 'retirement' || occasion.occasionType === 'corporate') {
    return (
      <div
        onClick={() => triggerCelebrationConfetti(['#1d4ed8', '#f59e0b', '#fbbf24', '#ffffff'])}
        className="relative group cursor-pointer select-none py-2 flex flex-col items-center"
      >
        <svg viewBox="0 0 320 240" className="w-56 sm:w-64 h-auto drop-shadow-2xl transition-transform group-hover:scale-105">
          <defs>
            <linearGradient id="plaqueGold" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#fef08a" />
              <stop offset="50%" stopColor="#f59e0b" />
              <stop offset="100%" stopColor="#92400e" />
            </linearGradient>
            <linearGradient id="woodBase" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#1e293b" />
              <stop offset="100%" stopColor="#0f172a" />
            </linearGradient>
          </defs>

          {/* Outer Plaque Frame */}
          <rect x="50" y="30" width="220" height="180" rx="16" fill="url(#woodBase)" stroke="url(#plaqueGold)" strokeWidth="4" />
          <rect x="62" y="42" width="196" height="156" rx="10" fill="#090d16" stroke="rgba(245,158,11,0.3)" strokeWidth="1" />

          {/* Laurel Wreath */}
          <circle cx="160" cy="90" r="32" fill="none" stroke="url(#plaqueGold)" strokeWidth="3" strokeDasharray="6,3" />
          {/* Trophy Icon Center */}
          <path d="M 148 75 L 172 75 L 168 95 C 168 102, 152 102, 152 95 Z" fill="url(#plaqueGold)" />
          <rect x="157" y="98" width="6" height="12" fill="url(#plaqueGold)" />
          <rect x="145" y="110" width="30" height="5" rx="2" fill="url(#plaqueGold)" />

          {/* Honor Text in Plaque */}
          <text x="160" y="138" textAnchor="middle" fill="#fbbf24" fontWeight="bold" fontSize="13" fontFamily="Playfair Display, serif">
            DISTINGUISHED SERVICE
          </text>
          <text x="160" y="156" textAnchor="middle" fill="#94a3b8" fontSize="10" fontFamily="Outfit, sans-serif">
            HONORING A LEGENDARY CAREER
          </text>
          <text x="160" y="174" textAnchor="middle" fill="#f8fafc" fontWeight="semibold" fontSize="11" fontFamily="Outfit, sans-serif">
            ★ ★ ★ ★ ★
          </text>
        </svg>

        <div className="bg-blue-500/20 text-blue-200 text-xs font-bold px-3 py-1 rounded-full border border-blue-400/40 inline-flex items-center gap-1.5 shadow-sm">
          <Award className="w-3.5 h-3.5 text-amber-400" />
          <span>Lifetime Achievement Award</span>
        </div>
      </div>
    );
  }

  // 6. Baby Shower (Cradle / Stork)
  if (graphicType === 'baby' || occasion.occasionType === 'babyshower' || occasion.occasionType === 'naming') {
    return (
      <div
        onClick={() => triggerCelebrationConfetti(['#38bdf8', '#f472b6', '#a78bfa', '#fef08a'])}
        className="relative group cursor-pointer select-none py-2 flex flex-col items-center"
      >
        <svg viewBox="0 0 320 240" className="w-56 sm:w-64 h-auto drop-shadow-2xl transition-transform group-hover:scale-105">
          <defs>
            <linearGradient id="babyPink" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#fbcfe8" />
              <stop offset="100%" stopColor="#f472b6" />
            </linearGradient>
            <linearGradient id="babyBlue" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#bae6fd" />
              <stop offset="100%" stopColor="#38bdf8" />
            </linearGradient>
          </defs>

          {/* Bassinet Cradle */}
          <path d="M 90 140 C 90 200, 230 200, 230 140 Z" fill="url(#babyBlue)" />
          {/* Canopy Hood */}
          <path d="M 90 140 C 90 85, 175 85, 175 140 Z" fill="url(#babyPink)" opacity="0.9" />

          {/* Stand Legs */}
          <line x1="120" y1="185" x2="105" y2="215" stroke="#fde047" strokeWidth="5" strokeLinecap="round" />
          <line x1="200" y1="185" x2="215" y2="215" stroke="#fde047" strokeWidth="5" strokeLinecap="round" />

          {/* Floating Stars & Clouds */}
          <circle cx="160" cy="65" r="10" fill="#fef08a" className="animate-pulse" />
          <path d="M 230 85 Q 240 75 255 85 Q 265 95 250 100 Q 235 100 230 85 Z" fill="#ffffff" opacity="0.8" />
        </svg>

        <div className="bg-sky-500/20 text-sky-200 text-xs font-bold px-3 py-1 rounded-full border border-sky-400/40 inline-flex items-center gap-1.5 shadow-sm">
          <Sparkles className="w-3.5 h-3.5 text-pink-300" />
          <span>A Little One on the Way • Bless the Baby</span>
        </div>
      </div>
    );
  }

  // Fallback: Celebration Champagne Toasts
  return (
    <div
      onClick={() => triggerCelebrationConfetti(['#f59e0b', '#fbbf24', '#a855f7'])}
      className="relative group cursor-pointer select-none py-2 flex flex-col items-center"
    >
      <div className="w-48 h-48 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center border-2 border-white/20 shadow-2xl group-hover:scale-105 transition-transform">
        <span className="text-6xl animate-pulse">🎉</span>
      </div>
      <div className="mt-3 bg-white/10 text-amber-200 text-xs font-bold px-3 py-1 rounded-full border border-white/20 inline-flex items-center gap-1.5">
        <Wine className="w-3.5 h-3.5 text-amber-400" />
        <span>Grand Celebration Gala</span>
      </div>
    </div>
  );
}
