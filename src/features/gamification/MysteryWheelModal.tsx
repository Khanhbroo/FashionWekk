import React, { useState, useEffect, useRef } from 'react';
import { X, Sparkles, Check, Copy } from 'lucide-react';
import confetti from 'canvas-confetti';
import gsap from 'gsap';
import { useSoundFx } from '../../hooks/useSoundFx';
import { useCartStore } from '../../stores/cartStore';
import {
  animateModalOpen,
  animateModalClose,
  animateSquashAndStretch,
  useBodyScrollLock,
} from '../../utils/animations';

interface MysteryWheelModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface WheelSector {
  label: string;
  code: string;
  color: string;
  text: string;
  subtext: string;
  discount?: number;
  isFreeship?: boolean;
}

const SECTORS: WheelSector[] = [
  {
    label: '10% DROP',
    code: 'TOON10',
    color: '#0A0A0C',
    text: '#D4FF00',
    subtext: 'Atelier Drops',
    discount: 10,
  },
  {
    label: 'FREE AIR',
    code: 'FREESHIP',
    color: '#D4FF00',
    text: '#0A0A0C',
    subtext: 'Global Air Freight',
    isFreeship: true,
  },
  {
    label: '15% GRAIL',
    code: 'LUCKYSPIN',
    color: '#FFFFFF',
    text: '#0A0A0C',
    subtext: 'Capsule Drops',
    discount: 15,
  },
  {
    label: '20% VAULT',
    code: 'CYBER20',
    color: '#0A0A0C',
    text: '#FFFFFF',
    subtext: 'Streetwear Grail',
    discount: 20,
  },
  {
    label: '30% VIP',
    code: 'NEOTOKYO30',
    color: '#FF5722',
    text: '#FFFFFF',
    subtext: 'Max Collector',
    discount: 30,
  },
  {
    label: 'TRY AGAIN',
    code: '',
    color: '#CBD5E1',
    text: '#475569',
    subtext: 'Atelier Reroll',
  },
];

