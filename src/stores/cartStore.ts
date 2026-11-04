import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { CartItem, CouponData } from '../types';

interface CartState {
  items: CartItem[];
  isOpen: boolean;
  coupon: CouponData | null;
  lastAddedItem: CartItem | null;
  addItem: (
    item: Omit<CartItem, 'quantity'> & { quantity?: number },
    openDrawer?: boolean
  ) => void;
  removeItem: (productId: string, size: string, color: string) => void;
  updateQuantity: (productId: string, size: string, color: string, quantity: number) => void;
  clearCart: () => void;
  clearLastAddedItem: () => void;
  openCart: () => void;
  closeCart: () => void;
  toggleCart: () => void;
  setCoupon: (coupon: CouponData | null) => void;
  getSubtotal: () => number;
  getDiscountAmount: () => number;
  getShippingFee: () => number;
  getTotal: () => number;
  getItemCount: () => number;
  getFreeshipRemaining: () => number;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      isOpen: false,
      coupon: null,
      lastAddedItem: null,

      addItem: (newItem, openDrawer = false) => {
        const { items } = get();
        const quantityToAdd = newItem.quantity || 1;
        const existingIndex = items.findIndex(
          (i) =>
            i.productId === newItem.productId &&
            i.size === newItem.size &&
            i.color === newItem.color
        );

        let addedItemRecord: CartItem;

        if (existingIndex > -1) {
          const updated = [...items];
          updated[existingIndex].quantity += quantityToAdd;
          addedItemRecord = updated[existingIndex];
          set({
            items: updated,
            lastAddedItem: addedItemRecord,
            isOpen: openDrawer ? true : get().isOpen,
          });
        } else {
          addedItemRecord = { ...newItem, quantity: quantityToAdd };
          set({
            items: [...items, addedItemRecord],
            lastAddedItem: addedItemRecord,
            isOpen: openDrawer ? true : get().isOpen,
          });
        }
      },

      clearLastAddedItem: () => set({ lastAddedItem: null }),

      removeItem: (productId, size, color) => {
        set({
          items: get().items.filter(
            (i) => !(i.productId === productId && i.size === size && i.color === color)
          ),
        });
      },

      updateQuantity: (productId, size, color, quantity) => {
        if (quantity <= 0) {
          get().removeItem(productId, size, color);
          return;
        }
        set({
          items: get().items.map((i) =>
            i.productId === productId && i.size === size && i.color === color
              ? { ...i, quantity }
              : i
          ),
        });
      },

      clearCart: () => set({ items: [], coupon: null }),

      openCart: () => set({ isOpen: true }),
      closeCart: () => set({ isOpen: false }),
      toggleCart: () => set({ isOpen: !get().isOpen }),

      setCoupon: (coupon) => set({ coupon }),

      getSubtotal: () => {
        return get().items.reduce((sum, item) => sum + item.price * item.quantity, 0);
      },

      getDiscountAmount: () => {
        const subtotal = get().getSubtotal();
        const coupon = get().coupon;
        if (!coupon) return 0;
        if (coupon.minOrderValue && subtotal < coupon.minOrderValue) {
          return 0;
        }
        if (coupon.discountPercent > 0) {
          return Math.round(((subtotal * coupon.discountPercent) / 100) * 100) / 100;
        }
        if (coupon.fixedDiscount) {
          return Math.min(coupon.fixedDiscount, subtotal);
        }
        return 0;
      },

      getShippingFee: () => {
        const items = get().items;
        if (items.length === 0) return 0;
        const subtotal = get().getSubtotal();
        const coupon = get().coupon;
        const isFreeshipValid =
          coupon?.isFreeShipping && (!coupon.minOrderValue || subtotal >= coupon.minOrderValue);
        if (isFreeshipValid || subtotal >= 75) return 0;
        return 9.99;
      },

      getTotal: () => {
        const subtotal = get().getSubtotal();
        const discount = get().getDiscountAmount();
        const shipping = get().getShippingFee();
        return Math.max(0, Math.round((subtotal - discount + shipping) * 100) / 100);
      },

      getItemCount: () => {
        return get().items.reduce((sum, item) => sum + item.quantity, 0);
      },

      getFreeshipRemaining: () => {
        const subtotal = get().getSubtotal();
        return Math.max(0, 75 - subtotal);
      },
    }),
    {
      name: 'fashionwekk-cart-storage',
      partialize: (state) => ({ items: state.items, coupon: state.coupon }),
    }
  )
);
