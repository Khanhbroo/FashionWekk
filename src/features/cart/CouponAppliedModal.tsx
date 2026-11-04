import React, { useEffect, useRef } from 'react';
import { X, Check, ArrowRight, Tag, Clock, DollarSign, Truck } from 'lucide-react';
import confetti from 'canvas-confetti';
import { CouponData } from '../../types';
import { useBodyScrollLock, animateModalOpen, animateModalClose } from '../../utils/animations';

interface CouponAppliedModalProps {
  isOpen: boolean;
  coupon: CouponData | null;
  savingsAmount: number;
  subtotal: number;
  onClose: () => void;
  onProceedToCheckout?: () => void;
}

export const CouponAppliedModal: React.FC<CouponAppliedModalProps> = ({
  isOpen,
  coupon,
  savingsAmount,
  subtotal,
  onClose,
  onProceedToCheckout,
}) => {
  useBodyScrollLock(isOpen);
  const modalRef = useRef<HTMLDivElement>(null);
  const backdropRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen && modalRef.current && backdropRef.current) {
      animateModalOpen(modalRef.current, backdropRef.current);

      // Trigger high-fashion celebratory splatter confetti
      try {
        confetti({
          particleCount: 50,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#D4FF00', '#FF5722', '#0096C7', '#0F172A'],
          disableForReducedMotion: true,
        });
      } catch {
        // Safe fallback if canvas not available
      }
    }
  }, [isOpen]);

  if (!isOpen || !coupon) return null;

  const handleClose = () => {
    if (modalRef.current && backdropRef.current) {
      animateModalClose(modalRef.current, backdropRef.current, onClose);
    } else {
      onClose();
    }
  };

  // Format expiry date
  let expiryDisplay = 'Permanent Atelier Code';
  let daysLeftText = '';
  if (coupon.expiryDate) {
    const expiryDateObj = new Date(coupon.expiryDate);
    if (!isNaN(expiryDateObj.getTime())) {
      expiryDisplay = expiryDateObj.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      });
      const diffMs = expiryDateObj.getTime() - Date.now();
      const diffDays = Math.ceil(diffMs / (1000 * 60 * 60 * 24));
      if (diffDays > 0) {
        daysLeftText = `(${diffDays} day${diffDays === 1 ? '' : 's'} remaining)`;
      } else {
        daysLeftText = '(Expires today)';
      }
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto">
      <div
        ref={backdropRef}
        onClick={handleClose}
        className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity"
      />

      <div
        ref={modalRef}
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-md rounded-3xl bg-white p-6 sm:p-7 border-2 border-slate-900/15 shadow-[8px_8px_0px_#0F172A] text-slate-900 my-8 overflow-hidden z-10"
      >
        {/* Close Button */}
        <button
          onClick={handleClose}
          className="absolute right-4 top-4 rounded-xl bg-slate-100 p-2 text-slate-600 hover:bg-slate-200 hover:text-slate-900 transition-colors cursor-pointer"
          aria-label="Close modal"
        >
          <X className="h-4 w-4" />
        </button>

        {/* Top Atelier Badge */}
        <div className="inline-flex items-center gap-1.5 rounded-lg bg-slate-900 text-white px-3 py-1 text-[11px] font-mono font-bold tracking-widest uppercase mb-4">
          <span className="h-1.5 w-1.5 rounded-full bg-[#D4FF00]" />
          <span>COLLUSION ATELIER // COUPON ACTIVATED</span>
        </div>

        <h3 className="font-display text-2xl sm:text-3xl font-black uppercase tracking-tight text-slate-900 leading-none">
          DISCOUNT UNLOCKED
        </h3>
        <p className="mt-1.5 text-xs text-slate-600 font-medium">
          Your promotional voucher was verified against the FashionWekk MongoDB vault and successfully applied to your bag.
        </p>

        {/* Highlight Card */}
        <div className="mt-5 rounded-2xl bg-slate-900 text-white p-4 sm:p-5 border-2 border-slate-900 shadow-[4px_4px_0px_#D4FF00]">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <span className="font-mono text-xs text-slate-400 font-bold uppercase tracking-wider">
              APPLIED PROMO CODE
            </span>
            <span className="rounded-md bg-[#D4FF00] px-2.5 py-0.5 text-xs font-mono font-black text-black">
              {coupon.code}
            </span>
          </div>

          <div className="pt-3 flex items-baseline justify-between">
            <div>
              <span className="text-[10px] font-mono uppercase text-slate-400 block font-bold">
                ESTIMATED SAVINGS
              </span>
              <span className="font-display text-2xl sm:text-3xl font-black text-[#D4FF00]">
                {coupon.isFreeShipping && savingsAmount === 0
                  ? 'FREE SHIPPING'
                  : `$${savingsAmount.toFixed(2)}`}
              </span>
            </div>
            <div className="text-right">
              <span className="text-[10px] font-mono uppercase text-slate-400 block font-bold">
                DISCOUNT TYPE
              </span>
              <span className="font-mono text-xs font-bold text-white">
                {coupon.discountPercent > 0
                  ? `${coupon.discountPercent}% OFF ORDER`
                  : coupon.fixedDiscount && coupon.fixedDiscount > 0
                  ? `$${coupon.fixedDiscount} FLAT DISCOUNT`
                  : coupon.isFreeShipping
                  ? 'WORLDWIDE ZERO FREIGHT'
                  : 'CUSTOM PROMO'}
              </span>
            </div>
          </div>
        </div>

        {/* Details Grid */}
        <div className="mt-4 grid grid-cols-2 gap-2 text-xs">
          <div className="rounded-xl bg-slate-50 p-3 border border-slate-200">
            <div className="flex items-center gap-1.5 text-slate-500 font-mono text-[10px] font-bold uppercase">
              <Clock className="h-3 w-3 text-slate-400" />
              <span>VALID UNTIL</span>
            </div>
            <p className="mt-1 font-mono font-bold text-slate-900 text-[11px]">
              {expiryDisplay}
            </p>
            {daysLeftText && (
              <span className="text-[10px] font-mono text-emerald-600 font-bold block">
                {daysLeftText}
              </span>
            )}
          </div>

          <div className="rounded-xl bg-slate-50 p-3 border border-slate-200">
            <div className="flex items-center gap-1.5 text-slate-500 font-mono text-[10px] font-bold uppercase">
              <Tag className="h-3 w-3 text-slate-400" />
              <span>MINIMUM SPEND</span>
            </div>
            <p className="mt-1 font-mono font-bold text-slate-900 text-[11px]">
              {coupon.minOrderValue && coupon.minOrderValue > 0
                ? `$${coupon.minOrderValue.toFixed(2)}`
                : 'No Minimum'}
            </p>
            <span className="text-[10px] font-mono text-slate-500 block">
              Cart: ${subtotal.toFixed(2)}
            </span>
          </div>
        </div>

        {/* Description Note if available */}
        {coupon.description && (
          <div className="mt-3 rounded-xl bg-amber-50/70 p-2.5 border border-amber-200/60 text-[11px] text-amber-900 font-medium">
            <span className="font-bold uppercase font-mono mr-1">NOTE:</span>
            {coupon.description}
          </div>
        )}

        {/* Action Buttons */}
        <div className="mt-5 flex flex-col sm:flex-row items-center gap-2.5">
          {onProceedToCheckout ? (
            <button
              onClick={() => {
                handleClose();
                onProceedToCheckout();
              }}
              className="w-full flex items-center justify-center gap-2 rounded-xl bg-slate-900 hover:bg-[#FF5722] py-3 text-xs font-black text-white shadow-md transition-all cursor-pointer font-mono uppercase"
            >
              <span>PROCEED TO CHECKOUT</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </button>
          ) : null}

          <button
            onClick={handleClose}
            className="w-full flex items-center justify-center rounded-xl bg-slate-100 hover:bg-slate-200 py-3 text-xs font-bold text-slate-800 border border-slate-200 transition-colors cursor-pointer font-mono uppercase"
          >
            CONTINUE SHOPPING
          </button>
        </div>
      </div>
    </div>
  );
};
