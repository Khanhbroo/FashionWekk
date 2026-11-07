import { Request, Response } from 'express';
import mongoose from 'mongoose';
import Coupon from '../models/Coupon';

const FALLBACK_COUPONS = [
  {
    _id: 'coupon_toon10',
    code: 'TOON10',
    discountPercent: 10,
    fixedDiscount: 0,
    isFreeShipping: false,
    minOrderValue: 0,
    description: 'Instant 10% OFF on all cartoon streetwear drops',
    expiryDate: new Date('2028-12-31'),
    usageLimit: 0,
    timesUsed: 0,
    isActive: true,
  },
  {
    _id: 'coupon_freeship',
    code: 'FREESHIP',
    discountPercent: 0,
    fixedDiscount: 0,
    isFreeShipping: true,
    minOrderValue: 75,
    description: 'Free Worldwide Express Shipping on orders over $75',
    expiryDate: new Date('2028-12-31'),
    usageLimit: 0,
    timesUsed: 0,
    isActive: true,
  },
  {
    _id: 'coupon_cyber20',
    code: 'CYBER20',
    discountPercent: 20,
    fixedDiscount: 0,
    isFreeShipping: false,
    minOrderValue: 120,
    description: '20% Mega Pop Discount on orders over $120',
    expiryDate: new Date('2028-12-31'),
    usageLimit: 0,
    timesUsed: 0,
    isActive: true,
  },
  {
    _id: 'coupon_neotokyo30',
    code: 'NEOTOKYO30',
    discountPercent: 30,
    fixedDiscount: 0,
    isFreeShipping: false,
    minOrderValue: 200,
    description: '30% VIP Collector pass for elite streetwear hauls',
    expiryDate: new Date('2028-12-31'),
    usageLimit: 0,
    timesUsed: 0,
    isActive: true,
  },
  {
    _id: 'coupon_luckyspin',
    code: 'LUCKYSPIN',
    discountPercent: 15,
    fixedDiscount: 0,
    isFreeShipping: false,
    minOrderValue: 50,
    description: 'Mystery Wheel Lucky Spin 15% Pop Discount',
    expiryDate: new Date('2028-12-31'),
    usageLimit: 0,
    timesUsed: 0,
    isActive: true,
  },
];

export const validateCoupon = async (req: Request, res: Response) => {
  try {
    const { code, cartTotal = 0 } = req.body;

    if (!code) {
      return res.status(400).json({ success: false, message: 'Coupon code is required' });
    }

    const cleanCode = String(code).trim().toUpperCase();
    let coupon: any = null;

    if (mongoose.connection.readyState >= 1) {
      try {
        coupon = await Coupon.findOne({ code: cleanCode });
      } catch (err) {
        // Fall back to memory list
      }
    }

    if (!coupon) {
      coupon = FALLBACK_COUPONS.find((c) => c.code === cleanCode);
    }

    if (!coupon) {
      return res.status(404).json({ success: false, message: `Coupon code '${cleanCode}' does not exist` });
    }

    if (!coupon.isActive) {
      return res.status(400).json({ success: false, message: `Coupon '${cleanCode}' is currently deactivated` });
    }

    const now = new Date();
    const expiry = new Date(coupon.expiryDate);
    if (expiry < now) {
      const formattedDate = expiry.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      });
      return res.status(400).json({
        success: false,
        message: `Coupon '${cleanCode}' expired on ${formattedDate}`,
      });
    }

    if (coupon.usageLimit > 0 && coupon.timesUsed >= coupon.usageLimit) {
      return res.status(400).json({
        success: false,
        message: `Coupon '${cleanCode}' has reached its maximum redemption limit (${coupon.usageLimit} uses)`,
      });
    }

    if (cartTotal < coupon.minOrderValue) {
      return res.status(400).json({
        success: false,
        message: `Cart subtotal must be at least $${coupon.minOrderValue.toFixed(2)} (current subtotal is $${Number(cartTotal).toFixed(2)}) to activate this coupon`,
      });
    }

    let discountAmount = 0;
    if (coupon.discountPercent > 0) {
      discountAmount = (cartTotal * coupon.discountPercent) / 100;
    } else if (coupon.fixedDiscount && coupon.fixedDiscount > 0) {
      discountAmount = Math.min(coupon.fixedDiscount, cartTotal);
    }

    return res.json({
      success: true,
      message: 'Coupon successfully validated and applied!',
      data: {
        _id: coupon._id,
        code: coupon.code,
        discountPercent: coupon.discountPercent,
        fixedDiscount: coupon.fixedDiscount,
        isFreeShipping: coupon.isFreeShipping,
        minOrderValue: coupon.minOrderValue,
        discountAmount: Math.round(discountAmount * 100) / 100,
        description: coupon.description,
        expiryDate: new Date(coupon.expiryDate).toISOString(),
        usageLimit: coupon.usageLimit,
        timesUsed: coupon.timesUsed,
        isActive: coupon.isActive,
      },
    });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const getCoupons = async (_req: Request, res: Response) => {
  try {
    if (mongoose.connection.readyState >= 1) {
      const coupons = await Coupon.find().sort({ createdAt: -1 });
      return res.json({ success: true, count: coupons.length, data: coupons });
    }
    return res.json({ success: true, count: FALLBACK_COUPONS.length, data: FALLBACK_COUPONS });
  } catch (error: any) {
    return res.json({ success: true, count: FALLBACK_COUPONS.length, data: FALLBACK_COUPONS });
  }
};

