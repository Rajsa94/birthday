import React, { useState } from 'react';
import { Sparkles, Wind } from 'lucide-react';
import confetti from 'canvas-confetti';

export default function BirthdayCake() {
  const [candlesLit, setCandlesLit] = useState(true);

  const handleToggleCandles = () => {
    if (candlesLit) {
      setCandlesLit(false);
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#f59e0b', '#ec4899', '#8b5cf6', '#10b981'],
      });
    } else {
      setCandlesLit(true);
    }
  };

  return (
    <div className="relative flex flex-col items-center justify-center select-none py-2">
      {/* Interactive Birthday Cake Illustration */}
      <div className="relative group cursor-pointer" onClick={handleToggleCandles} title="Click to blow or light candles!">
        <svg
          viewBox="0 0 320 280"
          className="w-56 sm:w-64 md:w-72 h-auto drop-shadow-2xl transition-transform duration-300 hover:scale-105"
        >
          <defs>
            <linearGradient id="cakePlateGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#f8fafc" />
              <stop offset="50%" stopColor="#e2e8f0" />
              <stop offset="100%" stopColor="#94a3b8" />
            </linearGradient>

            <linearGradient id="frostingTier1" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#f472b6" />
              <stop offset="50%" stopColor="#ec4899" />
              <stop offset="100%" stopColor="#db2777" />
            </linearGradient>

            <linearGradient id="frostingTier2" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#fbbf24" />
              <stop offset="50%" stopColor="#f59e0b" />
              <stop offset="100%" stopColor="#d97706" />
            </linearGradient>

            <linearGradient id="creamGrad" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#ffffff" />
              <stop offset="100%" stopColor="#fef3c7" />
            </linearGradient>

            <linearGradient id="flameGrad" x1="0%" y1="100%" x2="0%" y2="0%">
              <stop offset="0%" stopColor="#ef4444" />
              <stop offset="40%" stopColor="#f97316" />
              <stop offset="80%" stopColor="#facc15" />
              <stop offset="100%" stopColor="#ffffff" />
            </linearGradient>

            <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="3" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
          </defs>

          {/* Plate Stand */}
          <ellipse cx="160" cy="255" rx="130" ry="16" fill="url(#cakePlateGrad)" opacity="0.9" />
          <path d="M 60 252 Q 160 268 260 252" stroke="#cbd5e1" strokeWidth="3" fill="none" />

          {/* Bottom Tier (Tier 1) */}
          <rect x="70" y="170" width="180" height="75" rx="14" fill="url(#frostingTier1)" />
          {/* Bottom Tier Cream Frosting Drips */}
          <path
            d="M 70 185 
               Q 85 205 100 185 
               Q 115 210 130 185 
               Q 145 202 160 185 
               Q 175 212 190 185 
               Q 205 205 220 185 
               Q 235 210 250 185
               L 250 170 L 70 170 Z"
            fill="url(#creamGrad)"
          />
          {/* Bottom Tier Gold Pearls */}
          <circle cx="95" cy="225" r="4" fill="#fef08a" />
          <circle cx="125" cy="230" r="4.5" fill="#fef08a" />
          <circle cx="160" cy="226" r="5" fill="#fef08a" />
          <circle cx="195" cy="230" r="4.5" fill="#fef08a" />
          <circle cx="225" cy="225" r="4" fill="#fef08a" />

          {/* Top Tier (Tier 2) */}
          <rect x="100" y="105" width="120" height="65" rx="12" fill="url(#frostingTier2)" />
          {/* Top Tier Cream Frosting Drips */}
          <path
            d="M 100 118 
               Q 115 138 130 118 
               Q 145 142 160 118 
               Q 175 140 190 118 
               Q 205 138 220 118
               L 220 105 L 100 105 Z"
            fill="url(#creamGrad)"
          />
          {/* Festive number 25 on top tier */}
          <text
            x="160"
            y="152"
            textAnchor="middle"
            fill="#ffffff"
            fontWeight="bold"
            fontSize="22"
            fontFamily="Outfit, sans-serif"
            className="tracking-wider"
            opacity="0.95"
          >
            25
          </text>

          {/* 3 Candles */}
          {/* Left Candle */}
          <rect x="120" y="65" width="6" height="40" rx="3" fill="#38bdf8" />
          <line x1="123" y1="58" x2="123" y2="65" stroke="#475569" strokeWidth="2" />
          {/* Center Candle */}
          <rect x="157" y="55" width="6" height="50" rx="3" fill="#a855f7" />
          <line x1="160" y1="48" x2="160" y2="55" stroke="#475569" strokeWidth="2" />
          {/* Right Candle */}
          <rect x="194" y="65" width="6" height="40" rx="3" fill="#f43f5e" />
          <line x1="197" y1="58" x2="197" y2="65" stroke="#475569" strokeWidth="2" />

          {/* Candle Flames */}
          {candlesLit ? (
            <g className="animate-pulse" filter="url(#glow)">
              {/* Left Flame */}
              <path
                d="M 123 42 C 120 49, 117 52, 123 58 C 129 52, 126 49, 123 42 Z"
                fill="url(#flameGrad)"
              />
              <circle cx="123" cy="53" r="3" fill="#fef08a" />

              {/* Center Flame */}
              <path
                d="M 160 30 C 156 38, 153 42, 160 48 C 167 42, 164 38, 160 30 Z"
                fill="url(#flameGrad)"
              />
              <circle cx="160" cy="43" r="3.5" fill="#fef08a" />

              {/* Right Flame */}
              <path
                d="M 197 42 C 194 49, 191 52, 197 58 C 203 52, 200 49, 197 42 Z"
                fill="url(#flameGrad)"
              />
              <circle cx="197" cy="53" r="3" fill="#fef08a" />
            </g>
          ) : (
            /* Smoke trails when blown */
            <g opacity="0.6">
              <path d="M 123 55 Q 120 45 125 38 Q 128 32 124 25" stroke="#cbd5e1" strokeWidth="1.5" fill="none" strokeDasharray="2,2" />
              <path d="M 160 45 Q 157 35 162 28 Q 165 20 161 14" stroke="#cbd5e1" strokeWidth="1.5" fill="none" strokeDasharray="2,2" />
              <path d="M 197 55 Q 194 45 199 38 Q 202 32 198 25" stroke="#cbd5e1" strokeWidth="1.5" fill="none" strokeDasharray="2,2" />
            </g>
          )}

          {/* Sparkles around cake */}
          <circle cx="50" cy="140" r="2" fill="#fef08a" className="animate-ping" />
          <circle cx="270" cy="130" r="2.5" fill="#f472b6" className="animate-ping" style={{ animationDuration: '2s' }} />
          <circle cx="160" cy="15" r="2" fill="#fbbf24" className="animate-pulse" />
        </svg>

        {/* Wish interactive badge */}
        <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 bg-white/90 hover:bg-white text-purple-900 text-xs font-semibold px-3 py-1 rounded-full shadow-md border border-purple-200/50 flex items-center gap-1.5 transition-all">
          {candlesLit ? (
            <>
              <Wind className="w-3.5 h-3.5 text-pink-500" />
              <span>Tap cake to blow candles & make a wish!</span>
            </>
          ) : (
            <>
              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
              <span>Wish granted! Tap to re-light</span>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
