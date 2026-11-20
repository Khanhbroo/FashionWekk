import { beforeEach, describe, expect, it, vi } from 'vitest';
import mongoose from 'mongoose';

vi.mock('../server/models/Coupon', () => ({
  default: { findOne: vi.fn() },
}));

import Coupon from '../server/models/Coupon';
import { validateCoupon } from '../server/controllers/couponController';

const findOne = (Coupon as any).findOne as ReturnType<typeof vi.fn>;

let readyState = 0;
Object.defineProperty(mongoose.connection, 'readyState', {
  get: () => readyState,
  configurable: true,
});

const callValidate = async (body: Record<string, unknown>) => {
  const result: { status: number; body: any } = { status: 200, body: null };
  const res: any = {
    status(code: number) {
      result.status = code;
      return res;
    },
    json(payload: unknown) {
      result.body = payload;
      return res;
    },
  };
  await validateCoupon({ body } as any, res);
  return result;
};

const dbCoupon = (overrides: Record<string, unknown> = {}) => ({
  _id: 'db_coupon',
  code: 'DBCODE',
  discountPercent: 0,
  fixedDiscount: 0,
  isFreeShipping: false,
  minOrderValue: 0,
  description: 'database coupon',
  expiryDate: new Date('2999-12-31'),
  usageLimit: 0,
  timesUsed: 0,
  isActive: true,
  ...overrides,
});

describe('validateCoupon with the in-memory fallback catalog', () => {
  beforeEach(() => {
    readyState = 0;
    findOne.mockReset();
  });

  it('requires a coupon code', async () => {
    const res = await callValidate({ cartTotal: 100 });
    expect(res.status).toBe(400);
    expect(res.body.message).toContain('required');
  });

  it('returns 404 for an unknown code', async () => {
    const res = await callValidate({ code: 'NOPE', cartTotal: 100 });
    expect(res.status).toBe(404);
    expect(res.body.message).toContain('does not exist');
  });

  it('normalizes the code and applies a percentage discount', async () => {
    const res = await callValidate({ code: '  toon10 ', cartTotal: 100 });
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.code).toBe('TOON10');
    expect(res.body.data.discountAmount).toBe(10);
  });

  it('rejects a coupon when the cart is below its minimum order value', async () => {
    const res = await callValidate({ code: 'CYBER20', cartTotal: 100 });
    expect(res.status).toBe(400);
    expect(res.body.message).toContain('at least $120.00');
  });

  it('accepts a free shipping coupon without a money discount', async () => {
    const res = await callValidate({ code: 'FREESHIP', cartTotal: 80 });
    expect(res.status).toBe(200);
    expect(res.body.data.isFreeShipping).toBe(true);
    expect(res.body.data.discountAmount).toBe(0);
  });
});

describe('validateCoupon with database coupons', () => {
  beforeEach(() => {
    readyState = 1;
    findOne.mockReset();
  });

  it('rejects an expired coupon', async () => {
    findOne.mockResolvedValue(dbCoupon({ discountPercent: 50, expiryDate: new Date('2020-01-01') }));
    const res = await callValidate({ code: 'DBCODE', cartTotal: 100 });
    expect(res.status).toBe(400);
    expect(res.body.message).toContain('expired');
  });

  it('rejects a deactivated coupon', async () => {
    findOne.mockResolvedValue(dbCoupon({ discountPercent: 15, isActive: false }));
    const res = await callValidate({ code: 'DBCODE', cartTotal: 100 });
    expect(res.status).toBe(400);
    expect(res.body.message).toContain('deactivated');
  });

  it('rejects a coupon that reached its usage limit', async () => {
    findOne.mockResolvedValue(dbCoupon({ discountPercent: 30, usageLimit: 50, timesUsed: 50 }));
    const res = await callValidate({ code: 'DBCODE', cartTotal: 100 });
    expect(res.status).toBe(400);
    expect(res.body.message).toContain('maximum redemption limit');
  });

  it('caps a fixed discount at the cart total', async () => {
    findOne.mockResolvedValue(dbCoupon({ fixedDiscount: 25 }));
    const normal = await callValidate({ code: 'DBCODE', cartTotal: 80 });
    expect(normal.body.data.discountAmount).toBe(25);
    const capped = await callValidate({ code: 'DBCODE', cartTotal: 20 });
    expect(capped.body.data.discountAmount).toBe(20);
  });

  it('falls back to the in-memory catalog when the database lookup fails', async () => {
    findOne.mockRejectedValue(new Error('connection lost'));
    const res = await callValidate({ code: 'TOON10', cartTotal: 100 });
    expect(res.status).toBe(200);
    expect(res.body.data.discountAmount).toBe(10);
  });
});