export const createCoupon = async (req: Request, res: Response) => {
  try {
    const {
      code,
      discountPercent = 0,
      fixedDiscount = 0,
      isFreeShipping = false,
      minOrderValue = 0,
      expiryDate,
      usageLimit = 0,
      description = '',
      isActive = true,
    } = req.body;

    if (!code || !String(code).trim()) {
      return res.status(400).json({ success: false, message: 'Coupon code is required' });
    }

    const cleanCode = String(code).trim().toUpperCase();

    const existing = await Coupon.findOne({ code: cleanCode });
    if (existing) {
      return res.status(400).json({
        success: false,
        message: `A coupon with code '${cleanCode}' already exists in the vault`,
      });
    }

    const parsedExpiry = expiryDate
      ? new Date(expiryDate)
      : new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);

    const coupon = await Coupon.create({
      code: cleanCode,
      discountPercent: Number(discountPercent) || 0,
      fixedDiscount: Number(fixedDiscount) || 0,
      isFreeShipping: Boolean(isFreeShipping),
      minOrderValue: Number(minOrderValue) || 0,
      expiryDate: parsedExpiry,
      usageLimit: Number(usageLimit) || 0,
      timesUsed: 0,
      description: String(description).trim(),
      isActive: Boolean(isActive),
    });

    res.status(201).json({ success: true, message: 'Coupon created successfully in vault', data: coupon });
  } catch (error: any) {
    res.status(400).json({ success: false, message: error.message });
  }
};

export const updateCoupon = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const updates = { ...req.body };

    if (updates.code) {
      updates.code = String(updates.code).trim().toUpperCase();
    }
    if (updates.expiryDate) {
      updates.expiryDate = new Date(updates.expiryDate);
    }

    const coupon = await Coupon.findByIdAndUpdate(id, updates, {
      new: true,
      runValidators: true,
    });

    if (!coupon) {
      return res.status(404).json({ success: false, message: 'Coupon not found' });
    }

    res.json({ success: true, message: 'Coupon updated successfully', data: coupon });
  } catch (error: any) {
    res.status(400).json({ success: false, message: error.message });
  }
};

export const deleteCoupon = async (req: Request, res: Response) => {
  try {
    const coupon = await Coupon.findByIdAndDelete(req.params.id);
    if (!coupon) {
      return res.status(404).json({ success: false, message: 'Coupon not found' });
    }
    res.json({ success: true, message: 'Coupon deleted successfully' });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};
