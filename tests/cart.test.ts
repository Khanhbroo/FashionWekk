import './helpers/memoryStorage';
import { beforeEach, describe, expect, it } from 'vitest';
import { useCartStore } from '../src/stores/cartStore';
import type { CartItem, CouponData } from '../src/types';

const makeItem = (overrides: Partial<CartItem> = {}): Omit<CartItem, 'quantity'> & { quantity?: number } => ({
  productId: 'p1',
  title: 'Tee',
  price: 45,
  size: 'L',
  color: 'Black',
  image: '/tee.jpg',
  ...overrides,
});

const makeCoupon = (overrides: Partial<CouponData> = {}): CouponData => ({
  code: 'TEST',
  discountPercent: 0,
  discountAmount: 0,
  description: 'test coupon',
  ...overrides,
});

describe('cart store calculations', () => {
  beforeEach(() => {
    useCartStore.setState({ items: [], coupon: null, isOpen: false, lastAddedItem: null });
  });

  it('returns zero totals for an empty cart', () => {
    const cart = useCartStore.getState();
    expect(cart.getSubtotal()).toBe(0);
    expect(cart.getShippingFee()).toBe(0);
    expect(cart.getTotal()).toBe(0);
    expect(cart.getFreeshipRemaining()).toBe(75);
  });

  it('charges shipping below the 75 dollar threshold', () => {
    useCartStore.getState().addItem(makeItem({ price: 45 }));
    const cart = useCartStore.getState();
    expect(cart.getSubtotal()).toBe(45);
    expect(cart.getShippingFee()).toBe(9.99);
    expect(cart.getTotal()).toBe(54.99);
    expect(cart.getFreeshipRemaining()).toBe(30);
  });

  it('grants free shipping at or above the threshold', () => {
    useCartStore.getState().addItem(makeItem({ price: 85 }));
    const cart = useCartStore.getState();
    expect(cart.getShippingFee()).toBe(0);
    expect(cart.getTotal()).toBe(85);
    expect(cart.getFreeshipRemaining()).toBe(0);
  });

  it('treats exactly 75 dollars as eligible for free shipping and 74.99 as not', () => {
    useCartStore.getState().addItem(makeItem({ price: 75 }));
    expect(useCartStore.getState().getShippingFee()).toBe(0);

    useCartStore.setState({ items: [], coupon: null });
    useCartStore.getState().addItem(makeItem({ price: 74.99 }));
    expect(useCartStore.getState().getShippingFee()).toBe(9.99);
  });

  it('applies a percentage coupon', () => {
    useCartStore.getState().addItem(makeItem({ price: 100 }));
    useCartStore.getState().setCoupon(makeCoupon({ discountPercent: 15 }));
    const cart = useCartStore.getState();
    expect(cart.getDiscountAmount()).toBe(15);
    expect(cart.getTotal()).toBe(85);
  });

  it('ignores a coupon when the subtotal is below its minimum order value', () => {
    useCartStore.getState().addItem(makeItem({ price: 50 }));
    useCartStore.getState().setCoupon(makeCoupon({ discountPercent: 20, minOrderValue: 120 }));
    expect(useCartStore.getState().getDiscountAmount()).toBe(0);
  });

  it('caps a fixed discount at the subtotal', () => {
    useCartStore.getState().addItem(makeItem({ price: 20 }));
    useCartStore.getState().setCoupon(makeCoupon({ fixedDiscount: 25 }));
    expect(useCartStore.getState().getDiscountAmount()).toBe(20);
  });

  it('honours a free shipping coupon below the threshold when its minimum is met', () => {
    useCartStore.getState().addItem(makeItem({ price: 30 }));
    useCartStore.getState().setCoupon(makeCoupon({ isFreeShipping: true, minOrderValue: 0 }));
    const cart = useCartStore.getState();
    expect(cart.getShippingFee()).toBe(0);
    expect(cart.getTotal()).toBe(30);
  });

  it('does not honour a free shipping coupon when the minimum order value is not met', () => {
    useCartStore.getState().addItem(makeItem({ price: 30 }));
    useCartStore.getState().setCoupon(makeCoupon({ isFreeShipping: true, minOrderValue: 50 }));
    expect(useCartStore.getState().getShippingFee()).toBe(9.99);
  });
});

describe('cart store item management', () => {
  beforeEach(() => {
    useCartStore.setState({ items: [], coupon: null, isOpen: false, lastAddedItem: null });
  });

  it('merges identical product, size and color lines into one quantity', () => {
    useCartStore.getState().addItem(makeItem());
    useCartStore.getState().addItem(makeItem({ quantity: 2 }));
    const { items, getItemCount } = useCartStore.getState();
    expect(items).toHaveLength(1);
    expect(items[0].quantity).toBe(3);
    expect(getItemCount()).toBe(3);
  });

  it('keeps different sizes as separate lines', () => {
    useCartStore.getState().addItem(makeItem({ size: 'M' }));
    useCartStore.getState().addItem(makeItem({ size: 'L' }));
    expect(useCartStore.getState().items).toHaveLength(2);
  });

  it('removes a line when its quantity is updated to zero', () => {
    useCartStore.getState().addItem(makeItem());
    useCartStore.getState().updateQuantity('p1', 'L', 'Black', 0);
    expect(useCartStore.getState().items).toHaveLength(0);
  });

  it('clears items and coupon together', () => {
    useCartStore.getState().addItem(makeItem());
    useCartStore.getState().setCoupon(makeCoupon({ discountPercent: 10 }));
    useCartStore.getState().clearCart();
    const { items, coupon } = useCartStore.getState();
    expect(items).toHaveLength(0);
    expect(coupon).toBeNull();
  });
});
