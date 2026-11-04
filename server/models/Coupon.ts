import mongoose, { Schema, Document } from 'mongoose';

export interface ICoupon extends Document {
  code: string;
  discountPercent: number;
  fixedDiscount?: number;
  isFreeShipping?: boolean;
  minOrderValue: number;
  expiryDate: Date;
  usageLimit: number;
  timesUsed: number;
  isActive: boolean;
  description: string;
  createdAt: Date;
  updatedAt: Date;
}

const CouponSchema: Schema = new Schema(
  {
    code: {
      type: String,
      required: true,
      unique: true,
      uppercase: true,
      trim: true,
    },
    discountPercent: { type: Number, default: 0, min: 0, max: 100 },
    fixedDiscount: { type: Number, default: 0, min: 0 },
    isFreeShipping: { type: Boolean, default: false },
    minOrderValue: { type: Number, default: 0, min: 0 },
    expiryDate: {
      type: Date,
      default: () => new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
    },
    usageLimit: { type: Number, default: 0, min: 0 }, // 0 = unlimited
    timesUsed: { type: Number, default: 0, min: 0 },
    isActive: { type: Boolean, default: true },
    description: { type: String, default: '' },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

export default mongoose.models.Coupon || mongoose.model<ICoupon>('Coupon', CouponSchema);
