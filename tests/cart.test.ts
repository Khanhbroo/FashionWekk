import { describe, it, expect } from 'vitest';

export interface CartItem {
  id: string;
  title: string;
  price: number;
  quantity: number;
  size: string;
  color: string;
}

export const calculateCartTotals = (
  items: CartItem[],
  couponDiscountPercent: number = 0,
  isFreeShippingCoupon: boolean = false
) => {
  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const discount = Math.round(((subtotal * couponDiscountPercent) / 100) * 100) / 100;
  const freeshipThreshold = 75;
  const eligibleForFreeShip = subtotal >= freeshipThreshold || isFreeShippingCoupon;
  const shippingFee = items.length === 0 ? 0 : eligibleForFreeShip ? 0 : 9.99;
  const total = Math.max(0, Math.round((subtotal - discount + shippingFee) * 100) / 100);

  return {
    subtotal,
    discount,
    shippingFee,
    total,
    eligibleForFreeShip,
    amountNeededForFreeship: Math.max(0, freeshipThreshold - subtotal),
  };
};

describe('cart calculations', () => {
  it('should calculate empty cart totals correctly', () => {
    const res = calculateCartTotals([]);
    expect(res.subtotal).toBe(0);
    expect(res.shippingFee).toBe(0);
    expect(res.total).toBe(0);
    expect(res.amountNeededForFreeship).toBe(75);
  });

  it('should charge shipping fee if below $75 threshold', () => {
    const items: CartItem[] = [
      { id: '1', title: 'Tee', price: 45, quantity: 1, size: 'L', color: 'Black' },
    ];
    const res = calculateCartTotals(items);
    expect(res.subtotal).toBe(45);
    expect(res.shippingFee).toBe(9.99);
    expect(res.total).toBe(54.99);
    expect(res.amountNeededForFreeship).toBe(30);
  });

  it('should grant free shipping if subtotal >= $75', () => {
    const items: CartItem[] = [
      { id: '1', title: 'Heavy Hoodie', price: 85, quantity: 1, size: 'L', color: 'Black' },
    ];
    const res = calculateCartTotals(items);
    expect(res.subtotal).toBe(85);
    expect(res.shippingFee).toBe(0);
    expect(res.total).toBe(85);
    expect(res.amountNeededForFreeship).toBe(0);
    expect(res.eligibleForFreeShip).toBe(true);
  });

  it('should apply discount coupon accurately', () => {
    const items: CartItem[] = [
      { id: '1', title: 'Heavy Hoodie', price: 100, quantity: 1, size: 'L', color: 'Black' },
    ];
    const res = calculateCartTotals(items, 15);
    expect(res.subtotal).toBe(100);
    expect(res.discount).toBe(15);
    expect(res.shippingFee).toBe(0);
    expect(res.total).toBe(85);
  });

  it('should respect free shipping coupon even when below threshold', () => {
    const items: CartItem[] = [
      { id: '1', title: 'Cap', price: 30, quantity: 1, size: 'One Size', color: 'Black' },
    ];
    const res = calculateCartTotals(items, 0, true);
    expect(res.shippingFee).toBe(0);
    expect(res.total).toBe(30);
  });
});
