import { Request, Response } from 'express';
import Coupon from '../models/Coupon';

export const validateCoupon = async (req: Request, res: Response) => {
  try {
    const { code, cartTotal = 0 } = req.body;

    if (!code) {
      return res.status(400).json({ success: false, message: 'Coupon code is required' });
    }

    const cleanCode = String(code).trim().toUpperCase();
    const coupon = await Coupon.findOne({ code: cleanCode });

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

    res.json({
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
        expiryDate: coupon.expiryDate.toISOString(),
        usageLimit: coupon.usageLimit,
        timesUsed: coupon.timesUsed,
        isActive: coupon.isActive,
      },
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getCoupons = async (_req: Request, res: Response) => {
  try {
    const coupons = await Coupon.find().sort({ createdAt: -1 });
    res.json({ success: true, count: coupons.length, data: coupons });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
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
