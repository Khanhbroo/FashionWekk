import React, { useEffect, useRef } from 'react';
import { ShoppingBag, ArrowRight, X, Check } from 'lucide-react';
import { useCartStore } from '../../stores/cartStore';
import { gsap } from '../../utils/animations';

export const CartToast: React.FC = () => {
  const { lastAddedItem, clearLastAddedItem, openCart } = useCartStore();
  const toastRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!lastAddedItem || !toastRef.current) return;

    gsap.fromTo(
      toastRef.current,
      { y: -30, opacity: 0, scale: 0.9 },
      { y: 0, opacity: 1, scale: 1, duration: 0.4, ease: 'back.out(1.7)' }
    );

    const timer = setTimeout(() => {
      handleDismiss();
    }, 3800);

    return () => clearTimeout(timer);
  }, [lastAddedItem]);

  if (!lastAddedItem) return null;

  const handleDismiss = () => {
    if (toastRef.current) {
      gsap.to(toastRef.current, {
        y: -20,
        opacity: 0,
        scale: 0.95,
        duration: 0.25,
        ease: 'power2.in',
        onComplete: clearLastAddedItem,
      });
    } else {
      clearLastAddedItem();
    }
  };

  const handleViewBag = () => {
    handleDismiss();
    openCart();
  };

  return (
    <div
      ref={toastRef}
      className="fixed top-20 right-4 sm:right-8 z-50 flex items-center gap-3 rounded-2xl bg-white p-3.5 border-2 border-slate-900 shadow-[4px_4px_0px_#0F172A] text-slate-900 max-w-sm w-full"
    >
      <div className="relative h-12 w-12 flex-shrink-0 overflow-hidden rounded-xl border border-slate-200 bg-slate-100">
        <img
          src={lastAddedItem.image}
          alt={lastAddedItem.title}
          className="h-full w-full object-cover"
        />
        <div className="absolute -bottom-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-[#FF5722] text-white border-2 border-white">
          <Check className="h-3 w-3 stroke-[3]" />
        </div>
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-1.5">
          <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#FF5722]">
            Added to Bag
          </span>
          <span className="text-[10px] text-slate-400 font-mono">• {lastAddedItem.size}</span>
        </div>
        <p className="text-xs font-bold text-slate-900 truncate">
          {lastAddedItem.title}
        </p>
        <p className="font-mono text-xs font-black text-slate-900">
          ${lastAddedItem.price.toFixed(2)}
        </p>
      </div>

      <div className="flex items-center gap-1.5 flex-shrink-0">
        <button
          onClick={handleViewBag}
          className="flex items-center gap-1 rounded-xl bg-slate-900 hover:bg-[#FF5722] px-3 py-2 text-xs font-bold text-white transition-colors shadow-xs"
        >
          <span>Bag</span>
          <ArrowRight className="h-3.5 w-3.5" />
        </button>

        <button
          onClick={handleDismiss}
          className="rounded-lg p-1 text-slate-400 hover:text-slate-800 transition-colors"
          aria-label="Dismiss notification"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
};
