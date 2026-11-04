import React, { useState, useEffect } from 'react';

export const FlashSaleBanner: React.FC = () => {
  const [timeLeft, setTimeLeft] = useState({
    hours: 3,
    minutes: 41,
    seconds: 52,
  });

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev.seconds > 0) return { ...prev, seconds: prev.seconds - 1 };
        if (prev.minutes > 0) return { ...prev, minutes: 59, seconds: 59 };
        if (prev.hours > 0) return { hours: prev.hours - 1, minutes: 59, seconds: 59 };
        return { hours: 4, minutes: 0, seconds: 0 };
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const format = (n: number) => String(n).padStart(2, '0');

  const marqueeText = `COLLUSION BY KHANHBRO // CARTOON POP-ART ATELIER • 480 GSM HEAVYWEIGHT FRENCH TERRY • WORLDWIDE EXPRESS DISPATCH • LIMITED VAULT RELEASE • UP TO 30% OFF • ENDS IN ${format(timeLeft.hours)}H:${format(timeLeft.minutes)}M:${format(timeLeft.seconds)}S • `;

  return (
    <aside aria-label="Promotion Ticker" className="relative z-50 bg-[#D4FF00] text-black border-b border-black/15 overflow-hidden py-2 select-none">
      <div className="flex overflow-hidden">
        <div className="animate-marquee whitespace-nowrap font-mono text-[11px] sm:text-xs font-black tracking-widest uppercase flex items-center gap-6">
          <span>{marqueeText}</span>
          <span>{marqueeText}</span>
          <span>{marqueeText}</span>
          <span>{marqueeText}</span>
        </div>
      </div>
    </aside>
  );
};
