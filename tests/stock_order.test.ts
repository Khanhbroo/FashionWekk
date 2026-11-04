import { describe, it, expect } from 'vitest';

export interface OrderItemInput {
  productId: string;
  title: string;
  quantity: number;
}

export interface ProductStockInfo {
  _id: string;
  title: string;
  stock: number;
}

export const validateOrderStock = (
  orderItems: OrderItemInput[],
  stockInventory: Record<string, ProductStockInfo>
) => {
  for (const item of orderItems) {
    const product = stockInventory[item.productId];
    if (!product) {
      return {
        valid: false,
        message: `Product ${item.title} does not exist in inventory`,
      };
    }
    if (product.stock <= 0) {
      return {
        valid: false,
        message: `Product "${product.title}" is out of stock`,
      };
    }
    if (item.quantity > product.stock) {
      return {
        valid: false,
        message: `Product "${product.title}" only has ${product.stock} items in stock, cannot fulfill ${item.quantity}`,
      };
    }
  }
  return { valid: true, message: 'Stock is valid' };
};

export const validateCouponEligibility = (
  coupon: { code: string; minOrderValue: number; discountPercent: number; isFreeShipping?: boolean } | null,
  currentSubtotal: number
) => {
  if (!coupon) {
    return { isEligible: true, discountAmount: 0, reason: '' };
  }

  if (currentSubtotal < coupon.minOrderValue) {
    return {
      isEligible: false,
      discountAmount: 0,
      reason: `Minimum order value of $${coupon.minOrderValue} required for promo code ${coupon.code}`,
    };
  }

  let discountAmount = 0;
  if (coupon.discountPercent > 0) {
    discountAmount = Math.round(((currentSubtotal * coupon.discountPercent) / 100) * 100) / 100;
  }

  return {
    isEligible: true,
    discountAmount,
    reason: 'Valid coupon',
  };
};

describe('stock and coupon validation', () => {
  const mockInventory: Record<string, ProductStockInfo> = {
    prod_1: { _id: 'prod_1', title: 'Cyber Toon Glitch Hoodie', stock: 5 },
    prod_2: { _id: 'prod_2', title: 'Mecha Bot Evolution Tee', stock: 0 },
    prod_3: { _id: 'prod_3', title: 'Rogue Clan Distressed Cargo', stock: 12 },
  };

  it('should pass stock validation when inventory is sufficient', () => {
    const items: OrderItemInput[] = [
      { productId: 'prod_1', title: 'Cyber Toon Glitch Hoodie', quantity: 2 },
      { productId: 'prod_3', title: 'Rogue Clan Distressed Cargo', quantity: 1 },
    ];
    const res = validateOrderStock(items, mockInventory);
    expect(res.valid).toBe(true);
  });

  it('should reject order if any product is out of stock (stock = 0)', () => {
    const items: OrderItemInput[] = [
      { productId: 'prod_2', title: 'Mecha Bot Evolution Tee', quantity: 1 },
    ];
    const res = validateOrderStock(items, mockInventory);
    expect(res.valid).toBe(false);
    expect(res.message).toContain('is out of stock');
  });

  it('should reject order if requested quantity exceeds available stock', () => {
    const items: OrderItemInput[] = [
      { productId: 'prod_1', title: 'Cyber Toon Glitch Hoodie', quantity: 10 },
    ];
    const res = validateOrderStock(items, mockInventory);
    expect(res.valid).toBe(false);
    expect(res.message).toContain('only has 5 items in stock');
  });

  it('should invalidate coupon if cart subtotal drops below coupon minOrderValue', () => {
    const coupon = {
      code: 'FREESHIP',
      minOrderValue: 75,
      discountPercent: 0,
      isFreeShipping: true,
    };

    const res1 = validateCouponEligibility(coupon, 80);
    expect(res1.isEligible).toBe(true);

    const res2 = validateCouponEligibility(coupon, 50);
    expect(res2.isEligible).toBe(false);
    expect(res2.reason).toContain('Minimum order value of $75');
  });
});
