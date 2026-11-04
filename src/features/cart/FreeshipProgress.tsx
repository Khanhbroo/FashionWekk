import React from 'react';
import { Truck, CheckCircle2 } from 'lucide-react';

interface FreeshipProgressProps {
  subtotal: number;
  threshold?: number;
}

export const FreeshipProgress: React.FC<FreeshipProgressProps> = ({
  subtotal,
  threshold = 75,
}) => {
  const percentage = Math.min(100, Math.round((subtotal / threshold) * 100));
  const remaining = Math.max(0, threshold - subtotal);
  const isUnlocked = subtotal >= threshold;

  return (
    <div className="rounded-2xl bg-slate-50 p-3.5 border border-slate-200 shadow-xs">
      <div className="flex items-center justify-between text-xs font-semibold">
        <span className="flex items-center gap-1.5 text-slate-700">
          <Truck className={`h-4 w-4 ${isUnlocked ? 'text-[#0096C7]' : 'text-[#FF5722]'}`} />
          {isUnlocked ? (
            <span className="text-[#0096C7] font-black tracking-wide">FREE SHIPPING UNLOCKED!</span>
          ) : (
            <span>
              Add <strong className="text-slate-900">${remaining.toFixed(2)}</strong> for FREE Shipping
            </span>
          )}
        </span>
        <span className="font-mono text-slate-500 font-bold">{percentage}%</span>
      </div>

      <div className="mt-2.5 h-2 w-full overflow-hidden rounded-full bg-slate-200">
        <div
          className={`h-full transition-all duration-500 rounded-full ${
            isUnlocked
              ? 'bg-gradient-to-r from-[#FF5722] via-[#FF2E93] to-[#0096C7] shadow-sm'
              : 'bg-gradient-to-r from-[#FF5722] to-amber-400'
          }`}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
};
