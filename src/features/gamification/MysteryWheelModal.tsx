import React, { useState, useEffect, useRef } from 'react';
import { X } from 'lucide-react';
import confetti from 'canvas-confetti';
import gsap from 'gsap';
import { useSoundFx } from '../../hooks/useSoundFx';
import { useCartStore } from '../../stores/cartStore';
import { animateModalOpen, animateModalClose, animateSquashAndStretch, useBodyScrollLock } from '../../utils/animations';

interface MysteryWheelModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const SECTORS = [
  { label: '10% OFF', code: 'TOON10', color: '#FF5722', text: '#FFFFFF', discount: 10 },
  { label: 'FREE SHIP', code: 'FREESHIP', color: '#0096C7', text: '#FFFFFF', isFreeship: true },
  { label: '15% DROP', code: 'LUCKYSPIN', color: '#7C3AED', text: '#FFFFFF', discount: 15 },
  { label: '20% OFF', code: 'CYBER20', color: '#FF2E93', text: '#FFFFFF', discount: 20 },
  { label: 'TRY AGAIN', code: '', color: '#E2E8F0', text: '#64748B' },
  { label: '30% VIP', code: 'NEOTOKYO30', color: '#F59E0B', text: '#000000', discount: 30 },
];

export const MysteryWheelModal: React.FC<MysteryWheelModalProps> = ({ isOpen, onClose }) => {
  useBodyScrollLock(isOpen);

  const [spinning, setSpinning] = useState(false);
  const [wonPrize, setWonPrize] = useState<(typeof SECTORS)[0] | null>(null);

  const modalRef = useRef<HTMLDivElement>(null);
  const backdropRef = useRef<HTMLDivElement>(null);
  const wheelRef = useRef<HTMLDivElement>(null);
  const currentRotationRef = useRef<number>(0);

  const { playWin, playTick } = useSoundFx();
  const { setCoupon } = useCartStore();

  useEffect(() => {
    if (isOpen && modalRef.current && backdropRef.current) {
      animateModalOpen(modalRef.current, backdropRef.current);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleClose = () => {
    if (modalRef.current && backdropRef.current) {
      animateModalClose(modalRef.current, backdropRef.current, onClose);
    } else {
      onClose();
    }
  };

  const handleSpin = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (spinning || !wheelRef.current) return;
    animateSquashAndStretch(e.currentTarget);
    setSpinning(true);
    setWonPrize(null);

    const winningIdx = Math.floor(Math.random() * (SECTORS.length - 1));
    const sectorAngle = 360 / SECTORS.length;
    const extraRotations = 5 * 360;
    const targetAngle = currentRotationRef.current + extraRotations + (SECTORS.length - 1 - winningIdx) * sectorAngle + sectorAngle / 2;
    currentRotationRef.current = targetAngle;

    const interval = setInterval(() => playTick(), 140);

    gsap.to(wheelRef.current, {
      rotation: targetAngle,
      duration: 4,
      ease: 'power4.out',
      onComplete: () => {
        clearInterval(interval);
        setSpinning(false);
        const prize = SECTORS[winningIdx];
        setWonPrize(prize);

        if (prize.code) {
          confetti({
            particleCount: 100,
            spread: 80,
            origin: { y: 0.5 },
            colors: ['#FF5722', '#FF2E93', '#0096C7', '#F59E0B'],
          });
          playWin();
          setCoupon({
            code: prize.code,
            discountPercent: prize.discount || 0,
            isFreeShipping: prize.isFreeship || false,
            discountAmount: 0,
            description: prize.label,
          });
        }
      },
    });
  };

  return (
    <div
      ref={backdropRef}
      onClick={handleClose}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm"
    >
      <div
        ref={modalRef}
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-sm rounded-3xl bg-white p-5 sm:p-6 border-2 border-slate-900/15 shadow-[8px_8px_0px_#0F172A] text-center text-slate-900 max-h-[92dvh] overflow-y-auto"
      >
        <button
          onClick={handleClose}
          className="absolute right-4 top-4 rounded-xl bg-slate-100 p-2 text-slate-600 hover:bg-slate-200 hover:text-slate-900 transition-colors"
        >
          <X className="h-5 w-5" />
        </button>

        <div className="flex items-center justify-center gap-2">
          <span className="rounded bg-[#FF5722]/10 px-2 py-0.5 text-[10px] font-mono uppercase tracking-widest text-[#FF5722] border border-[#FF5722]/25 font-bold">
            DROP REWARD
          </span>
          <h3 className="font-display text-xl font-black uppercase tracking-wider text-slate-900">
            MYSTERY WHEEL
          </h3>
        </div>
        <p className="mt-1 text-xs text-slate-500 font-medium">
          Spin the cartoon pop wheel to unlock exclusive toon drip discounts!
        </p>

        <div className="relative my-6 flex items-center justify-center">
          <div className="absolute top-0 z-20 -mt-2 h-0 w-0 border-x-8 border-x-transparent border-t-[16px] border-t-[#FF5722] drop-shadow-md" />

          <div
            ref={wheelRef}
            className="relative h-64 w-64 rounded-full border-4 border-slate-900 shadow-xl overflow-hidden will-change-transform"
          >
            <svg viewBox="0 0 100 100" className="h-full w-full">
              {SECTORS.map((sector, idx) => {
                const angle = 360 / SECTORS.length;
                const startAngle = (idx * angle * Math.PI) / 180;
                const endAngle = (((idx + 1) * angle) * Math.PI) / 180;
                const x1 = 50 + 50 * Math.cos(startAngle);
                const y1 = 50 + 50 * Math.sin(startAngle);
                const x2 = 50 + 50 * Math.cos(endAngle);
                const y2 = 50 + 50 * Math.sin(endAngle);

                const midAngle = ((idx + 0.5) * angle * Math.PI) / 180;
                const textX = 50 + 32 * Math.cos(midAngle);
                const textY = 50 + 32 * Math.sin(midAngle);

                return (
                  <g key={idx}>
                    <path
                      d={`M 50 50 L ${x1} ${y1} A 50 50 0 0 1 ${x2} ${y2} Z`}
                      fill={sector.color}
                    />
                    <text
                      x={textX}
                      y={textY}
                      fill={sector.text}
                      fontSize="5"
                      fontWeight="900"
                      fontFamily="Space Grotesk, sans-serif"
                      textAnchor="middle"
                      dominantBaseline="middle"
                      transform={`rotate(${idx * angle + angle / 2 + 90}, ${textX}, ${textY})`}
                    >
                      {sector.label}
                    </text>
                  </g>
                );
              })}
            </svg>
            <div className="absolute inset-0 m-auto h-12 w-12 rounded-full bg-slate-900 border-2 border-white flex items-center justify-center font-black text-xs text-white shadow-md">
              FW
            </div>
          </div>
        </div>

        {wonPrize && (
          <div className="mb-4 rounded-2xl bg-amber-50 p-3 border border-amber-300">
            <p className="text-xs text-amber-800 font-semibold">Congratulations! You unlocked:</p>
            <p className="font-display text-base font-black text-[#FF5722]">
              {wonPrize.label} (Code: {wonPrize.code})
            </p>
            <p className="text-xs text-amber-700">Coupon applied automatically to your bag!</p>
          </div>
        )}

        <button
          disabled={spinning}
          onClick={handleSpin}
          className="flex w-full items-center justify-center rounded-xl bg-slate-900 hover:bg-[#FF5722] py-3.5 text-sm font-black text-white shadow-md transition-colors disabled:opacity-50 cursor-pointer font-mono uppercase tracking-wider"
        >
          {spinning ? 'SPINNING POP MATRIX...' : 'SPIN THE CARTOON WHEEL'}
        </button>
      </div>
    </div>
  );
};
