import React from 'react';
import { Plus, Minus, Trash2 } from 'lucide-react';
import { CartItem as CartItemType } from '../../types';
import { useCartStore } from '../../stores/cartStore';

interface CartItemProps {
  item: CartItemType;
}

export const CartItem: React.FC<CartItemProps> = ({ item }) => {
  const { updateQuantity, removeItem } = useCartStore();

  return (
    <div className="flex gap-3.5 rounded-2xl bg-white p-3 border border-slate-200 shadow-sm transition-all hover:border-[#FF5722]/50">
      <img
        src={item.image}
        alt={item.title}
        draggable={false}
        className="h-20 w-20 flex-shrink-0 rounded-xl object-cover border border-slate-200 bg-slate-100 select-none pointer-events-none"
      />

      <div className="flex flex-1 flex-col justify-between">
        <div>
          <div className="flex items-start justify-between gap-2">
            <h4 className="text-sm font-bold text-slate-900 line-clamp-1">{item.title}</h4>
            <button
              onClick={() => removeItem(item.productId, item.size, item.color)}
              className="text-slate-400 hover:text-rose-500 p-0.5 transition-colors"
              title="Remove item"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
          <div className="mt-1 flex items-center gap-2 text-xs text-slate-500 font-mono">
            <span className="rounded bg-slate-100 px-1.5 py-0.5 border border-slate-200 text-slate-700">
              Size: {item.size}
            </span>
            <span className="rounded bg-slate-100 px-1.5 py-0.5 border border-slate-200 text-slate-700">
              {item.color}
            </span>
            {item.gsm && (
              <span className="text-amber-600 font-bold">{item.gsm} GSM</span>
            )}
          </div>
        </div>

        <div className="flex items-center justify-between pt-2">
          <span className="font-display text-sm font-black text-[#FF5722]">
            ${item.price.toFixed(2)}
          </span>

          <div className="flex items-center rounded-lg bg-slate-100 border border-slate-200">
            <button
              onClick={() =>
                updateQuantity(item.productId, item.size, item.color, item.quantity - 1)
              }
              className="px-2 py-1 text-slate-600 hover:text-slate-900"
            >
              <Minus className="h-3 w-3" />
            </button>
            <span className="px-2 text-xs font-bold text-slate-900 font-mono">
              {item.quantity}
            </span>
            <button
              onClick={() =>
                updateQuantity(item.productId, item.size, item.color, item.quantity + 1)
              }
              className="px-2 py-1 text-slate-600 hover:text-slate-900"
            >
              <Plus className="h-3 w-3" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
