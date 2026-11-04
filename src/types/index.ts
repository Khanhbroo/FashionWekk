export interface Product {
  _id: string;
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
  createdAt?: string;
}

export interface CartItem {
  productId: string;
  title: string;
  price: number;
  quantity: number;
  size: string;
  color: string;
  image: string;
  gsm?: number;
}

export interface CouponData {
  _id?: string;
  code: string;
  discountPercent: number;
  fixedDiscount?: number;
  isFreeShipping?: boolean;
  minOrderValue?: number;
  discountAmount: number;
  description: string;
  expiryDate?: string;
  usageLimit?: number;
  timesUsed?: number;
  isActive?: boolean;
  createdAt?: string;
}

export interface OrderData {
  _id?: string;
  orderNumber: string;
  customerName: string;
  customerEmail: string;
  customerPhone?: string;
  shippingAddress: string;
  items: CartItem[];
  subtotal: number;
  discountAmount: number;
  shippingFee: number;
  totalAmount: number;
  couponApplied?: string;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  paymentMethod: string;
  createdAt?: string;
}

export interface MascotLayers {
  head: string | null;
  top: string | null;
  bottom: string | null;
  accessory: string | null;
}
