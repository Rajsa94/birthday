import React from 'react';

export default function DynamicDecorations({ type = 'balloons', theme = {} }) {
  const primaryColor = theme.colors?.primary || '#ec4899';
  const secondaryColor = theme.colors?.secondary || '#8b5cf6';
  const accentColor = theme.colors?.accent || '#f59e0b';

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
      {/* Background Soft Glow Orbs */}
      <div
        className="absolute top-[-10%] left-[-10%] w-[550px] h-[550px] rounded-full blur-[140px] opacity-25"
        style={{ backgroundColor: secondaryColor }}
      ></div>
      <div
        className="absolute top-[25%] right-[-10%] w-[600px] h-[600px] rounded-full blur-[160px] opacity-20"
        style={{ backgroundColor: primaryColor }}
      ></div>
      <div
        className="absolute bottom-[10%] left-[20%] w-[500px] h-[500px] rounded-full blur-[130px] opacity-20"
        style={{ backgroundColor: accentColor }}
      ></div>

      {/* 1. BALLOONS (Birthday, Farewell, Celebrations) */}
      {type === 'balloons' && (
        <>
          <div className="absolute left-[4%] top-[10%] w-14 h-20 sm:w-16 sm:h-24 opacity-40 animate-float">
            <div className="w-full h-full rounded-[50%_50%_50%_50%/40%_40%_60%_60%] bg-gradient-to-tr from-pink-500 to-rose-400 shadow-lg relative">
              <div className="absolute top-2 left-2 w-2.5 h-4 bg-white/50 rounded-full rotate-[-30deg]"></div>
              <div className="absolute top-full left-1/2 w-[1px] h-12 bg-white/30 animate-sway"></div>
            </div>
          </div>
          <div className="absolute right-[6%] top-[12%] w-16 h-22 sm:w-20 sm:h-28 opacity-40 animate-float" style={{ animationDelay: '1s' }}>
            <div className="w-full h-full rounded-[50%_50%_50%_50%/40%_40%_60%_60%] bg-gradient-to-tr from-purple-500 to-indigo-500 shadow-lg relative">
              <div className="absolute top-2 left-2 w-2.5 h-4 bg-white/50 rounded-full rotate-[-30deg]"></div>
              <div className="absolute top-full left-1/2 w-[1px] h-14 bg-white/30 animate-sway"></div>
            </div>
          </div>
          <div className="absolute left-[8%] top-[55%] w-12 h-16 opacity-35 animate-float" style={{ animationDelay: '2.5s' }}>
            <div className="w-full h-full rounded-[50%_50%_50%_50%/40%_40%_60%_60%] bg-gradient-to-tr from-amber-400 to-yellow-500 shadow-lg relative">
              <div className="absolute top-full left-1/2 w-[1px] h-10 bg-white/30 animate-sway"></div>
            </div>
          </div>
        </>
      )}

      {/* 2. DIYAS & LAMPS (Diwali, Housewarming) */}
      {type === 'diyas' && (
        <>
          <div className="absolute left-[6%] top-[14%] opacity-60 animate-pulse" style={{ animationDuration: '3s' }}>
            <span className="text-3xl filter drop-shadow-[0_0_12px_rgba(245,158,11,0.8)]">🪔</span>
          </div>
          <div className="absolute right-[8%] top-[18%] opacity-60 animate-pulse" style={{ animationDuration: '4s', animationDelay: '1s' }}>
            <span className="text-4xl filter drop-shadow-[0_0_15px_rgba(251,191,36,0.9)]">🪔</span>
          </div>
          <div className="absolute left-[12%] top-[60%] opacity-50 animate-pulse" style={{ animationDuration: '3.5s', animationDelay: '2s' }}>
            <span className="text-2xl filter drop-shadow-[0_0_10px_rgba(245,158,11,0.7)]">🪔</span>
          </div>
          <div className="absolute right-[10%] top-[65%] opacity-50 animate-pulse" style={{ animationDuration: '2.8s' }}>
            <span className="text-3xl filter drop-shadow-[0_0_12px_rgba(251,191,36,0.8)]">🪔</span>
          </div>
        </>
      )}

      {/* 3. ROSE PETALS (Wedding, Anniversary, Engagement) */}
      {type === 'petals' && (
        <>
          <div className="absolute left-[5%] top-[12%] text-2xl opacity-40 animate-float">🌸</div>
          <div className="absolute right-[7%] top-[15%] text-3xl opacity-40 animate-float" style={{ animationDelay: '1.5s' }}>🌹</div>
          <div className="absolute left-[14%] top-[40%] text-xl opacity-35 animate-float" style={{ animationDelay: '2.5s' }}>🌺</div>
          <div className="absolute right-[12%] top-[55%] text-2xl opacity-40 animate-float" style={{ animationDelay: '3s' }}>🌸</div>
          <div className="absolute left-[8%] top-[75%] text-3xl opacity-35 animate-float" style={{ animationDelay: '1.2s' }}>🌹</div>
        </>
      )}

      {/* 4. CLOUDS & STARS (Baby Shower, Naming) */}
      {type === 'clouds' && (
        <>
          <div className="absolute left-[5%] top-[12%] text-4xl opacity-40 animate-float">☁️</div>
          <div className="absolute right-[8%] top-[16%] text-3xl opacity-40 animate-float" style={{ animationDelay: '2s' }}>⭐</div>
          <div className="absolute left-[10%] top-[45%] text-2xl opacity-35 animate-pulse">✨</div>
          <div className="absolute right-[12%] top-[60%] text-4xl opacity-40 animate-float" style={{ animationDelay: '1s' }}>☁️</div>
          <div className="absolute left-[6%] top-[70%] text-3xl opacity-35 animate-float" style={{ animationDelay: '3s' }}>🎈</div>
        </>
      )}

      {/* 5. GULAL / COLOR SPLASHES (Holi) */}
      {type === 'colors' && (
        <>
          <div className="absolute left-[4%] top-[14%] w-16 h-16 rounded-full bg-gradient-to-r from-pink-500 to-rose-400 blur-lg opacity-40 animate-pulse"></div>
          <div className="absolute right-[6%] top-[20%] w-20 h-20 rounded-full bg-gradient-to-r from-cyan-400 to-blue-500 blur-lg opacity-35 animate-pulse" style={{ animationDelay: '1.5s' }}></div>
          <div className="absolute left-[12%] top-[60%] w-14 h-14 rounded-full bg-gradient-to-r from-amber-400 to-yellow-300 blur-lg opacity-40 animate-pulse" style={{ animationDelay: '2s' }}></div>
          <div className="absolute right-[10%] top-[70%] w-16 h-16 rounded-full bg-gradient-to-r from-emerald-400 to-teal-400 blur-lg opacity-35 animate-pulse"></div>
        </>
      )}

      {/* 6. SNOW & STARS (Christmas, New Year) */}
      {type === 'snow' && (
        <>
          <div className="absolute left-[6%] top-[10%] text-2xl text-white/40 animate-bounce" style={{ animationDuration: '5s' }}>❄️</div>
          <div className="absolute right-[8%] top-[15%] text-3xl text-white/40 animate-bounce" style={{ animationDuration: '6s', animationDelay: '1s' }}>❄️</div>
          <div className="absolute left-[15%] top-[45%] text-xl text-amber-300/40 animate-pulse">✨</div>
          <div className="absolute right-[12%] top-[65%] text-2xl text-white/40 animate-bounce" style={{ animationDuration: '5.5s' }}>❄️</div>
        </>
      )}

      {/* 7. LAURELS & STARS (Retirement, Corporate, Graduation) */}
      {type === 'laurels' && (
        <>
          <div className="absolute left-[6%] top-[12%] text-3xl text-amber-400/40 animate-pulse">🏆</div>
          <div className="absolute right-[8%] top-[16%] text-2xl text-blue-300/40 animate-float">✦</div>
          <div className="absolute left-[10%] top-[55%] text-2xl text-amber-300/40 animate-float" style={{ animationDelay: '2s' }}>★</div>
          <div className="absolute right-[12%] top-[65%] text-3xl text-amber-400/40 animate-pulse">🎖️</div>
        </>
      )}

      {/* Twinkling ambient stars across all themes */}
      <div className="absolute top-[15%] left-[25%] text-amber-300/30 text-lg animate-spin" style={{ animationDuration: '20s' }}>✦</div>
      <div className="absolute top-[22%] right-[30%] text-pink-300/30 text-base animate-pulse">★</div>
      <div className="absolute top-[48%] left-[16%] text-purple-300/25 text-lg animate-bounce" style={{ animationDuration: '5s' }}>✨</div>
      <div className="absolute top-[75%] right-[20%] text-amber-200/30 text-sm animate-pulse">✦</div>
    </div>
  );
}
