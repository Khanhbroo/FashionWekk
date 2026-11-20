import { beforeEach, describe, expect, it, vi } from 'vitest';

vi.mock('../server/models/Product', () => ({
  default: { findById: vi.fn(), findByIdAndUpdate: vi.fn() },
}));
vi.mock('../server/models/Order', () => ({
  default: { create: vi.fn() },
}));
vi.mock('../server/models/Coupon', () => ({
  default: { findOneAndUpdate: vi.fn() },
}));

import Product from '../server/models/Product';
import Order from '../server/models/Order';
import Coupon from '../server/models/Coupon';
import { createOrder } from '../server/controllers/orderController';

const findById = (Product as any).findById as ReturnType<typeof vi.fn>;
const findByIdAndUpdate = (Product as any).findByIdAndUpdate as ReturnType<typeof vi.fn>;
const createOrderDoc = (Order as any).create as ReturnType<typeof vi.fn>;
const couponUpdate = (Coupon as any).findOneAndUpdate as ReturnType<typeof vi.fn>;

const callCreateOrder = async (body: Record<string, unknown>) => {
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
  await createOrder({ body } as any, res);
  return result;
};

const validOrder = (items: Array<Record<string, unknown>>, extra: Record<string, unknown> = {}) => ({
  customerName: 'Khanh',
  customerEmail: 'khanh@example.com',
  shippingAddress: 'Hanoi',
  items,
  subtotal: 100,
  totalAmount: 100,
  ...extra,
});

describe('createOrder validation and stock handling', () => {
  beforeEach(() => {
    findById.mockReset();
    findByIdAndUpdate.mockReset().mockResolvedValue({});
    createOrderDoc.mockReset().mockResolvedValue({ _id: 'order_1' });
    couponUpdate.mockReset().mockResolvedValue({});
  });

  it('rejects an empty cart', async () => {
    const res = await callCreateOrder(validOrder([]));
    expect(res.status).toBe(400);
    expect(res.body.message).toContain('cannot be empty');
  });

  it('rejects an order without shipping details', async () => {
    const res = await callCreateOrder(
      validOrder([{ productId: 'p1', title: 'Hoodie', quantity: 1 }], { customerName: '' })
    );
    expect(res.status).toBe(400);
    expect(res.body.message).toContain('required shipping details');
  });

  it('rejects a product that does not exist in inventory', async () => {
    findById.mockResolvedValue(null);
    const res = await callCreateOrder(validOrder([{ productId: 'ghost', title: 'Ghost Tee', quantity: 1 }]));
    expect(res.status).toBe(400);
    expect(res.body.message).toContain('does not exist in inventory');
    expect(createOrderDoc).not.toHaveBeenCalled();
  });

  it('rejects a product that is out of stock', async () => {
    findById.mockResolvedValue({ title: 'Mecha Bot Evolution Tee', stock: 0 });
    const res = await callCreateOrder(validOrder([{ productId: 'p2', title: 'Tee', quantity: 1 }]));
    expect(res.status).toBe(400);
    expect(res.body.message).toContain('is out of stock');
    expect(createOrderDoc).not.toHaveBeenCalled();
  });

  it('rejects a quantity above the available stock', async () => {
    findById.mockResolvedValue({ title: 'Cyber Toon Glitch Hoodie', stock: 5 });
    const res = await callCreateOrder(validOrder([{ productId: 'p1', title: 'Hoodie', quantity: 10 }]));
    expect(res.status).toBe(400);
    expect(res.body.message).toContain('only has 5 items left in stock');
    expect(createOrderDoc).not.toHaveBeenCalled();
  });

  it('creates the order, decrements stock and counts the coupon use', async () => {
    findById.mockResolvedValue({ title: 'Cyber Toon Glitch Hoodie', stock: 5 });
    const res = await callCreateOrder(
      validOrder([{ productId: 'p1', title: 'Hoodie', quantity: 2 }], { couponApplied: ' toon10 ' })
    );
    expect(res.status).toBe(201);
    expect(res.body.success).toBe(true);
    expect(findByIdAndUpdate).toHaveBeenCalledWith('p1', { $inc: { stock: -2 } });
    expect(couponUpdate).toHaveBeenCalledWith({ code: 'TOON10' }, { $inc: { timesUsed: 1 } });
  });
});
