import React, { useState, useEffect, useRef } from 'react';
import { X, ShoppingBag, ArrowRight, Tag, Check, CheckCircle2, AlertCircle } from 'lucide-react';
import { useCartStore } from '../../stores/cartStore';
import { useSoundFx } from '../../hooks/useSoundFx';
import { FreeshipProgress } from './FreeshipProgress';
import { CartItem } from './CartItem';
import { CheckoutForm } from './CheckoutForm';
import { CouponAppliedModal } from './CouponAppliedModal';
import { animateDrawerOpen, animateDrawerClose, useBodyScrollLock } from '../../utils/animations';

export const CartDrawer: React.FC = () => {
  const {
    items,
    isOpen,
    closeCart,
    getSubtotal,
    getDiscountAmount,
    getShippingFee,
    getTotal,
    coupon,
    setCoupon,
  } = useCartStore();

  useBodyScrollLock(isOpen);

  const drawerRef = useRef<HTMLDivElement>(null);
  const backdropRef = useRef<HTMLDivElement>(null);

  const { playPop } = useSoundFx();
  const [couponInput, setCouponInput] = useState('');
  const [couponError, setCouponError] = useState('');
  const [showCouponModal, setShowCouponModal] = useState(false);
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [confirmedOrder, setConfirmedOrder] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen && drawerRef.current && backdropRef.current) {
      animateDrawerOpen(drawerRef.current, backdropRef.current);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleClose = () => {
    if (drawerRef.current && backdropRef.current) {
      animateDrawerClose(drawerRef.current, backdropRef.current, closeCart);
    } else {
      closeCart();
    }
  };

  const handleApplyCoupon = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!couponInput.trim()) return;
    setCouponError('');

    try {
      const res = await fetch('/api/coupons/validate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code: couponInput, cartTotal: getSubtotal() }),
      });
      const data = await res.json();
      if (!data.success) {
        setCouponError(data.message || 'Invalid coupon');
        return;
      }
      setCoupon(data.data);
      playPop();
      setShowCouponModal(true);
      setCouponInput('');
    } catch {
      setCouponError('Error validating coupon');
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      <div
        ref={backdropRef}
        onClick={handleClose}
        className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity"
      />

      <div className="fixed inset-y-0 right-0 flex max-w-full pl-0 sm:pl-10">
        <div
          ref={drawerRef}
          className="w-full sm:w-screen sm:max-w-md bg-white/95 backdrop-blur-2xl border-l-2 border-slate-900/10 flex flex-col shadow-2xl text-slate-900 safe-area-bottom"
        >
          <div className="flex items-center justify-between border-b border-slate-200 px-6 py-4">
            <div className="flex items-center gap-2">
              <ShoppingBag className="h-5 w-5 text-[#FF5722]" />
              <h3 className="font-display text-lg font-black text-slate-900 tracking-wide">
                YOUR BAG ({items.length})
              </h3>
            </div>
            <button
              onClick={handleClose}
              className="rounded-lg p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-900 transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            {confirmedOrder ? (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <div className="h-16 w-16 rounded-full bg-[#FF5722]/10 flex items-center justify-center text-[#FF5722] border border-[#FF5722]/30 mb-4 animate-bounce">
                  <CheckCircle2 className="h-8 w-8" />
                </div>
                <h4 className="font-display text-xl font-bold text-slate-900">
                  ORDER CONFIRMED!
                </h4>
                <p className="mt-1 text-xs text-slate-500">
                  Tracking Code: <strong className="text-[#FF5722] font-mono">{confirmedOrder}</strong>
                </p>
                <p className="mt-3 text-xs text-slate-500 max-w-xs">
                  We've received your order and stored it into MongoDB Atlas. You can track this in the Admin Portal.
                </p>
                <button
                  onClick={() => {
                    setConfirmedOrder(null);
                    setIsCheckingOut(false);
                    handleClose();
                  }}
                  className="mt-6 rounded-xl bg-slate-900 px-6 py-2.5 text-xs font-bold text-white hover:bg-[#FF5722] transition-colors shadow-sm"
                >
                  Continue Shopping
                </button>
              </div>
            ) : isCheckingOut ? (
              <CheckoutForm
                onBack={() => setIsCheckingOut(false)}
                onSuccess={(orderNumber) => setConfirmedOrder(orderNumber)}
              />
            ) : items.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-20 text-center">
                <ShoppingBag className="h-12 w-12 text-slate-300 mb-3" />
                <p className="font-display text-lg font-bold text-slate-700">Bag is empty</p>
                <p className="mt-1 text-xs text-slate-400">
                  Add cartoon streetwear drops or dress up your mascot!
                </p>
              </div>
            ) : (
              <>
                <FreeshipProgress subtotal={getSubtotal()} />

                <div className="space-y-3">
                  {items.map((item) => (
                    <CartItem key={`${item.productId}-${item.size}-${item.color}`} item={item} />
                  ))}
                </div>

                <div className="rounded-2xl bg-slate-50 p-3.5 border border-slate-200">
                  <form onSubmit={handleApplyCoupon} className="flex gap-2">
                    <div className="relative flex-1">
                      <Tag className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                      <input
                        type="text"
                        placeholder="Coupon (TOON10, FREESHIP)"
                        value={couponInput}
                        onChange={(e) => setCouponInput(e.target.value)}
                        className="w-full rounded-xl bg-white pl-9 pr-3 py-2 text-xs text-slate-900 border border-slate-200 uppercase placeholder:normal-case focus:border-[#FF5722] focus:outline-none"
                      />
                    </div>
                    <button
                      type="submit"
                      className="rounded-xl bg-slate-900 px-3.5 py-2 text-xs font-bold text-white hover:bg-[#FF5722] transition-colors shadow-sm"
                    >
                      Apply
                    </button>
                  </form>
                  {couponError && (
                    <p className="mt-1.5 text-xs text-rose-500 font-semibold">{couponError}</p>
                  )}
                  {coupon && (
                    <div className="mt-2 text-xs">
                      {coupon.minOrderValue && getSubtotal() < coupon.minOrderValue ? (
                        <div className="flex items-center justify-between text-amber-600 font-medium">
                          <span className="flex items-center gap-1">
                            <AlertCircle className="h-3.5 w-3.5 flex-shrink-0" />
                            <span>Add ${(coupon.minOrderValue - getSubtotal()).toFixed(2)} more to activate '{coupon.code}'</span>
                          </span>
                          <button
                            onClick={() => setCoupon(null)}
                            className="text-slate-500 hover:text-slate-900 underline ml-2"
                          >
                            Remove
                          </button>
                        </div>
                      ) : (
                        <div className="flex items-center justify-between text-[#0096C7] font-bold">
                          <span className="flex items-center gap-1">
                            <Check className="h-3.5 w-3.5" /> Coupon '{coupon.code}' activated!
                          </span>
                          <button
                            onClick={() => setCoupon(null)}
                            className="text-slate-500 hover:text-slate-900 underline"
                          >
                            Remove
                          </button>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </>
            )}
          </div>

          {!confirmedOrder && !isCheckingOut && items.length > 0 && (
            <div className="border-t border-slate-200 p-5 bg-slate-50 space-y-3">
              <div className="space-y-1.5 text-xs text-slate-500 font-medium">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="text-slate-900 font-bold">${getSubtotal().toFixed(2)}</span>
                </div>
                {coupon && (
                  <div className="flex justify-between text-[#0096C7] font-bold">
                    <span>Discount ({coupon.code})</span>
                    <span>-${getDiscountAmount().toFixed(2)}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span>Estimated Shipping</span>
                  <span className="text-slate-900 font-semibold">
                    {getShippingFee() === 0 ? (
                      <span className="text-[#0096C7] font-black">FREE</span>
                    ) : (
                      `$${getShippingFee().toFixed(2)}`
                    )}
                  </span>
                </div>
                <div className="flex justify-between pt-2 border-t border-slate-200 text-base font-bold text-slate-900">
                  <span>Total</span>
                  <span className="font-display text-[#FF5722] text-lg font-black">${getTotal().toFixed(2)}</span>
                </div>
              </div>

              <button
                onClick={() => setIsCheckingOut(true)}
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-slate-900 hover:bg-[#FF5722] py-3.5 text-sm font-bold text-white shadow-md transition-colors"
              >
                Checkout Now <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Celebratory Streetwear Coupon Confirmation Modal */}
      <CouponAppliedModal
        isOpen={showCouponModal}
        coupon={coupon}
        savingsAmount={getDiscountAmount()}
        subtotal={getSubtotal()}
        onClose={() => setShowCouponModal(false)}
        onProceedToCheckout={() => {
          setShowCouponModal(false);
          setIsCheckingOut(true);
        }}
      />
    </div>
  );
};
