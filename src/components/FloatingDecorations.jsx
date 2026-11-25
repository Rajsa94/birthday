import React from 'react';

export default function FloatingDecorations() {
  const balloons = [
    { id: 1, color: 'from-pink-400 to-rose-500', size: 'w-14 h-18 sm:w-18 sm:h-24', left: 'left-[4%]', top: 'top-[8%]', delay: '0s', duration: '6s' },
    { id: 2, color: 'from-amber-300 to-amber-500', size: 'w-12 h-16 sm:w-16 sm:h-20', left: 'left-[14%]', top: 'top-[22%]', delay: '1.5s', duration: '7s' },
    { id: 3, color: 'from-purple-400 to-indigo-600', size: 'w-16 h-20 sm:w-20 sm:h-26', right: 'right-[5%]', top: 'top-[10%]', delay: '0.8s', duration: '6.5s' },
    { id: 4, color: 'from-rose-400 to-pink-600', size: 'w-12 h-16 sm:w-14 sm:h-18', right: 'right-[15%]', top: 'top-[26%]', delay: '2s', duration: '7.5s' },
    { id: 5, color: 'from-amber-400 to-yellow-600', size: 'w-10 h-14 sm:w-12 sm:h-16', left: 'left-[8%]', top: 'top-[55%]', delay: '2.5s', duration: '6.2s' },
    { id: 6, color: 'from-purple-500 to-pink-500', size: 'w-14 h-18 sm:w-16 sm:h-22', right: 'right-[8%]', top: 'top-[60%]', delay: '1.2s', duration: '8s' },
  ];

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
      {/* Background Soft Glow Orbs */}
      <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-purple-600/15 rounded-full blur-[120px]"></div>
      <div className="absolute top-[20%] right-[-10%] w-[550px] h-[550px] bg-pink-500/15 rounded-full blur-[140px]"></div>
      <div className="absolute bottom-[10%] left-[20%] w-[450px] h-[450px] bg-amber-400/10 rounded-full blur-[110px]"></div>

      {/* Floating Balloons */}
      {balloons.map((b) => (
        <div
          key={b.id}
          className={`absolute ${b.left || ''} ${b.right || ''} ${b.top} ${b.size} opacity-40 hover:opacity-60 transition-opacity animate-float`}
          style={{
            animationDelay: b.delay,
            animationDuration: b.duration,
          }}
        >
          {/* Balloon Oval */}
          <div
            className={`w-full h-full rounded-[50%_50%_50%_50%/40%_40%_60%_60%] bg-gradient-to-tr ${b.color} shadow-lg relative`}
          >
            {/* Balloon Gloss Highlight */}
            <div className="absolute top-2 left-2 w-2.5 h-4 bg-white/50 rounded-full rotate-[-30deg]"></div>
            {/* Balloon Knot */}
            <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2.5 h-1.5 bg-inherit rounded-sm"></div>
            {/* String */}
            <div className="absolute top-full left-1/2 w-[1px] h-12 bg-white/30 origin-top animate-sway"></div>
          </div>
        </div>
      ))}

      {/* Festive Confetti particles scattered across page */}
      <div className="absolute top-[12%] left-[28%] text-amber-300/40 text-xl animate-spin" style={{ animationDuration: '15s' }}>✦</div>
      <div className="absolute top-[18%] right-[32%] text-pink-300/40 text-lg animate-pulse">★</div>
      <div className="absolute top-[45%] left-[18%] text-purple-300/30 text-xl animate-bounce" style={{ animationDuration: '4s' }}>✨</div>
      <div className="absolute top-[70%] right-[22%] text-amber-200/40 text-base animate-pulse">✦</div>
      <div className="absolute top-[82%] left-[40%] text-rose-300/30 text-lg animate-spin" style={{ animationDuration: '12s' }}>★</div>
    </div>
  );
}
