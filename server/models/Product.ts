import mongoose, { Schema, Document } from 'mongoose';

export interface IProduct extends Document {
  title: string;
  price: number;
  originalPrice: number;
  category: 'hoodies' | 'tees' | 'bottoms' | 'outerwear' | 'accessories' | 'collectibles';
  description: string;
  images: string[];
  colors: string[];
  sizes: string[];
  gsm: number;
  stock: number;
  isFlashSale: boolean;
  discountPercent?: number;
  tags: string[];
  rating: number;
  reviewCount: number;
  mascotSlot?: 'top' | 'bottom' | 'head' | 'accessory' | 'none';
  mascotAsset?: string;
  featured?: boolean;
  collectionName?: string;
  season?: 'SS26' | 'FW26' | 'All-Season';
  createdAt: Date;
  updatedAt: Date;
}

const ProductSchema: Schema = new Schema(
  {
    title: { type: String, required: true, trim: true, index: true },
    price: { type: Number, required: true, min: 0 },
    originalPrice: { type: Number, required: true, min: 0 },
    category: {
      type: String,
      required: true,
      enum: ['hoodies', 'tees', 'bottoms', 'outerwear', 'accessories', 'collectibles'],
      index: true,
    },
    collectionName: { type: String, default: '', index: true },
    season: {
      type: String,
      enum: ['SS26', 'FW26', 'All-Season'],
      default: 'All-Season',
      index: true,
    },
    description: { type: String, required: true },
    images: { type: [String], default: [] },
    colors: { type: [String], default: [] },
    sizes: { type: [String], default: ['S', 'M', 'L', 'XL'] },
    gsm: { type: Number, default: 350 },
    stock: { type: Number, default: 20, min: 0 },
    isFlashSale: { type: Boolean, default: false, index: true },
    discountPercent: { type: Number, default: 0 },
    tags: { type: [String], default: [], index: true },
    rating: { type: Number, default: 4.8, min: 1, max: 5 },
    reviewCount: { type: Number, default: 12 },
    mascotSlot: {
      type: String,
      enum: ['top', 'bottom', 'head', 'accessory', 'none'],
      default: 'none',
    },
    mascotAsset: { type: String, default: '' },
    featured: { type: Boolean, default: false },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

ProductSchema.index({ title: 'text', description: 'text', tags: 'text' });

export default mongoose.models.Product || mongoose.model<IProduct>('Product', ProductSchema);