export const MysteryWheelModal: React.FC<MysteryWheelModalProps> = ({
  isOpen,
  onClose,
}) => {
  useBodyScrollLock(isOpen);

  const [spinning, setSpinning] = useState(false);
  const [wonPrize, setWonPrize] = useState<WheelSector | null>(null);
  const [isCopied, setIsCopied] = useState(false);

  const modalRef = useRef<HTMLDivElement>(null);
  const backdropRef = useRef<HTMLDivElement>(null);
  const wheelRef = useRef<HTMLDivElement>(null);
  const currentRotationRef = useRef<number>(0);

  const { playWin, playTick, playPop } = useSoundFx();
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

  const handleCopyCode = (code: string) => {
    if (!code) return;
    navigator.clipboard.writeText(code);
    setIsCopied(true);
    playPop();
    setTimeout(() => setIsCopied(false), 2000);
  };

  const handleSpin = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (spinning || !wheelRef.current) return;
    animateSquashAndStretch(e.currentTarget);
    setSpinning(true);
    setWonPrize(null);
    setIsCopied(false);

    const winningIdx = Math.floor(Math.random() * (SECTORS.length - 1));
    const extraRotations = 5 * 360;
    const sectorAngle = 360 / SECTORS.length;
    const alignedOffset = ((SECTORS.length - (winningIdx % SECTORS.length)) % SECTORS.length) * sectorAngle;
    const jitter = (Math.random() - 0.5) * 14;
    const targetAngle = currentRotationRef.current + extraRotations + alignedOffset + jitter;
    currentRotationRef.current = targetAngle;

    const interval = setInterval(() => playTick(), 130);

    gsap.to(wheelRef.current, {
      rotation: targetAngle,
      duration: 4.2,
      ease: 'power4.out',
      onComplete: () => {
        clearInterval(interval);
        setSpinning(false);
        const prize = SECTORS[winningIdx];
        setWonPrize(prize);

        if (prize.code) {
          confetti({
            particleCount: 110,
            spread: 85,
            origin: { y: 0.55 },
            colors: ['#D4FF00', '#0A0A0C', '#FF5722', '#0096C7', '#FFFFFF'],
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
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-[#0A0A0C]/75 backdrop-blur-md select-none"
    >
      <div
        ref={modalRef}
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-sm sm:max-w-md bg-white border-2 sm:border-3 border-[#0A0A0C] shadow-[10px_10px_0px_#0A0A0C] text-center text-[#0A0A0C] max-h-[94dvh] overflow-y-auto overflow-x-hidden"
      >
        {/* Top Rim Accent Line */}
        <div className="h-1.5 w-full bg-[#D4FF00] border-b border-[#0A0A0C]" />

        {/* Close Button */}
        <button
          onClick={handleClose}
          aria-label="Close mystery wheel"
          className="absolute right-3.5 top-3.5 z-20 flex h-8 w-8 items-center justify-center bg-white hover:bg-[#D4FF00] text-black border border-[#0A0A0C] shadow-xs transition-colors cursor-pointer"
        >
          <X className="h-4 w-4" />
        </button>

        {/* Modal Header */}
        <div className="px-5 sm:px-6 pt-5 pb-1">
          <div className="inline-flex items-center gap-1.5 bg-[#0A0A0C] text-[#D4FF00] px-2.5 py-0.5 text-[10px] font-mono font-black uppercase tracking-widest border border-black/30 mb-2">
            <Sparkles className="h-3 w-3 fill-[#D4FF00]" />
            <span>FW ATELIER // VAULT DROP MATRIX</span>
          </div>

          <h3 className="font-display text-xl sm:text-2xl font-black italic uppercase tracking-tight text-[#0A0A0C] leading-none">
            LUCKY DROPS // MYSTERY WHEEL
          </h3>

          <p className="mt-1.5 text-xs text-slate-600 font-medium max-w-xs mx-auto">
            Spin the vault wheel to unlock limited grail codes, free express air freight, or up to 30% VIP vouchers.
          </p>
        </div>

        {/* Wheel Interaction Zone */}
        <div className="relative my-5 sm:my-6 flex items-center justify-center">
          {/* Top Pointer Needle at 12 o'clock position */}
          <div className="pointer-events-none absolute -top-3 z-30 flex flex-col items-center">
            <div className="relative flex items-center justify-center">
              <div className="h-6 w-6 rotate-45 rounded-sm bg-[#0A0A0C] border-2 border-[#D4FF00] shadow-[0_0_12px_rgba(212,255,0,0.8)] flex items-center justify-center">
                <div className="h-2 w-2 rounded-full bg-[#D4FF00] animate-ping" />
              </div>
            </div>
            <div className="-mt-1.5 h-0 w-0 border-x-8 border-x-transparent border-t-[14px] border-t-[#0A0A0C] drop-shadow-md" />
          </div>

          {/* Industrial Bezel Housing */}
          <div className="relative p-2 rounded-full bg-[#0A0A0C] border-2 border-[#0A0A0C] shadow-[8px_8px_0px_#0A0A0C]">
            {/* Circumference Studs */}
            <div className="absolute inset-0 pointer-events-none">
              <div className="absolute top-1 left-1/2 -translate-x-1/2 h-1.5 w-1.5 rounded-full bg-[#D4FF00]" />
              <div className="absolute bottom-1 left-1/2 -translate-x-1/2 h-1.5 w-1.5 rounded-full bg-[#D4FF00]" />
              <div className="absolute left-1 top-1/2 -translate-y-1/2 h-1.5 w-1.5 rounded-full bg-[#D4FF00]" />
              <div className="absolute right-1 top-1/2 -translate-y-1/2 h-1.5 w-1.5 rounded-full bg-[#D4FF00]" />
            </div>

            {/* Rotating Wheel Canvas */}
            <div
              ref={wheelRef}
              className="relative h-64 w-64 sm:h-72 sm:w-72 rounded-full border-2 border-[#0A0A0C] overflow-hidden will-change-transform bg-white"
            >
              <svg viewBox="0 0 100 100" className="h-full w-full">
                {SECTORS.map((sector, idx) => {
                  const angle = 360 / SECTORS.length;
                  const midAngle = -90 + idx * angle;
                  const startAngle = midAngle - angle / 2;
                  const endAngle = midAngle + angle / 2;

                  const startRad = (startAngle * Math.PI) / 180;
                  const endRad = (endAngle * Math.PI) / 180;
                  const midRad = (midAngle * Math.PI) / 180;

                  const x1 = 50 + 50 * Math.cos(startRad);
                  const y1 = 50 + 50 * Math.sin(startRad);
                  const x2 = 50 + 50 * Math.cos(endRad);
                  const y2 = 50 + 50 * Math.sin(endRad);

                  const textX = 50 + 33 * Math.cos(midRad);
                  const textY = 50 + 33 * Math.sin(midRad);

                  return (
                    <g key={idx}>
                      <path
                        d={`M 50 50 L ${x1} ${y1} A 50 50 0 0 1 ${x2} ${y2} Z`}
                        fill={sector.color}
                        stroke="#0A0A0C"
                        strokeWidth="0.8"
                      />
                      <text
                        x={textX}
                        y={textY}
                        fill={sector.text}
                        fontSize="4.4"
                        fontWeight="900"
                        fontFamily="JetBrains Mono, monospace"
                        textAnchor="middle"
                        dominantBaseline="middle"
                        transform={`rotate(${midAngle + 90}, ${textX}, ${textY})`}
                      >
                        {sector.label}
                      </text>
                    </g>
                  );
                })}
              </svg>

              {/* Center Metallic Brand Hub */}
              <div className="absolute inset-0 m-auto h-12 w-12 rounded-full bg-[#0A0A0C] border-2 border-[#D4FF00] flex items-center justify-center font-mono font-black text-xs text-[#D4FF00] shadow-[0_0_10px_rgba(0,0,0,0.5)] z-10">
                FW
              </div>
            </div>
          </div>
        </div>

        {/* Won Prize Notification Card */}
        {wonPrize && (
          <div className="mx-5 sm:mx-6 mb-4 p-3.5 bg-slate-50 border-2 border-[#0A0A0C] shadow-[4px_4px_0px_#0A0A0C] animate-in fade-in slide-in-from-bottom-2 duration-200 text-left">
            <div className="flex items-center justify-between text-[10px] font-mono font-bold uppercase tracking-wider text-slate-500 mb-1">
              <span>VAULT DROP STATUS</span>
              <span className="text-emerald-600 font-black">AUTO-APPLIED</span>
            </div>

            <div className="flex items-baseline justify-between">
              <span className="font-display text-lg font-black italic uppercase text-[#0A0A0C]">
                {wonPrize.label}
              </span>
              <span className="text-xs font-mono text-slate-500">
                {wonPrize.subtext}
              </span>
            </div>

            {wonPrize.code ? (
              <div className="mt-2 flex items-center justify-between bg-white px-2.5 py-1.5 border border-[#0A0A0C]">
                <span className="font-mono text-xs font-black tracking-widest text-[#0A0A0C]">
                  CODE: {wonPrize.code}
                </span>
                <button
                  type="button"
                  onClick={() => handleCopyCode(wonPrize.code)}
                  className="flex items-center gap-1 text-[10px] font-mono font-bold uppercase text-slate-700 hover:text-black cursor-pointer"
                >
                  {isCopied ? (
                    <>
                      <Check className="h-3 w-3 text-emerald-600" /> Copied
                    </>
                  ) : (
                    <>
                      <Copy className="h-3 w-3" /> Copy
                    </>
                  )}
                </button>
              </div>
            ) : (
              <p className="mt-1 text-xs text-slate-500 font-mono">
                No code granted on this roll. Spin again to unlock discounts!
              </p>
            )}
          </div>
        )}

        {/* Action Spin Button */}
        <div className="px-5 sm:px-6 pb-6">
          <button
            disabled={spinning}
            onClick={handleSpin}
            className={`w-full flex items-center justify-center gap-2 py-3.5 sm:py-4 text-xs sm:text-sm font-mono font-black tracking-widest uppercase transition-all shadow-md cursor-pointer ${
              spinning
                ? 'bg-slate-200 text-slate-500 border border-slate-300 pointer-events-none'
                : 'lime-gradient-btn'
            }`}
          >
            {spinning ? 'SPINNING VAULT MATRIX...' : wonPrize ? 'SPIN AGAIN (-20%)' : 'SPIN THE VAULT WHEEL (-20%)'}
          </button>
        </div>
      </div>
    </div>
  );
};
