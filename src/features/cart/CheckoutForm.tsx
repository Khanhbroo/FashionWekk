import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import { useCartStore } from '../../stores/cartStore';
import { useSoundFx } from '../../hooks/useSoundFx';
import { CheckCircle2, ArrowLeft } from 'lucide-react';

interface CheckoutFormProps {
  onBack: () => void;
  onSuccess: (orderNumber: string) => void;
}

export const CheckoutForm: React.FC<CheckoutFormProps> = ({ onBack, onSuccess }) => {
  const { items, getSubtotal, getDiscountAmount, getShippingFee, getTotal, coupon, clearCart } =
    useCartStore();
  const { playWin } = useSoundFx();

  const [formData, setFormData] = useState({
    name: 'Doan Quoc Khanh',
    email: 'khanhbroo@gmail.com',
    phone: '+84 987 654 321',
    address: '77 Nguyen Hue Boulevard, Ben Nghe, District 1, HCMC',
    paymentMethod: 'cod',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const payload = {
        customerName: formData.name,
        customerEmail: formData.email,
        customerPhone: formData.phone,
        shippingAddress: formData.address,
        items,
        subtotal: getSubtotal(),
        discountAmount: getDiscountAmount(),
        shippingFee: getShippingFee(),
        totalAmount: getTotal(),
        couponApplied: coupon?.code || '',
        paymentMethod: formData.paymentMethod,
      };

      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!data.success) {
        throw new Error(data.message || 'Failed to place order');
      }

      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#CCFF00', '#A78BFA', '#38BDF8', '#FFFFFF'],
      });

      playWin();
      clearCart();
      onSuccess(data.data.orderNumber);
    } catch (err: any) {
      setError(err.message || 'Error creating order');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="flex items-center justify-between pb-2">
        <button
          type="button"
          onClick={onBack}
          className="flex items-center gap-1.5 text-xs text-slate-500 hover:text-slate-900 font-semibold"
        >
          <ArrowLeft className="h-4 w-4" /> Back to Cart
        </button>
        <span className="text-xs font-black uppercase text-[#FF5722]">
          Total: ${getTotal().toFixed(2)}
        </span>
      </div>

      {error && (
        <div className="rounded-xl bg-rose-50 p-2.5 text-xs text-rose-600 border border-rose-200 font-semibold">
          {error}
        </div>
      )}

      <div>
        <label className="text-xs font-bold text-slate-700">Full Name *</label>
        <input
          type="text"
          required
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          className="mt-1 w-full rounded-xl bg-white px-3 py-2 text-sm text-slate-900 border border-slate-200 shadow-sm focus:border-[#FF5722] focus:outline-none"
        />
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="text-xs font-bold text-slate-700">Email *</label>
          <input
            type="email"
            required
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            className="mt-1 w-full rounded-xl bg-white px-3 py-2 text-sm text-slate-900 border border-slate-200 shadow-sm focus:border-[#FF5722] focus:outline-none"
          />
        </div>
        <div>
          <label className="text-xs font-bold text-slate-700">Phone</label>
          <input
            type="tel"
            value={formData.phone}
            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
            className="mt-1 w-full rounded-xl bg-white px-3 py-2 text-sm text-slate-900 border border-slate-200 shadow-sm focus:border-[#FF5722] focus:outline-none"
          />
        </div>
      </div>

      <div>
        <label className="text-xs font-bold text-slate-700">Delivery Address *</label>
        <textarea
          rows={2}
          required
          value={formData.address}
          onChange={(e) => setFormData({ ...formData, address: e.target.value })}
          className="mt-1 w-full rounded-xl bg-white px-3 py-2 text-sm text-slate-900 border border-slate-200 shadow-sm focus:border-[#FF5722] focus:outline-none"
        />
      </div>

      <div>
        <label className="text-xs font-bold text-slate-700">Payment Option</label>
        <div className="mt-1.5 grid grid-cols-3 gap-2">
          {[
            { id: 'cod', label: 'Cash (COD)' },
            { id: 'credit_card', label: 'Credit Card' },
            { id: 'crypto', label: 'Crypto/SOL' },
          ].map((m) => (
            <button
              key={m.id}
              type="button"
              onClick={() => setFormData({ ...formData, paymentMethod: m.id })}
              className={`rounded-xl py-2 text-xs font-semibold border transition-all ${
                formData.paymentMethod === m.id
                  ? 'border-[#FF5722] bg-[#FF5722]/10 text-[#FF5722] font-bold shadow-xs'
                  : 'border-slate-200 bg-white text-slate-600 hover:text-slate-900 shadow-xs'
              }`}
            >
              {m.label}
            </button>
          ))}
        </div>
      </div>

      <button
        type="submit"
        disabled={loading}
        className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl bg-slate-900 hover:bg-[#FF5722] py-3 text-sm font-bold text-white shadow-md hover:opacity-95 disabled:opacity-50 transition-all"
      >
        <CheckCircle2 className="h-4 w-4" />
        {loading ? 'Processing Order...' : `Confirm & Place Order ($${getTotal().toFixed(2)})`}
      </button>
    </form>
  );
};
