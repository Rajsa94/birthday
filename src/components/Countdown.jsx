import React, { useState, useEffect } from 'react';
import { Clock } from 'lucide-react';

export default function Countdown({ targetDate }) {
  const [timeLeft, setTimeLeft] = useState(calculateTimeLeft());

  function calculateTimeLeft() {
    const target = new Date(targetDate).getTime();
    const now = new Date().getTime();
    const difference = target - now;

    if (difference <= 0) {
      return { days: 0, hours: 0, minutes: 0, seconds: 0, isPast: true };
    }

    return {
      days: Math.floor(difference / (1000 * 60 * 60 * 24)),
      hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
      minutes: Math.floor((difference / 1000 / 60) % 60),
      seconds: Math.floor((difference / 1000) % 60),
      isPast: false,
    };
  }

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    return () => clearInterval(timer);
  }, [targetDate]);

  const units = [
    { label: 'DAYS', value: timeLeft.days },
    { label: 'HOURS', value: timeLeft.hours },
    { label: 'MINUTES', value: timeLeft.minutes },
    { label: 'SECONDS', value: timeLeft.seconds },
  ];

  return (
    <div className="w-full max-w-xl mx-auto">
      <div className="flex items-center justify-center gap-2 mb-3 text-pink-200 text-sm font-semibold tracking-wider uppercase">
        <Clock className="w-4 h-4 animate-pulse text-gold-400" />
        <span>Countdown to the Big Celebration</span>
      </div>

      <div className="grid grid-cols-4 gap-2 sm:gap-4">
        {units.map((unit, index) => (
          <div
            key={unit.label}
            className="relative group bg-white/10 hover:bg-white/15 backdrop-blur-md rounded-2xl p-3 sm:p-4 text-center border border-white/20 shadow-lg shadow-purple-950/20 transition-all duration-300 transform hover:-translate-y-1"
          >
            <div className="absolute -top-1.5 left-1/2 -translate-x-1/2 w-4 h-1 bg-gold-400/80 rounded-full blur-[1px]"></div>
            <div className="text-2xl sm:text-4xl md:text-5xl font-extrabold text-white font-serif tracking-tight drop-shadow-md">
              {String(unit.value).padStart(2, '0')}
            </div>
            <div className="text-[10px] sm:text-xs font-semibold tracking-widest text-pink-200/90 mt-1 uppercase">
              {unit.label}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
