import { describe, it, expect } from 'vitest';

export interface CouponRule {
  code: string;
  discountPercent: number;
  fixedDiscount?: number;
  isFreeShipping?: boolean;
  minOrderValue: number;
  expiryDate: string; // ISO date
  usageLimit: number; // 0 = unlimited
  timesUsed: number;
  isActive: boolean;
}

export interface CouponValidationResult {
  valid: boolean;
  message?: string;
  discountAmount: number;
  isFreeShipping: boolean;
}

export const validateCouponRules = (
  coupon: CouponRule,
  cartSubtotal: number,
  now: Date = new Date()
): CouponValidationResult => {
  if (!coupon.isActive) {
    return {
      valid: false,
      message: `Coupon '${coupon.code}' is currently deactivated`,
      discountAmount: 0,
      isFreeShipping: false,
    };
  }

  const expiry = new Date(coupon.expiryDate);
  if (expiry < now) {
    return {
      valid: false,
      message: `Coupon '${coupon.code}' has expired`,
      discountAmount: 0,
      isFreeShipping: false,
    };
  }

  if (coupon.usageLimit > 0 && coupon.timesUsed >= coupon.usageLimit) {
    return {
      valid: false,
      message: `Coupon '${coupon.code}' has reached its maximum redemption limit`,
      discountAmount: 0,
      isFreeShipping: false,
    };
  }

  if (cartSubtotal < coupon.minOrderValue) {
    return {
      valid: false,
      message: `Order must be at least $${coupon.minOrderValue.toFixed(2)} to use this coupon`,
      discountAmount: 0,
      isFreeShipping: false,
    };
  }

  let discountAmount = 0;
  if (coupon.discountPercent > 0) {
    discountAmount = (cartSubtotal * coupon.discountPercent) / 100;
  } else if (coupon.fixedDiscount && coupon.fixedDiscount > 0) {
    discountAmount = Math.min(coupon.fixedDiscount, cartSubtotal);
  }

  return {
    valid: true,
    discountAmount: Math.round(discountAmount * 100) / 100,
    isFreeShipping: Boolean(coupon.isFreeShipping),
  };
};

describe('Atelier Coupon Validation & Calculation Engine', () => {
  const baseDate = new Date('2026-11-05T00:00:00Z');

  it('validates a standard active percentage coupon successfully', () => {
    const coupon: CouponRule = {
      code: 'TOON20',
      discountPercent: 20,
      minOrderValue: 50,
      expiryDate: '2026-12-31T23:59:59Z',
      usageLimit: 100,
      timesUsed: 10,
      isActive: true,
    };

    const res = validateCouponRules(coupon, 100, baseDate);
    expect(res.valid).toBe(true);
    expect(res.discountAmount).toBe(20);
    expect(res.isFreeShipping).toBe(false);
  });

  it('rejects an expired coupon code', () => {
    const coupon: CouponRule = {
      code: 'VINTAGE50',
      discountPercent: 50,
      minOrderValue: 0,
      expiryDate: '2026-10-01T00:00:00Z', // Past date relative to baseDate
      usageLimit: 0,
      timesUsed: 5,
      isActive: true,
    };

    const res = validateCouponRules(coupon, 100, baseDate);
    expect(res.valid).toBe(false);
    expect(res.message).toContain('has expired');
  });

  it('rejects a coupon when order subtotal is below minimum spend threshold', () => {
    const coupon: CouponRule = {
      code: 'VIPDROP',
      discountPercent: 25,
      minOrderValue: 120,
      expiryDate: '2026-12-31T23:59:59Z',
      usageLimit: 0,
      timesUsed: 0,
      isActive: true,
    };

    const res = validateCouponRules(coupon, 85, baseDate);
    expect(res.valid).toBe(false);
    expect(res.message).toContain('at least $120.00');
  });

  it('rejects a coupon that has exhausted its usage limit', () => {
    const coupon: CouponRule = {
      code: 'FLASH50LIMIT',
      discountPercent: 30,
      minOrderValue: 0,
      expiryDate: '2026-12-31T23:59:59Z',
      usageLimit: 50,
      timesUsed: 50,
      isActive: true,
    };

    const res = validateCouponRules(coupon, 100, baseDate);
    expect(res.valid).toBe(false);
    expect(res.message).toContain('maximum redemption limit');
  });

  it('calculates fixed dollar discounts capped at cart subtotal', () => {
    const coupon: CouponRule = {
      code: 'CASH25',
      discountPercent: 0,
      fixedDiscount: 25,
      minOrderValue: 0,
      expiryDate: '2026-12-31T23:59:59Z',
      usageLimit: 0,
      timesUsed: 0,
      isActive: true,
    };

    const resNormal = validateCouponRules(coupon, 80, baseDate);
    expect(resNormal.valid).toBe(true);
    expect(resNormal.discountAmount).toBe(25);

    // If cart total is less than fixed discount ($20 < $25), discount is capped at $20
    const resCapped = validateCouponRules(coupon, 20, baseDate);
    expect(resCapped.valid).toBe(true);
    expect(resCapped.discountAmount).toBe(20);
  });

  it('correctly enables zero freight worldwide for free shipping vouchers', () => {
    const coupon: CouponRule = {
      code: 'FREESHIPGLOBAL',
      discountPercent: 0,
      isFreeShipping: true,
      minOrderValue: 40,
      expiryDate: '2026-12-31T23:59:59Z',
      usageLimit: 0,
      timesUsed: 0,
      isActive: true,
    };

    const res = validateCouponRules(coupon, 50, baseDate);
    expect(res.valid).toBe(true);
    expect(res.isFreeShipping).toBe(true);
    expect(res.discountAmount).toBe(0);
  });

  it('rejects deactivated coupons', () => {
    const coupon: CouponRule = {
      code: 'PAUSEDCODE',
      discountPercent: 15,
      minOrderValue: 0,
      expiryDate: '2026-12-31T23:59:59Z',
      usageLimit: 0,
      timesUsed: 0,
      isActive: false,
    };

    const res = validateCouponRules(coupon, 100, baseDate);
    expect(res.valid).toBe(false);
    expect(res.message).toContain('deactivated');
  });
});
