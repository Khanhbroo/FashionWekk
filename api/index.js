// api/index.ts
import express from "express";
import cors from "cors";
import dotenv2 from "dotenv";

// server/config/db.ts
import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();
var cachedConn = null;
var connectDB = async () => {
  if (mongoose.connection.readyState >= 1) {
    return mongoose;
  }
  if (cachedConn) {
    return cachedConn;
  }
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    console.warn("MONGODB_URI is not defined. Backend will operate in mock mode.");
    return null;
  }
  try {
    cachedConn = await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 5e3
    });
    console.log(`MongoDB connected: ${cachedConn.connection.host}/${cachedConn.connection.name}`);
    return cachedConn;
  } catch (error) {
    console.error(`MongoDB connection error: ${error.message}`);
    return null;
  }
};

// server/routes/productRoutes.ts
import { Router } from "express";

// server/controllers/productController.ts
import mongoose3 from "mongoose";

// server/models/Product.ts
import mongoose2, { Schema } from "mongoose";
var ProductSchema = new Schema(
  {
    title: { type: String, required: true, trim: true, index: true },
    price: { type: Number, required: true, min: 0 },
    originalPrice: { type: Number, required: true, min: 0 },
    category: {
      type: String,
      required: true,
      enum: ["hoodies", "tees", "bottoms", "outerwear", "accessories", "collectibles"],
      index: true
    },
    collectionName: { type: String, default: "", index: true },
    season: {
      type: String,
      enum: ["SS26", "FW26", "All-Season"],
      default: "All-Season",
      index: true
    },
    description: { type: String, required: true },
    images: { type: [String], default: [] },
    colors: { type: [String], default: [] },
    sizes: { type: [String], default: ["S", "M", "L", "XL"] },
    gsm: { type: Number, default: 350 },
    stock: { type: Number, default: 20, min: 0 },
    isFlashSale: { type: Boolean, default: false, index: true },
    discountPercent: { type: Number, default: 0 },
    tags: { type: [String], default: [], index: true },
    rating: { type: Number, default: 4.8, min: 1, max: 5 },
    reviewCount: { type: Number, default: 12 },
    mascotSlot: {
      type: String,
      enum: ["top", "bottom", "head", "accessory", "none"],
      default: "none"
    },
    mascotAsset: { type: String, default: "" },
    featured: { type: Boolean, default: false }
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);
ProductSchema.index({ title: "text", description: "text", tags: "text" });
var Product_default = mongoose2.models.Product || mongoose2.model("Product", ProductSchema);

// server/data/fallback_products.json
var fallback_products_default = [
  {
    _id: "prod_ss_1",
    title: "Chibi Harajuku Splash Oversize Pop Art Graphic Tee #1",
    price: 47,
    originalPrice: 47,
    category: "tees",
    season: "SS26",
    collectionName: "Chibi Harajuku Splash",
    description: "Spring/Summer 2026 edition from the Chibi Harajuku Splash capsule. Crafted with breathable 260 GSM combed organic cotton. Built for warm-weather city movement with sweat-wicking treatment, reinforced seam binding, and signature 3D cartoon liquid pop-art graphics curated by KhanhBro.",
    images: [
      "https://res.cloudinary.com/dptpb60p7/image/upload/f_auto,q_auto/v1793891791/fashionwekk/masterpieces/chibi_harajuku_splash.png",
      "https://res.cloudinary.com/dptpb60p7/image/upload/c_fill,w_800,h_1000,g_auto/f_auto,q_auto/v1793891791/fashionwekk/masterpieces/chibi_harajuku_splash.png",
      "https://res.cloudinary.com/dptpb60p7/image/upload/c_crop,w_600,h_600,g_center/f_auto,q_auto/v1793891791/fashionwekk/masterpieces/chibi_harajuku_splash.png"
    ],
    colors: [
      "Onyx Black",
      "Sunset Coral"
    ],
    sizes: [
      "S",
      "M",
      "L",
      "XL",
      "XXL"
    ],
    gsm: 260,
    stock: 35,
    isFlashSale: false,
    discountPercent: 0,
    tags: [
      "ChibiDrip",
      "SS26",
      "SpringSummer",
      "Streetwear",
      "FashionWekk",
      "KhanhBro",
      "tees"
    ],
    rating: 4.8,
    reviewCount: 38,
    mascotSlot: "top",
    mascotAsset: "asset_ss_tees_2",
    featured: true,
    createdAt: "2026-11-03T07:29:11.801Z",
    updatedAt: "2026-11-03T07:29:11.801Z"
  },
  {
    _id: "prod_ss_2",
    title: "Pixel Quest 8-Bit Oversize Pop Art Graphic Tee #2",
    price: 52,
    originalPrice: 52,
    category: "tees",
    season: "SS26",
    collectionName: "Pixel Quest 8-Bit",
    description: "Spring/Summer 2026 edition from the Pixel Quest 8-Bit capsule. Crafted with breathable 250 GSM combed organic cotton. Built for warm-weather city movement with sweat-wicking treatment, reinforced seam binding, and signature 3D cartoon liquid pop-art graphics curated by KhanhBro.",
    images: [
      "https://res.cloudinary.com/dptpb60p7/image/upload/f_auto,q_auto/v1793891935/fashionwekk/masterpieces/pixel_quest_8bit.png",
      "https://res.cloudinary.com/dptpb60p7/image/upload/c_fill,w_800,h_1000,g_auto/f_auto,q_auto/v1793891935/fashionwekk/masterpieces/pixel_quest_8bit.png",
      "https://res.cloudinary.com/dptpb60p7/image/upload/c_crop,w_600,h_600,g_center/f_auto,q_auto/v1793891935/fashionwekk/masterpieces/pixel_quest_8bit.png"
    ],
    colors: [
      "Washed Charcoal",
      "Electric Cyan"
    ],
    sizes: [
      "S",
      "M",
      "L",
      "XL",
      "XXL"
    ],
    gsm: 250,
    stock: 35,
    isFlashSale: false,
    discountPercent: 0,
    tags: [
      "PixelArt",
      "SS26",
      "SpringSummer",
      "Streetwear",
      "FashionWekk",
      "KhanhBro",
      "tees"
    ],
    rating: 4.9,
    reviewCount: 38,
    mascotSlot: "top",
    mascotAsset: "asset_ss_tees_3",
    featured: true,
    createdAt: "2026-11-03T08:29:11.801Z",
    updatedAt: "2026-11-03T08:29:11.801Z"
  },
  {
    _id: "prod_ss_3",
    title: "Solar Flare Washed Oversize Pop Art Graphic Tee #3",
    price: 57,
    originalPrice: 57,
    category: "tees",
    season: "SS26",
    collectionName: "Solar Flare Washed",
    description: "Spring/Summer 2026 edition from the Solar Flare Washed capsule. Crafted with breathable 270 GSM combed organic cotton. Built for warm-weather city movement with sweat-wicking treatment, reinforced seam binding, and signature 3D cartoon liquid pop-art graphics curated by KhanhBro.",
    images: [
      "https://res.cloudinary.com/dptpb60p7/image/upload/f_auto,q_auto/v1793892087/fashionwekk/masterpieces/solar_flare_washed.png",
      "https://res.cloudinary.com/dptpb60p7/image/upload/c_fill,w_800,h_1000,g_auto/f_auto,q_auto/v1793892087/fashionwekk/masterpieces/solar_flare_washed.png",
      "https://res.cloudinary.com/dptpb60p7/image/upload/c_crop,w_600,h_600,g_center/f_auto,q_auto/v1793892087/fashionwekk/masterpieces/solar_flare_washed.png"
    ],
    colors: [
      "Deep Lavender",
      "Shadow Black"
    ],
    sizes: [
      "S",
      "M",
      "L",
      "XL",
      "XXL"
    ],
    gsm: 270,
    stock: 35,
    isFlashSale: false,
    discountPercent: 0,
    tags: [
      "SolarFlare",
      "SS26",
      "SpringSummer",
      "Streetwear",
      "FashionWekk",
      "KhanhBro",
      "tees"
    ],
    rating: 4.9,
    reviewCount: 38,
    mascotSlot: "top",
    mascotAsset: "asset_ss_tees_4",
    featured: true,
    createdAt: "2026-11-03T09:29:11.801Z",
    updatedAt: "2026-11-03T09:29:11.801Z"
  },
  {
    _id: "prod_ss_4",
    title: "Synth Wave Sunset Oversize Pop Art Graphic Tee #4",
    price: 62,
    originalPrice: 62,
    category: "tees",
    season: "SS26",
    collectionName: "Synth Wave Sunset",
    description: "Spring/Summer 2026 edition from the Synth Wave Sunset capsule. Crafted with breathable 240 GSM combed organic cotton. Built for warm-weather city movement with sweat-wicking treatment, reinforced seam binding, and signature 3D cartoon liquid pop-art graphics curated by KhanhBro.",
    images: [
      "https://res.cloudinary.com/dptpb60p7/image/upload/f_auto,q_auto/v1793892122/fashionwekk/masterpieces/synth_wave_sunset.png",
      "https://res.cloudinary.com/dptpb60p7/image/upload/c_fill,w_800,h_1000,g_auto/f_auto,q_auto/v1793892122/fashionwekk/masterpieces/synth_wave_sunset.png",
      "https://res.cloudinary.com/dptpb60p7/image/upload/c_crop,w_600,h_600,g_center/f_auto,q_auto/v1793892122/fashionwekk/masterpieces/synth_wave_sunset.png"
    ],
    colors: [
      "Bone White",
      "Pop Magenta"
    ],
    sizes: [
      "S",
      "M",
      "L",
      "XL",
      "XXL"
    ],
    gsm: 240,
    stock: 35,
    isFlashSale: false,
    discountPercent: 0,
    tags: [
      "SynthWave",
      "SS26",
      "SpringSummer",
      "Streetwear",
      "FashionWekk",
      "KhanhBro",
      "tees"
    ],
    rating: 4.7,
    reviewCount: 38,
    mascotSlot: "top",
    mascotAsset: "asset_ss_tees_5",
    featured: true,
    createdAt: "2026-11-03T10:29:11.801Z",
    updatedAt: "2026-11-03T10:29:11.801Z"
  },
  {
    _id: "prod_ss_5",
    title: "Chibi Harajuku Splash Oversize Pop Art Graphic Tee #5",
    price: 67,
    originalPrice: 84,
    category: "tees",
    season: "SS26",
    collectionName: "Chibi Harajuku Splash",
    description: "Spring/Summer 2026 edition from the Chibi Harajuku Splash capsule. Crafted with breathable 260 GSM combed organic cotton. Built for warm-weather city movement with sweat-wicking treatment, reinforced seam binding, and signature 3D cartoon liquid pop-art graphics curated by KhanhBro.",
    images: [
      "https://res.cloudinary.com/dptpb60p7/image/upload/f_auto,q_auto/v1793891791/fashionwekk/masterpieces/chibi_harajuku_splash.png",
      "https://res.cloudinary.com/dptpb60p7/image/upload/c_fill,w_800,h_1000,g_auto/f_auto,q_auto/v1793891791/fashionwekk/masterpieces/chibi_harajuku_splash.png",
      "https://res.cloudinary.com/dptpb60p7/image/upload/c_crop,w_600,h_600,g_center/f_auto,q_auto/v1793891791/fashionwekk/masterpieces/chibi_harajuku_splash.png"
    ],
    colors: [
      "Neon Purple",
      "Hyper Green"
    ],
    sizes: [
      "S",
      "M",
      "L",
      "XL",
      "XXL"
    ],
    gsm: 260,
    stock: 35,
    isFlashSale: true,
    discountPercent: 20,
    tags: [
      "ChibiDrip",
      "SS26",
      "SpringSummer",
      "Streetwear",
      "FashionWekk",
      "KhanhBro",
      "tees"
    ],
    rating: 4.8,
    reviewCount: 38,
    mascotSlot: "top",
    mascotAsset: "asset_ss_tees_1",
    featured: true,
    createdAt: "2026-11-03T11:29:11.801Z",
    updatedAt: "2026-11-03T11:29:11.801Z"
  },
  {
    _id: "prod_ss_6",
    title: "Pixel Quest 8-Bit Oversize Pop Art Graphic Tee #6",
    price: 42,
    originalPrice: 42,
    category: "tees",
    season: "SS26",
    collectionName: "Pixel Quest 8-Bit",
    description: "Spring/Summer 2026 edition from the Pixel Quest 8-Bit capsule. Crafted with breathable 250 GSM combed organic cotton. Built for warm-weather city movement with sweat-wicking treatment, reinforced seam binding, and signature 3D cartoon liquid pop-art graphics curated by KhanhBro.",
    images: [
      "https://res.cloudinary.com/dptpb60p7/image/upload/f_auto,q_auto/v1793891935/fashionwekk/masterpieces/pixel_quest_8bit.png",
      "https://res.cloudinary.com/dptpb60p7/image/upload/c_fill,w_800,h_1000,g_auto/f_auto,q_auto/v1793891935/fashionwekk/masterpieces/pixel_quest_8bit.png",
      "https://res.cloudinary.com/dptpb60p7/image/upload/c_crop,w_600,h_600,g_center/f_auto,q_auto/v1793891935/fashionwekk/masterpieces/pixel_quest_8bit.png"
    ],
    colors: [
      "Graphite Grey",
      "Comic Yellow"
    ],
    sizes: [
      "S",
      "M",
      "L",
      "XL",
      "XXL"
    ],
    gsm: 250,
    stock: 35,
    isFlashSale: false,
    discountPercent: 0,
    tags: [
      "PixelArt",
      "SS26",
      "SpringSummer",
      "Streetwear",
      "FashionWekk",
      "KhanhBro",
      "tees"
    ],
    rating: 4.9,
    reviewCount: 38,
    mascotSlot: "top",
    mascotAsset: "asset_ss_tees_2",
    featured: true,
    createdAt: "2026-11-03T12:29:11.801Z",
    updatedAt: "2026-11-03T12:29:11.801Z"
  },
  {
    _id: "prod_ss_7",
    title: "Solar Flare Washed Oversize Pop Art Graphic Tee #7",
    price: 47,
    originalPrice: 47,
    category: "tees",
    season: "SS26",
    collectionName: "Solar Flare Washed",
    description: "Spring/Summer 2026 edition from the Solar Flare Washed capsule. Crafted with breathable 270 GSM combed organic cotton. Built for warm-weather city movement with sweat-wicking treatment, reinforced seam binding, and signature 3D cartoon liquid pop-art graphics curated by KhanhBro.",
    images: [
      "https://res.cloudinary.com/dptpb60p7/image/upload/f_auto,q_auto/v1793892087/fashionwekk/masterpieces/solar_flare_washed.png",
      "https://res.cloudinary.com/dptpb60p7/image/upload/c_fill,w_800,h_1000,g_auto/f_auto,q_auto/v1793892087/fashionwekk/masterpieces/solar_flare_washed.png",
      "https://res.cloudinary.com/dptpb60p7/image/upload/c_crop,w_600,h_600,g_center/f_auto,q_auto/v1793892087/fashionwekk/masterpieces/solar_flare_washed.png"
    ],
    colors: [
      "Onyx Black",
      "Sunset Coral"
    ],
    sizes: [
      "S",
      "M",
      "L",
      "XL",
      "XXL"
    ],
    gsm: 270,
    stock: 35,
    isFlashSale: false,
    discountPercent: 0,
    tags: [
      "SolarFlare",
      "SS26",
      "SpringSummer",
      "Streetwear",
      "FashionWekk",
      "KhanhBro",
      "tees"
    ],
    rating: 4.9,
    reviewCount: 38,
    mascotSlot: "top",
    mascotAsset: "asset_ss_tees_3",
    featured: true,
    createdAt: "2026-11-03T13:29:11.801Z",
    updatedAt: "2026-11-03T13:29:11.801Z"
  },
  {
    _id: "prod_ss_8",
    title: "Synth Wave Sunset Oversize Pop Art Graphic Tee #8",
    price: 52,
    originalPrice: 52,
    category: "tees",
    season: "SS26",
    collectionName: "Synth Wave Sunset",
    description: "Spring/Summer 2026 edition from the Synth Wave Sunset capsule. Crafted with breathable 240 GSM combed organic cotton. Built for warm-weather city movement with sweat-wicking treatment, reinforced seam binding, and signature 3D cartoon liquid pop-art graphics curated by KhanhBro.",
    images: [
      "https://res.cloudinary.com/dptpb60p7/image/upload/f_auto,q_auto/v1793892122/fashionwekk/masterpieces/synth_wave_sunset.png",
      "https://res.cloudinary.com/dptpb60p7/image/upload/c_fill,w_800,h_1000,g_auto/f_auto,q_auto/v1793892122/fashionwekk/masterpieces/synth_wave_sunset.png",
      "https://res.cloudinary.com/dptpb60p7/image/upload/c_crop,w_600,h_600,g_center/f_auto,q_auto/v1793892122/fashionwekk/masterpieces/synth_wave_sunset.png"
    ],
    colors: [
      "Washed Charcoal",
      "Electric Cyan"
    ],
    sizes: [
      "S",
      "M",
      "L",
      "XL",
      "XXL"
    ],
    gsm: 240,
    stock: 35,
    isFlashSale: false,
    discountPercent: 0,
    tags: [
      "SynthWave",
      "SS26",
      "SpringSummer",
      "Streetwear",
      "FashionWekk",
      "KhanhBro",
      "tees"
    ],
    rating: 4.7,
    reviewCount: 38,
    mascotSlot: "top",
    mascotAsset: "asset_ss_tees_4",
    featured: true,
    createdAt: "2026-11-03T14:29:11.801Z",
    updatedAt: "2026-11-03T14:29:11.801Z"
  },
  {
    _id: "prod_ss_9",
    title: "Chibi Harajuku Splash Oversize Pop Art Graphic Tee #9",
    price: 57,
    originalPrice: 57,
    category: "tees",
    season: "SS26",
    collectionName: "Chibi Harajuku Splash",
    description: "Spring/Summer 2026 edition from the Chibi Harajuku Splash capsule. Crafted with breathable 260 GSM combed organic cotton. Built for warm-weather city movement with sweat-wicking treatment, reinforced seam binding, and signature 3D cartoon liquid pop-art graphics curated by KhanhBro.",
    images: [
      "https://res.cloudinary.com/dptpb60p7/image/upload/f_auto,q_auto/v1793891791/fashionwekk/masterpieces/chibi_harajuku_splash.png",
      "https://res.cloudinary.com/dptpb60p7/image/upload/c_fill,w_800,h_1000,g_auto/f_auto,q_auto/v1793891791/fashionwekk/masterpieces/chibi_harajuku_splash.png",
      "https://res.cloudinary.com/dptpb60p7/image/upload/c_crop,w_600,h_600,g_center/f_auto,q_auto/v1793891791/fashionwekk/masterpieces/chibi_harajuku_splash.png"
    ],
    colors: [
      "Deep Lavender",
      "Shadow Black"
    ],
    sizes: [
      "S",
      "M",
      "L",
      "XL",
      "XXL"
    ],
    gsm: 260,
    stock: 35,
    isFlashSale: false,
    discountPercent: 0,
    tags: [
      "ChibiDrip",
      "SS26",
      "SpringSummer",
      "Streetwear",
      "FashionWekk",
      "KhanhBro",
      "tees"
    ],
    rating: 4.8,
    reviewCount: 38,
    mascotSlot: "top",
    mascotAsset: "asset_ss_tees_5",
    featured: false,
    createdAt: "2026-11-03T15:29:11.801Z",
    updatedAt: "2026-11-03T15:29:11.801Z"
  },
  {
    _id: "prod_ss_10",
    title: "Pixel Quest 8-Bit Oversize Pop Art Graphic Tee #10",
    price: 62,
    originalPrice: 78,
    category: "tees",
    season: "SS26",
    collectionName: "Pixel Quest 8-Bit",
    description: "Spring/Summer 2026 edition from the Pixel Quest 8-Bit capsule. Crafted with breathable 250 GSM combed organic cotton. Built for warm-weather city movement with sweat-wicking treatment, reinforced seam binding, and signature 3D cartoon liquid pop-art graphics curated by KhanhBro.",
    images: [
      "https://res.cloudinary.com/dptpb60p7/image/upload/f_auto,q_auto/v1793891935/fashionwekk/masterpieces/pixel_quest_8bit.png",
      "https://res.cloudinary.com/dptpb60p7/image/upload/c_fill,w_800,h_1000,g_auto/f_auto,q_auto/v1793891935/fashionwekk/masterpieces/pixel_quest_8bit.png",
      "https://res.cloudinary.com/dptpb60p7/image/upload/c_crop,w_600,h_600,g_center/f_auto,q_auto/v1793891935/fashionwekk/masterpieces/pixel_quest_8bit.png"
    ],
    colors: [
      "Bone White",
      "Pop Magenta"
    ],
    sizes: [
      "S",
      "M",
      "L",
      "XL",
      "XXL"
    ],
    gsm: 250,
    stock: 35,
    isFlashSale: true,
    discountPercent: 20,
    tags: [
      "PixelArt",
      "SS26",
      "SpringSummer",
      "Streetwear",
      "FashionWekk",
      "KhanhBro",
      "tees"
    ],
    rating: 4.9,
    reviewCount: 38,
    mascotSlot: "top",
    mascotAsset: "asset_ss_tees_1",
    featured: false,
    createdAt: "2026-11-03T16:29:11.801Z",
    updatedAt: "2026-11-03T16:29:11.801Z"
  },
  {
    _id: "prod_ss_11",
    title: "Solar Flare Washed Oversize Pop Art Graphic Tee #11",
    price: 67,
    originalPrice: 67,
    category: "tees",
    season: "SS26",
    collectionName: "Solar Flare Washed",
    description: "Spring/Summer 2026 edition from the Solar Flare Washed capsule. Crafted with breathable 270 GSM combed organic cotton. Built for warm-weather city movement with sweat-wicking treatment, reinforced seam binding, and signature 3D cartoon liquid pop-art graphics curated by KhanhBro.",
    images: [
      "https://res.cloudinary.com/dptpb60p7/image/upload/f_auto,q_auto/v1793892087/fashionwekk/masterpieces/solar_flare_washed.png",
      "https://res.cloudinary.com/dptpb60p7/image/upload/c_fill,w_800,h_1000,g_auto/f_auto,q_auto/v1793892087/fashionwekk/masterpieces/solar_flare_washed.png",
      "https://res.cloudinary.com/dptpb60p7/image/upload/c_crop,w_600,h_600,g_center/f_auto,q_auto/v1793892087/fashionwekk/masterpieces/solar_flare_washed.png"
    ],
    colors: [
      "Neon Purple",
      "Hyper Green"
    ],
    sizes: [
      "S",
      "M",
      "L",
      "XL",
      "XXL"
    ],
    gsm: 270,
    stock: 35,
    isFlashSale: false,
    discountPercent: 0,
    tags: [
      "SolarFlare",
      "SS26",
      "SpringSummer",
      "Streetwear",
      "FashionWekk",
      "KhanhBro",
      "tees"
    ],
    rating: 4.9,
    reviewCount: 38,
    mascotSlot: "top",
    mascotAsset: "asset_ss_tees_2",
    featured: false,
    createdAt: "2026-11-03T17:29:11.801Z",
    updatedAt: "2026-11-03T17:29:11.801Z"
  },
  {
    _id: "prod_ss_12",
    title: "Synth Wave Sunset Oversize Pop Art Graphic Tee #12",
    price: 42,
    originalPrice: 42,
    category: "tees",
    season: "SS26",
    collectionName: "Synth Wave Sunset",
    description: "Spring/Summer 2026 edition from the Synth Wave Sunset capsule. Crafted with breathable 240 GSM combed organic cotton. Built for warm-weather city movement with sweat-wicking treatment, reinforced seam binding, and signature 3D cartoon liquid pop-art graphics curated by KhanhBro.",
    images: [
      "https://res.cloudinary.com/dptpb60p7/image/upload/f_auto,q_auto/v1793892122/fashionwekk/masterpieces/synth_wave_sunset.png",
      "https://res.cloudinary.com/dptpb60p7/image/upload/c_fill,w_800,h_1000,g_auto/f_auto,q_auto/v1793892122/fashionwekk/masterpieces/synth_wave_sunset.png",
      "https://res.cloudinary.com/dptpb60p7/image/upload/c_crop,w_600,h_600,g_center/f_auto,q_auto/v1793892122/fashionwekk/masterpieces/synth_wave_sunset.png"
    ],
    colors: [
      "Graphite Grey",
      "Comic Yellow"
    ],
    sizes: [
      "S",
      "M",
      "L",
      "XL",
      "XXL"
    ],
    gsm: 240,
    stock: 35,
    isFlashSale: false,
    discountPercent: 0,
    tags: [
      "SynthWave",
      "SS26",
      "SpringSummer",
      "Streetwear",
      "FashionWekk",
      "KhanhBro",
      "tees"
    ],
    rating: 4.7,
    reviewCount: 38,
    mascotSlot: "top",
    mascotAsset: "asset_ss_tees_3",
    featured: false,
    createdAt: "2026-11-03T18:29:11.801Z",
    updatedAt: "2026-11-03T18:29:11.801Z"
  },
  {
    _id: "prod_ss_13",
    title: "Chibi Harajuku Splash Oversize Pop Art Graphic Tee #13",
    price: 47,
    originalPrice: 47,
    category: "tees",
    season: "SS26",
    collectionName: "Chibi Harajuku Splash",
    description: "Spring/Summer 2026 edition from the Chibi Harajuku Splash capsule. Crafted with breathable 260 GSM combed organic cotton. Built for warm-weather city movement with sweat-wicking treatment, reinforced seam binding, and signature 3D cartoon liquid pop-art graphics curated by KhanhBro.",
    images: [
      "https://res.cloudinary.com/dptpb60p7/image/upload/f_auto,q_auto/v1793891791/fashionwekk/masterpieces/chibi_harajuku_splash.png",
      "https://res.cloudinary.com/dptpb60p7/image/upload/c_fill,w_800,h_1000,g_auto/f_auto,q_auto/v1793891791/fashionwekk/masterpieces/chibi_harajuku_splash.png",
      "https://res.cloudinary.com/dptpb60p7/image/upload/c_crop,w_600,h_600,g_center/f_auto,q_auto/v1793891791/fashionwekk/masterpieces/chibi_harajuku_splash.png"
    ],
    colors: [
      "Onyx Black",
      "Sunset Coral"
    ],
    sizes: [
      "S",
      "M",
      "L",
      "XL",
      "XXL"
    ],
    gsm: 260,
    stock: 35,
    isFlashSale: false,
    discountPercent: 0,
    tags: [
      "ChibiDrip",
      "SS26",
      "SpringSummer",
      "Streetwear",
      "FashionWekk",
      "KhanhBro",
      "tees"
    ],
    rating: 4.8,
    reviewCount: 38,
    mascotSlot: "top",
    mascotAsset: "asset_ss_tees_4",
    featured: false,
    createdAt: "2026-11-03T19:29:11.801Z",
    updatedAt: "2026-11-03T19:29:11.801Z"
  },
  {
    _id: "prod_ss_14",
    title: "Pixel Quest 8-Bit Oversize Pop Art Graphic Tee #14",
    price: 52,
    originalPrice: 52,
    category: "tees",
    season: "SS26",
    collectionName: "Pixel Quest 8-Bit",
    description: "Spring/Summer 2026 edition from the Pixel Quest 8-Bit capsule. Crafted with breathable 250 GSM combed organic cotton. Built for warm-weather city movement with sweat-wicking treatment, reinforced seam binding, and signature 3D cartoon liquid pop-art graphics curated by KhanhBro.",
    images: [
      "https://res.cloudinary.com/dptpb60p7/image/upload/f_auto,q_auto/v1793891935/fashionwekk/masterpieces/pixel_quest_8bit.png",
      "https://res.cloudinary.com/dptpb60p7/image/upload/c_fill,w_800,h_1000,g_auto/f_auto,q_auto/v1793891935/fashionwekk/masterpieces/pixel_quest_8bit.png",
      "https://res.cloudinary.com/dptpb60p7/image/upload/c_crop,w_600,h_600,g_center/f_auto,q_auto/v1793891935/fashionwekk/masterpieces/pixel_quest_8bit.png"
    ],
    colors: [
      "Washed Charcoal",
      "Electric Cyan"
    ],
    sizes: [
      "S",
      "M",
      "L",
      "XL",
      "XXL"
    ],
    gsm: 250,
    stock: 35,
    isFlashSale: false,
    discountPercent: 0,
    tags: [
      "PixelArt",
      "SS26",
      "SpringSummer",
      "Streetwear",
      "FashionWekk",
      "KhanhBro",
      "tees"
    ],
    rating: 4.9,
    reviewCount: 38,
    mascotSlot: "top",
    mascotAsset: "asset_ss_tees_5",
    featured: false,
    createdAt: "2026-11-03T20:29:11.801Z",
    updatedAt: "2026-11-03T20:29:11.801Z"
  },
  {
    _id: "prod_ss_15",
    title: "Solar Flare Washed Oversize Pop Art Graphic Tee #15",
    price: 57,
    originalPrice: 71,
    category: "tees",
    season: "SS26",
    collectionName: "Solar Flare Washed",
    description: "Spring/Summer 2026 edition from the Solar Flare Washed capsule. Crafted with breathable 270 GSM combed organic cotton. Built for warm-weather city movement with sweat-wicking treatment, reinforced seam binding, and signature 3D cartoon liquid pop-art graphics curated by KhanhBro.",
    images: [
      "https://res.cloudinary.com/dptpb60p7/image/upload/f_auto,q_auto/v1793892087/fashionwekk/masterpieces/solar_flare_washed.png",
      "https://res.cloudinary.com/dptpb60p7/image/upload/c_fill,w_800,h_1000,g_auto/f_auto,q_auto/v1793892087/fashionwekk/masterpieces/solar_flare_washed.png",
      "https://res.cloudinary.com/dptpb60p7/image/upload/c_crop,w_600,h_600,g_center/f_auto,q_auto/v1793892087/fashionwekk/masterpieces/solar_flare_washed.png"
    ],
    colors: [
      "Deep Lavender",
      "Shadow Black"
    ],
    sizes: [
      "S",
      "M",
      "L",
      "XL",
      "XXL"
    ],
    gsm: 270,
    stock: 35,
    isFlashSale: true,
    discountPercent: 20,
    tags: [
      "SolarFlare",
      "SS26",
      "SpringSummer",
      "Streetwear",
      "FashionWekk",
      "KhanhBro",
      "tees"
    ],
    rating: 4.9,
    reviewCount: 38,
    mascotSlot: "top",
    mascotAsset: "asset_ss_tees_1",
    featured: false,
    createdAt: "2026-11-03T21:29:11.801Z",
    updatedAt: "2026-11-03T21:29:11.801Z"
  },
  {
    _id: "prod_ss_16",
    title: "Synth Wave Sunset Oversize Pop Art Graphic Tee #16",
    price: 62,
    originalPrice: 62,
    category: "tees",
    season: "SS26",
    collectionName: "Synth Wave Sunset",
    description: "Spring/Summer 2026 edition from the Synth Wave Sunset capsule. Crafted with breathable 240 GSM combed organic cotton. Built for warm-weather city movement with sweat-wicking treatment, reinforced seam binding, and signature 3D cartoon liquid pop-art graphics curated by KhanhBro.",
    images: [
      "https://res.cloudinary.com/dptpb60p7/image/upload/f_auto,q_auto/v1793892122/fashionwekk/masterpieces/synth_wave_sunset.png",
      "https://res.cloudinary.com/dptpb60p7/image/upload/c_fill,w_800,h_1000,g_auto/f_auto,q_auto/v1793892122/fashionwekk/masterpieces/synth_wave_sunset.png",
      "https://res.cloudinary.com/dptpb60p7/image/upload/c_crop,w_600,h_600,g_center/f_auto,q_auto/v1793892122/fashionwekk/masterpieces/synth_wave_sunset.png"
    ],
    colors: [
      "Bone White",
      "Pop Magenta"
    ],
    sizes: [
      "S",
      "M",
      "L",
      "XL",
      "XXL"
    ],
    gsm: 240,
    stock: 35,
    isFlashSale: false,
    discountPercent: 0,
    tags: [
      "SynthWave",
      "SS26",
      "SpringSummer",
      "Streetwear",
      "FashionWekk",
      "KhanhBro",
      "tees"
    ],
    rating: 4.7,
    reviewCount: 38,
    mascotSlot: "top",
    mascotAsset: "asset_ss_tees_2",
    featured: false,
    createdAt: "2026-11-03T22:29:11.801Z",
    updatedAt: "2026-11-03T22:29:11.801Z"
  },
  {
    _id: "prod_ss_17",
    title: "Chibi Harajuku Splash Oversize Pop Art Graphic Tee #17",
    price: 67,
    originalPrice: 67,
    category: "tees",
    season: "SS26",
    collectionName: "Chibi Harajuku Splash",
    description: "Spring/Summer 2026 edition from the Chibi Harajuku Splash capsule. Crafted with breathable 260 GSM combed organic cotton. Built for warm-weather city movement with sweat-wicking treatment, reinforced seam binding, and signature 3D cartoon liquid pop-art graphics curated by KhanhBro.",
    images: [
      "https://res.cloudinary.com/dptpb60p7/image/upload/f_auto,q_auto/v1793891791/fashionwekk/masterpieces/chibi_harajuku_splash.png",
      "https://res.cloudinary.com/dptpb60p7/image/upload/c_fill,w_800,h_1000,g_auto/f_auto,q_auto/v1793891791/fashionwekk/masterpieces/chibi_harajuku_splash.png",
      "https://res.cloudinary.com/dptpb60p7/image/upload/c_crop,w_600,h_600,g_center/f_auto,q_auto/v1793891791/fashionwekk/masterpieces/chibi_harajuku_splash.png"
    ],
    colors: [
      "Neon Purple",
      "Hyper Green"
    ],
    sizes: [
      "S",
      "M",
      "L",
      "XL",
      "XXL"
    ],
    gsm: 260,
    stock: 35,
    isFlashSale: false,
    discountPercent: 0,
    tags: [
      "ChibiDrip",
      "SS26",
      "SpringSummer",
      "Streetwear",
      "FashionWekk",
      "KhanhBro",
      "tees"
    ],
    rating: 4.8,
    reviewCount: 38,
    mascotSlot: "top",
    mascotAsset: "asset_ss_tees_3",
    featured: false,
    createdAt: "2026-11-03T23:29:11.801Z",
    updatedAt: "2026-11-03T23:29:11.801Z"
  },
  {
    _id: "prod_ss_18",
    title: "Pixel Quest 8-Bit Oversize Pop Art Graphic Tee #18",
    price: 42,
    originalPrice: 42,
    category: "tees",
    season: "SS26",
    collectionName: "Pixel Quest 8-Bit",
    description: "Spring/Summer 2026 edition from the Pixel Quest 8-Bit capsule. Crafted with breathable 250 GSM combed organic cotton. Built for warm-weather city movement with sweat-wicking treatment, reinforced seam binding, and signature 3D cartoon liquid pop-art graphics curated by KhanhBro.",
    images: [
      "https://res.cloudinary.com/dptpb60p7/image/upload/f_auto,q_auto/v1793891935/fashionwekk/masterpieces/pixel_quest_8bit.png",
      "https://res.cloudinary.com/dptpb60p7/image/upload/c_fill,w_800,h_1000,g_auto/f_auto,q_auto/v1793891935/fashionwekk/masterpieces/pixel_quest_8bit.png",
      "https://res.cloudinary.com/dptpb60p7/image/upload/c_crop,w_600,h_600,g_center/f_auto,q_auto/v1793891935/fashionwekk/masterpieces/pixel_quest_8bit.png"
    ],
    colors: [
      "Graphite Grey",
      "Comic Yellow"
    ],
    sizes: [
      "S",
      "M",
      "L",
      "XL",
      "XXL"
    ],
    gsm: 250,
    stock: 35,
    isFlashSale: false,
    discountPercent: 0,
    tags: [
      "PixelArt",
      "SS26",
      "SpringSummer",
      "Streetwear",
      "FashionWekk",
      "KhanhBro",
      "tees"
    ],
    rating: 4.9,
    reviewCount: 38,
    mascotSlot: "top",
    mascotAsset: "asset_ss_tees_4",
    featured: false,
    createdAt: "2026-11-04T00:29:11.801Z",
    updatedAt: "2026-11-04T00:29:11.801Z"
  },
  {
    _id: "prod_ss_19",
    title: "Solar Flare Washed Oversize Pop Art Graphic Tee #19",
    price: 47,
    originalPrice: 47,
    category: "tees",
    season: "SS26",
    collectionName: "Solar Flare Washed",
    description: "Spring/Summer 2026 edition from the Solar Flare Washed capsule. Crafted with breathable 270 GSM combed organic cotton. Built for warm-weather city movement with sweat-wicking treatment, reinforced seam binding, and signature 3D cartoon liquid pop-art graphics curated by KhanhBro.",
    images: [
      "https://res.cloudinary.com/dptpb60p7/image/upload/f_auto,q_auto/v1793892087/fashionwekk/masterpieces/solar_flare_washed.png",
      "https://res.cloudinary.com/dptpb60p7/image/upload/c_fill,w_800,h_1000,g_auto/f_auto,q_auto/v1793892087/fashionwekk/masterpieces/solar_flare_washed.png",
      "https://res.cloudinary.com/dptpb60p7/image/upload/c_crop,w_600,h_600,g_center/f_auto,q_auto/v1793892087/fashionwekk/masterpieces/solar_flare_washed.png"
    ],
    colors: [
      "Onyx Black",
      "Sunset Coral"
    ],
    sizes: [
      "S",
      "M",
      "L",
      "XL",
      "XXL"
    ],
    gsm: 270,
    stock: 35,
    isFlashSale: false,
    discountPercent: 0,
    tags: [
      "SolarFlare",
      "SS26",
      "SpringSummer",
      "Streetwear",
      "FashionWekk",
      "KhanhBro",
      "tees"
    ],
    rating: 4.9,
    reviewCount: 38,
    mascotSlot: "top",
    mascotAsset: "asset_ss_tees_5",
    featured: false,
    createdAt: "2026-11-04T01:29:11.801Z",
    updatedAt: "2026-11-04T01:29:11.801Z"
  },
  {
    _id: "prod_ss_20",
    title: "Synth Wave Sunset Oversize Pop Art Graphic Tee #20",
    price: 52,
    originalPrice: 65,
    category: "tees",
    season: "SS26",
    collectionName: "Synth Wave Sunset",
    description: "Spring/Summer 2026 edition from the Synth Wave Sunset capsule. Crafted with breathable 240 GSM combed organic cotton. Built for warm-weather city movement with sweat-wicking treatment, reinforced seam binding, and signature 3D cartoon liquid pop-art graphics curated by KhanhBro.",
    images: [
      "https://res.cloudinary.com/dptpb60p7/image/upload/f_auto,q_auto/v1793892122/fashionwekk/masterpieces/synth_wave_sunset.png",
      "https://res.cloudinary.com/dptpb60p7/image/upload/c_fill,w_800,h_1000,g_auto/f_auto,q_auto/v1793892122/fashionwekk/masterpieces/synth_wave_sunset.png",
      "https://res.cloudinary.com/dptpb60p7/image/upload/c_crop,w_600,h_600,g_center/f_auto,q_auto/v1793892122/fashionwekk/masterpieces/synth_wave_sunset.png"
    ],
    colors: [
      "Washed Charcoal",
      "Electric Cyan"
    ],
    sizes: [
      "S",
      "M",
      "L",
      "XL",
      "XXL"
    ],
    gsm: 240,
    stock: 35,
    isFlashSale: true,
    discountPercent: 20,
    tags: [
      "SynthWave",
      "SS26",
      "SpringSummer",
      "Streetwear",
      "FashionWekk",
      "KhanhBro",
      "tees"
    ],
    rating: 4.7,
    reviewCount: 38,
    mascotSlot: "top",
    mascotAsset: "asset_ss_tees_1",
    featured: false,
    createdAt: "2026-11-04T02:29:11.801Z",
    updatedAt: "2026-11-04T02:29:11.801Z"
  },
  {
    _id: "prod_ss_21",
    title: "Chibi Harajuku Splash Tactical Parachute Street Shorts #21",
    price: 83,
    originalPrice: 83,
    category: "bottoms",
    season: "SS26",
    collectionName: "Chibi Harajuku Splash",
    description: "Spring/Summer 2026 edition from the Chibi Harajuku Splash capsule. Crafted with breathable 260 GSM combed organic cotton. Built for warm-weather city movement with sweat-wicking treatment, reinforced seam binding, and signature 3D cartoon liquid pop-art graphics curated by KhanhBro.",
    images: [
      "https://res.cloudinary.com/dptpb60p7/image/upload/f_auto,q_auto/v1793891791/fashionwekk/masterpieces/chibi_harajuku_splash.png",
      "https://res.cloudinary.com/dptpb60p7/image/upload/c_fill,w_800,h_1000,g_auto/f_auto,q_auto/v1793891791/fashionwekk/masterpieces/chibi_harajuku_splash.png",
      "https://res.cloudinary.com/dptpb60p7/image/upload/c_crop,w_600,h_600,g_center/f_auto,q_auto/v1793891791/fashionwekk/masterpieces/chibi_harajuku_splash.png"
    ],
    colors: [
      "Deep Lavender",
      "Shadow Black"
    ],
    sizes: [
      "S",
      "M",
      "L",
      "XL",
      "XXL"
    ],
    gsm: 260,
    stock: 35,
    isFlashSale: false,
    discountPercent: 0,
    tags: [
      "ChibiDrip",
      "SS26",
      "SpringSummer",
      "Streetwear",
      "FashionWekk",
      "KhanhBro",
      "bottoms"
    ],
    rating: 4.8,
    reviewCount: 38,
    mascotSlot: "bottom",
    mascotAsset: "asset_ss_bottoms_2",
    featured: false,
    createdAt: "2026-11-04T03:29:11.801Z",
    updatedAt: "2026-11-04T03:29:11.801Z"
  },
  {
    _id: "prod_ss_22",
    title: "Pixel Quest 8-Bit Tactical Parachute Street Shorts #22",
    price: 88,
    originalPrice: 88,
    category: "bottoms",
    season: "SS26",
    collectionName: "Pixel Quest 8-Bit",
    description: "Spring/Summer 2026 edition from the Pixel Quest 8-Bit capsule. Crafted with breathable 250 GSM combed organic cotton. Built for warm-weather city movement with sweat-wicking treatment, reinforced seam binding, and signature 3D cartoon liquid pop-art graphics curated by KhanhBro.",
    images: [
      "https://res.cloudinary.com/dptpb60p7/image/upload/f_auto,q_auto/v1793891935/fashionwekk/masterpieces/pixel_quest_8bit.png",
      "https://res.cloudinary.com/dptpb60p7/image/upload/c_fill,w_800,h_1000,g_auto/f_auto,q_auto/v1793891935/fashionwekk/masterpieces/pixel_quest_8bit.png",
      "https://res.cloudinary.com/dptpb60p7/image/upload/c_crop,w_600,h_600,g_center/f_auto,q_auto/v1793891935/fashionwekk/masterpieces/pixel_quest_8bit.png"
    ],
    colors: [
      "Bone White",
      "Pop Magenta"
    ],
    sizes: [
      "S",
      "M",
      "L",
      "XL",
      "XXL"
    ],
    gsm: 250,
    stock: 35,
    isFlashSale: false,
    discountPercent: 0,
    tags: [
      "PixelArt",
      "SS26",
      "SpringSummer",
      "Streetwear",
      "FashionWekk",
      "KhanhBro",
      "bottoms"
    ],
    rating: 4.9,
    reviewCount: 38,
    mascotSlot: "bottom",
    mascotAsset: "asset_ss_bottoms_3",
    featured: false,
    createdAt: "2026-11-04T04:29:11.801Z",
    updatedAt: "2026-11-04T04:29:11.801Z"
  },
  {
    _id: "prod_ss_23",
    title: "Solar Flare Washed Tactical Parachute Street Shorts #23",
    price: 93,
    originalPrice: 93,
    category: "bottoms",
    season: "SS26",
    collectionName: "Solar Flare Washed",
    description: "Spring/Summer 2026 edition from the Solar Flare Washed capsule. Crafted with breathable 270 GSM combed organic cotton. Built for warm-weather city movement with sweat-wicking treatment, reinforced seam binding, and signature 3D cartoon liquid pop-art graphics curated by KhanhBro.",
    images: [
      "https://res.cloudinary.com/dptpb60p7/image/upload/f_auto,q_auto/v1793892087/fashionwekk/masterpieces/solar_flare_washed.png",
      "https://res.cloudinary.com/dptpb60p7/image/upload/c_fill,w_800,h_1000,g_auto/f_auto,q_auto/v1793892087/fashionwekk/masterpieces/solar_flare_washed.png",
      "https://res.cloudinary.com/dptpb60p7/image/upload/c_crop,w_600,h_600,g_center/f_auto,q_auto/v1793892087/fashionwekk/masterpieces/solar_flare_washed.png"
    ],
    colors: [
      "Neon Purple",
      "Hyper Green"
    ],
    sizes: [
      "S",
      "M",
      "L",
      "XL",
      "XXL"
    ],
    gsm: 270,
    stock: 35,
    isFlashSale: false,
    discountPercent: 0,
    tags: [
      "SolarFlare",
      "SS26",
      "SpringSummer",
      "Streetwear",
      "FashionWekk",
      "KhanhBro",
      "bottoms"
    ],
    rating: 4.9,
    reviewCount: 38,
    mascotSlot: "bottom",
    mascotAsset: "asset_ss_bottoms_4",
    featured: false,
    createdAt: "2026-11-04T05:29:11.801Z",
    updatedAt: "2026-11-04T05:29:11.801Z"
  },
  {
    _id: "prod_ss_24",
    title: "Synth Wave Sunset Tactical Parachute Street Shorts #24",
    price: 68,
    originalPrice: 68,
    category: "bottoms",
    season: "SS26",
    collectionName: "Synth Wave Sunset",
    description: "Spring/Summer 2026 edition from the Synth Wave Sunset capsule. Crafted with breathable 240 GSM combed organic cotton. Built for warm-weather city movement with sweat-wicking treatment, reinforced seam binding, and signature 3D cartoon liquid pop-art graphics curated by KhanhBro.",
    images: [
      "https://res.cloudinary.com/dptpb60p7/image/upload/f_auto,q_auto/v1793892122/fashionwekk/masterpieces/synth_wave_sunset.png",
      "https://res.cloudinary.com/dptpb60p7/image/upload/c_fill,w_800,h_1000,g_auto/f_auto,q_auto/v1793892122/fashionwekk/masterpieces/synth_wave_sunset.png",
      "https://res.cloudinary.com/dptpb60p7/image/upload/c_crop,w_600,h_600,g_center/f_auto,q_auto/v1793892122/fashionwekk/masterpieces/synth_wave_sunset.png"
    ],
    colors: [
      "Graphite Grey",
      "Comic Yellow"
    ],
    sizes: [
      "S",
      "M",
      "L",
      "XL",
      "XXL"
    ],
    gsm: 240,
    stock: 35,
    isFlashSale: false,
    discountPercent: 0,
    tags: [
      "SynthWave",
      "SS26",
      "SpringSummer",
      "Streetwear",
      "FashionWekk",
      "KhanhBro",
      "bottoms"
    ],
    rating: 4.7,
    reviewCount: 38,
    mascotSlot: "bottom",
    mascotAsset: "asset_ss_bottoms_5",
    featured: false,
    createdAt: "2026-11-04T06:29:11.801Z",
    updatedAt: "2026-11-04T06:29:11.801Z"
  },
  {
    _id: "prod_ss_25",
    title: "Chibi Harajuku Splash Tactical Parachute Street Shorts #25",
    price: 73,
    originalPrice: 91,
    category: "bottoms",
    season: "SS26",
    collectionName: "Chibi Harajuku Splash",
    description: "Spring/Summer 2026 edition from the Chibi Harajuku Splash capsule. Crafted with breathable 260 GSM combed organic cotton. Built for warm-weather city movement with sweat-wicking treatment, reinforced seam binding, and signature 3D cartoon liquid pop-art graphics curated by KhanhBro.",
    images: [
      "https://res.cloudinary.com/dptpb60p7/image/upload/f_auto,q_auto/v1793891791/fashionwekk/masterpieces/chibi_harajuku_splash.png",
      "https://res.cloudinary.com/dptpb60p7/image/upload/c_fill,w_800,h_1000,g_auto/f_auto,q_auto/v1793891791/fashionwekk/masterpieces/chibi_harajuku_splash.png",
      "https://res.cloudinary.com/dptpb60p7/image/upload/c_crop,w_600,h_600,g_center/f_auto,q_auto/v1793891791/fashionwekk/masterpieces/chibi_harajuku_splash.png"
    ],
    colors: [
      "Onyx Black",
      "Sunset Coral"
    ],
    sizes: [
      "S",
      "M",
      "L",
      "XL",
      "XXL"
    ],
    gsm: 260,
    stock: 35,
    isFlashSale: true,
    discountPercent: 20,
    tags: [
      "ChibiDrip",
      "SS26",
      "SpringSummer",
      "Streetwear",
      "FashionWekk",
      "KhanhBro",
      "bottoms"
    ],
    rating: 4.8,
    reviewCount: 38,
    mascotSlot: "bottom",
    mascotAsset: "asset_ss_bottoms_1",
    featured: false,
    createdAt: "2026-11-04T07:29:11.801Z",
    updatedAt: "2026-11-04T07:29:11.801Z"
  },
  {
    _id: "prod_ss_26",
    title: "Pixel Quest 8-Bit Tactical Parachute Street Shorts #26",
    price: 78,
    originalPrice: 78,
    category: "bottoms",
    season: "SS26",
    collectionName: "Pixel Quest 8-Bit",
    description: "Spring/Summer 2026 edition from the Pixel Quest 8-Bit capsule. Crafted with breathable 250 GSM combed organic cotton. Built for warm-weather city movement with sweat-wicking treatment, reinforced seam binding, and signature 3D cartoon liquid pop-art graphics curated by KhanhBro.",
    images: [
      "https://res.cloudinary.com/dptpb60p7/image/upload/f_auto,q_auto/v1793891935/fashionwekk/masterpieces/pixel_quest_8bit.png",
      "https://res.cloudinary.com/dptpb60p7/image/upload/c_fill,w_800,h_1000,g_auto/f_auto,q_auto/v1793891935/fashionwekk/masterpieces/pixel_quest_8bit.png",
      "https://res.cloudinary.com/dptpb60p7/image/upload/c_crop,w_600,h_600,g_center/f_auto,q_auto/v1793891935/fashionwekk/masterpieces/pixel_quest_8bit.png"
    ],
    colors: [
      "Washed Charcoal",
      "Electric Cyan"
    ],
    sizes: [
      "S",
      "M",
      "L",
      "XL",
      "XXL"
    ],
    gsm: 250,
    stock: 35,
    isFlashSale: false,
    discountPercent: 0,
    tags: [
      "PixelArt",
      "SS26",
      "SpringSummer",
      "Streetwear",
      "FashionWekk",
      "KhanhBro",
      "bottoms"
    ],
    rating: 4.9,
    reviewCount: 38,
    mascotSlot: "bottom",
    mascotAsset: "asset_ss_bottoms_2",
    featured: false,
    createdAt: "2026-11-04T08:29:11.801Z",
    updatedAt: "2026-11-04T08:29:11.801Z"
  },
  {
    _id: "prod_ss_27",
    title: "Solar Flare Washed Tactical Parachute Street Shorts #27",
    price: 83,
    originalPrice: 83,
    category: "bottoms",
    season: "SS26",
    collectionName: "Solar Flare Washed",
    description: "Spring/Summer 2026 edition from the Solar Flare Washed capsule. Crafted with breathable 270 GSM combed organic cotton. Built for warm-weather city movement with sweat-wicking treatment, reinforced seam binding, and signature 3D cartoon liquid pop-art graphics curated by KhanhBro.",
    images: [
      "https://res.cloudinary.com/dptpb60p7/image/upload/f_auto,q_auto/v1793892087/fashionwekk/masterpieces/solar_flare_washed.png",
      "https://res.cloudinary.com/dptpb60p7/image/upload/c_fill,w_800,h_1000,g_auto/f_auto,q_auto/v1793892087/fashionwekk/masterpieces/solar_flare_washed.png",
      "https://res.cloudinary.com/dptpb60p7/image/upload/c_crop,w_600,h_600,g_center/f_auto,q_auto/v1793892087/fashionwekk/masterpieces/solar_flare_washed.png"
    ],
    colors: [
      "Deep Lavender",
      "Shadow Black"
    ],
    sizes: [
      "S",
      "M",
      "L",
      "XL",
      "XXL"
    ],
    gsm: 270,
    stock: 35,
    isFlashSale: false,
    discountPercent: 0,
    tags: [
      "SolarFlare",
      "SS26",
      "SpringSummer",
      "Streetwear",
      "FashionWekk",
      "KhanhBro",
      "bottoms"
    ],
    rating: 4.9,
    reviewCount: 38,
    mascotSlot: "bottom",
    mascotAsset: "asset_ss_bottoms_3",
    featured: false,
    createdAt: "2026-11-04T09:29:11.801Z",
    updatedAt: "2026-11-04T09:29:11.801Z"
  },
  {
    _id: "prod_ss_28",
    title: "Synth Wave Sunset Tactical Parachute Street Shorts #28",
    price: 88,
    originalPrice: 88,
    category: "bottoms",
    season: "SS26",
    collectionName: "Synth Wave Sunset",
    description: "Spring/Summer 2026 edition from the Synth Wave Sunset capsule. Crafted with breathable 240 GSM combed organic cotton. Built for warm-weather city movement with sweat-wicking treatment, reinforced seam binding, and signature 3D cartoon liquid pop-art graphics curated by KhanhBro.",
    images: [
      "https://res.cloudinary.com/dptpb60p7/image/upload/f_auto,q_auto/v1793892122/fashionwekk/masterpieces/synth_wave_sunset.png",
      "https://res.cloudinary.com/dptpb60p7/image/upload/c_fill,w_800,h_1000,g_auto/f_auto,q_auto/v1793892122/fashionwekk/masterpieces/synth_wave_sunset.png",
      "https://res.cloudinary.com/dptpb60p7/image/upload/c_crop,w_600,h_600,g_center/f_auto,q_auto/v1793892122/fashionwekk/masterpieces/synth_wave_sunset.png"
    ],
    colors: [
      "Bone White",
      "Pop Magenta"
    ],
    sizes: [
      "S",
      "M",
      "L",
      "XL",
      "XXL"
    ],
    gsm: 240,
    stock: 35,
    isFlashSale: false,
    discountPercent: 0,
    tags: [
      "SynthWave",
      "SS26",
      "SpringSummer",
      "Streetwear",
      "FashionWekk",
      "KhanhBro",
      "bottoms"
    ],
    rating: 4.7,
    reviewCount: 38,
    mascotSlot: "bottom",
    mascotAsset: "asset_ss_bottoms_4",
    featured: false,
    createdAt: "2026-11-04T10:29:11.801Z",
    updatedAt: "2026-11-04T10:29:11.801Z"
  },
  {
    _id: "prod_ss_29",
    title: "Chibi Harajuku Splash Tactical Parachute Street Shorts #29",
    price: 93,
    originalPrice: 93,
    category: "bottoms",
    season: "SS26",
    collectionName: "Chibi Harajuku Splash",
    description: "Spring/Summer 2026 edition from the Chibi Harajuku Splash capsule. Crafted with breathable 260 GSM combed organic cotton. Built for warm-weather city movement with sweat-wicking treatment, reinforced seam binding, and signature 3D cartoon liquid pop-art graphics curated by KhanhBro.",
    images: [
      "https://res.cloudinary.com/dptpb60p7/image/upload/f_auto,q_auto/v1793891791/fashionwekk/masterpieces/chibi_harajuku_splash.png",
      "https://res.cloudinary.com/dptpb60p7/image/upload/c_fill,w_800,h_1000,g_auto/f_auto,q_auto/v1793891791/fashionwekk/masterpieces/chibi_harajuku_splash.png",
      "https://res.cloudinary.com/dptpb60p7/image/upload/c_crop,w_600,h_600,g_center/f_auto,q_auto/v1793891791/fashionwekk/masterpieces/chibi_harajuku_splash.png"
    ],
    colors: [
      "Neon Purple",
      "Hyper Green"
    ],
    sizes: [
      "S",
      "M",
      "L",
      "XL",
      "XXL"
    ],
    gsm: 260,
    stock: 35,
    isFlashSale: false,
    discountPercent: 0,
    tags: [
      "ChibiDrip",
      "SS26",
      "SpringSummer",
      "Streetwear",
      "FashionWekk",
      "KhanhBro",
      "bottoms"
    ],
    rating: 4.8,
    reviewCount: 38,
    mascotSlot: "bottom",
    mascotAsset: "asset_ss_bottoms_5",
    featured: false,
    createdAt: "2026-11-04T11:29:11.801Z",
    updatedAt: "2026-11-04T11:29:11.801Z"
  },
  {
    _id: "prod_ss_30",
    title: "Pixel Quest 8-Bit Tactical Parachute Street Shorts #30",
    price: 68,
    originalPrice: 85,
    category: "bottoms",
    season: "SS26",
    collectionName: "Pixel Quest 8-Bit",
    description: "Spring/Summer 2026 edition from the Pixel Quest 8-Bit capsule. Crafted with breathable 250 GSM combed organic cotton. Built for warm-weather city movement with sweat-wicking treatment, reinforced seam binding, and signature 3D cartoon liquid pop-art graphics curated by KhanhBro.",
    images: [
      "https://res.cloudinary.com/dptpb60p7/image/upload/f_auto,q_auto/v1793891935/fashionwekk/masterpieces/pixel_quest_8bit.png",
      "https://res.cloudinary.com/dptpb60p7/image/upload/c_fill,w_800,h_1000,g_auto/f_auto,q_auto/v1793891935/fashionwekk/masterpieces/pixel_quest_8bit.png",
      "https://res.cloudinary.com/dptpb60p7/image/upload/c_crop,w_600,h_600,g_center/f_auto,q_auto/v1793891935/fashionwekk/masterpieces/pixel_quest_8bit.png"
    ],
    colors: [
      "Graphite Grey",
      "Comic Yellow"
    ],
    sizes: [
      "S",
      "M",
      "L",
      "XL",
      "XXL"
    ],
    gsm: 250,
    stock: 35,
    isFlashSale: true,
    discountPercent: 20,
    tags: [
      "PixelArt",
      "SS26",
      "SpringSummer",
      "Streetwear",
      "FashionWekk",
      "KhanhBro",
      "bottoms"
    ],
    rating: 4.9,
    reviewCount: 38,
    mascotSlot: "bottom",
    mascotAsset: "asset_ss_bottoms_1",
    featured: false,
    createdAt: "2026-11-04T12:29:11.801Z",
    updatedAt: "2026-11-04T12:29:11.801Z"
  },
  {
    _id: "prod_ss_31",
    title: "Solar Flare Washed Tactical Parachute Street Shorts #31",
    price: 73,
    originalPrice: 73,
    category: "bottoms",
    season: "SS26",
    collectionName: "Solar Flare Washed",
    description: "Spring/Summer 2026 edition from the Solar Flare Washed capsule. Crafted with breathable 270 GSM combed organic cotton. Built for warm-weather city movement with sweat-wicking treatment, reinforced seam binding, and signature 3D cartoon liquid pop-art graphics curated by KhanhBro.",
    images: [
      "https://res.cloudinary.com/dptpb60p7/image/upload/f_auto,q_auto/v1793892087/fashionwekk/masterpieces/solar_flare_washed.png",
      "https://res.cloudinary.com/dptpb60p7/image/upload/c_fill,w_800,h_1000,g_auto/f_auto,q_auto/v1793892087/fashionwekk/masterpieces/solar_flare_washed.png",
      "https://res.cloudinary.com/dptpb60p7/image/upload/c_crop,w_600,h_600,g_center/f_auto,q_auto/v1793892087/fashionwekk/masterpieces/solar_flare_washed.png"
    ],
    colors: [
      "Onyx Black",
      "Sunset Coral"
    ],
    sizes: [
      "S",
      "M",
      "L",
      "XL",
      "XXL"
    ],
    gsm: 270,
    stock: 35,
    isFlashSale: false,
    discountPercent: 0,
    tags: [
      "SolarFlare",
      "SS26",
      "SpringSummer",
      "Streetwear",
      "FashionWekk",
      "KhanhBro",
      "bottoms"
    ],
    rating: 4.9,
    reviewCount: 38,
    mascotSlot: "bottom",
    mascotAsset: "asset_ss_bottoms_2",
    featured: false,
    createdAt: "2026-11-04T13:29:11.801Z",
    updatedAt: "2026-11-04T13:29:11.801Z"
  },
  {
    _id: "prod_ss_32",
    title: "Synth Wave Sunset Tactical Parachute Street Shorts #32",
    price: 78,
    originalPrice: 78,
    category: "bottoms",
    season: "SS26",
    collectionName: "Synth Wave Sunset",
    description: "Spring/Summer 2026 edition from the Synth Wave Sunset capsule. Crafted with breathable 240 GSM combed organic cotton. Built for warm-weather city movement with sweat-wicking treatment, reinforced seam binding, and signature 3D cartoon liquid pop-art graphics curated by KhanhBro.",
    images: [
      "https://res.cloudinary.com/dptpb60p7/image/upload/f_auto,q_auto/v1793892122/fashionwekk/masterpieces/synth_wave_sunset.png",
      "https://res.cloudinary.com/dptpb60p7/image/upload/c_fill,w_800,h_1000,g_auto/f_auto,q_auto/v1793892122/fashionwekk/masterpieces/synth_wave_sunset.png",
      "https://res.cloudinary.com/dptpb60p7/image/upload/c_crop,w_600,h_600,g_center/f_auto,q_auto/v1793892122/fashionwekk/masterpieces/synth_wave_sunset.png"
    ],
    colors: [
      "Washed Charcoal",
      "Electric Cyan"
    ],
    sizes: [
      "S",
      "M",
      "L",
      "XL",
      "XXL"
    ],
    gsm: 240,
    stock: 35,
    isFlashSale: false,
    discountPercent: 0,
    tags: [
      "SynthWave",
      "SS26",
      "SpringSummer",
      "Streetwear",
      "FashionWekk",
      "KhanhBro",
      "bottoms"
    ],
    rating: 4.7,
    reviewCount: 38,
    mascotSlot: "bottom",
    mascotAsset: "asset_ss_bottoms_3",
    featured: false,
    createdAt: "2026-11-04T14:29:11.801Z",
    updatedAt: "2026-11-04T14:29:11.801Z"
  },
  {
    _id: "prod_ss_33",
    title: "Chibi Harajuku Splash Tactical Parachute Street Shorts #33",
    price: 83,
    originalPrice: 83,
    category: "bottoms",
    season: "SS26",
    collectionName: "Chibi Harajuku Splash",
    description: "Spring/Summer 2026 edition from the Chibi Harajuku Splash capsule. Crafted with breathable 260 GSM combed organic cotton. Built for warm-weather city movement with sweat-wicking treatment, reinforced seam binding, and signature 3D cartoon liquid pop-art graphics curated by KhanhBro.",
    images: [
      "https://res.cloudinary.com/dptpb60p7/image/upload/f_auto,q_auto/v1793891791/fashionwekk/masterpieces/chibi_harajuku_splash.png",
      "https://res.cloudinary.com/dptpb60p7/image/upload/c_fill,w_800,h_1000,g_auto/f_auto,q_auto/v1793891791/fashionwekk/masterpieces/chibi_harajuku_splash.png",
      "https://res.cloudinary.com/dptpb60p7/image/upload/c_crop,w_600,h_600,g_center/f_auto,q_auto/v1793891791/fashionwekk/masterpieces/chibi_harajuku_splash.png"
    ],
    colors: [
      "Deep Lavender",
      "Shadow Black"
    ],
    sizes: [
      "S",
      "M",
      "L",
      "XL",
      "XXL"
    ],
    gsm: 260,
    stock: 35,
    isFlashSale: false,
    discountPercent: 0,
    tags: [
      "ChibiDrip",
      "SS26",
      "SpringSummer",
      "Streetwear",
      "FashionWekk",
      "KhanhBro",
      "bottoms"
    ],
    rating: 4.8,
    reviewCount: 38,
    mascotSlot: "bottom",
    mascotAsset: "asset_ss_bottoms_4",
    featured: false,
    createdAt: "2026-11-04T15:29:11.801Z",
    updatedAt: "2026-11-04T15:29:11.801Z"
  },
  {
    _id: "prod_ss_34",
    title: "Pixel Quest 8-Bit Tactical Parachute Street Shorts #34",
    price: 88,
    originalPrice: 88,
    category: "bottoms",
    season: "SS26",
    collectionName: "Pixel Quest 8-Bit",
    description: "Spring/Summer 2026 edition from the Pixel Quest 8-Bit capsule. Crafted with breathable 250 GSM combed organic cotton. Built for warm-weather city movement with sweat-wicking treatment, reinforced seam binding, and signature 3D cartoon liquid pop-art graphics curated by KhanhBro.",
    images: [
      "https://res.cloudinary.com/dptpb60p7/image/upload/f_auto,q_auto/v1793891935/fashionwekk/masterpieces/pixel_quest_8bit.png",
      "https://res.cloudinary.com/dptpb60p7/image/upload/c_fill,w_800,h_1000,g_auto/f_auto,q_auto/v1793891935/fashionwekk/masterpieces/pixel_quest_8bit.png",
      "https://res.cloudinary.com/dptpb60p7/image/upload/c_crop,w_600,h_600,g_center/f_auto,q_auto/v1793891935/fashionwekk/masterpieces/pixel_quest_8bit.png"
    ],
    colors: [
      "Bone White",
      "Pop Magenta"
    ],
    sizes: [
      "S",
      "M",
      "L",
      "XL",
      "XXL"
    ],
    gsm: 250,
    stock: 35,
    isFlashSale: false,
    discountPercent: 0,
    tags: [
      "PixelArt",
      "SS26",
      "SpringSummer",
      "Streetwear",
      "FashionWekk",
      "KhanhBro",
      "bottoms"
    ],
    rating: 4.9,
    reviewCount: 38,
    mascotSlot: "bottom",
    mascotAsset: "asset_ss_bottoms_5",
    featured: false,
    createdAt: "2026-11-04T16:29:11.801Z",
    updatedAt: "2026-11-04T16:29:11.801Z"
  },
  {
    _id: "prod_ss_35",
    title: "Solar Flare Washed Tactical Parachute Street Shorts #35",
    price: 93,
    originalPrice: 116,
    category: "bottoms",
    season: "SS26",
    collectionName: "Solar Flare Washed",
    description: "Spring/Summer 2026 edition from the Solar Flare Washed capsule. Crafted with breathable 270 GSM combed organic cotton. Built for warm-weather city movement with sweat-wicking treatment, reinforced seam binding, and signature 3D cartoon liquid pop-art graphics curated by KhanhBro.",
    images: [
      "https://res.cloudinary.com/dptpb60p7/image/upload/f_auto,q_auto/v1793892087/fashionwekk/masterpieces/solar_flare_washed.png",
      "https://res.cloudinary.com/dptpb60p7/image/upload/c_fill,w_800,h_1000,g_auto/f_auto,q_auto/v1793892087/fashionwekk/masterpieces/solar_flare_washed.png",
      "https://res.cloudinary.com/dptpb60p7/image/upload/c_crop,w_600,h_600,g_center/f_auto,q_auto/v1793892087/fashionwekk/masterpieces/solar_flare_washed.png"
    ],
    colors: [
      "Neon Purple",
      "Hyper Green"
    ],
    sizes: [
      "S",
      "M",
      "L",
      "XL",
      "XXL"
    ],
    gsm: 270,
    stock: 35,
    isFlashSale: true,
    discountPercent: 20,
    tags: [
      "SolarFlare",
      "SS26",
      "SpringSummer",
      "Streetwear",
      "FashionWekk",
      "KhanhBro",
      "bottoms"
    ],
    rating: 4.9,
    reviewCount: 38,
    mascotSlot: "bottom",
    mascotAsset: "asset_ss_bottoms_1",
    featured: false,
    createdAt: "2026-11-04T17:29:11.801Z",
    updatedAt: "2026-11-04T17:29:11.801Z"
  },
  {
    _id: "prod_ss_36",
    title: "Synth Wave Sunset Packable UV Shield Windbreaker #36",
    price: 95,
    originalPrice: 95,
    category: "outerwear",
    season: "SS26",
    collectionName: "Synth Wave Sunset",
    description: "Spring/Summer 2026 edition from the Synth Wave Sunset capsule. Crafted with breathable 240 GSM combed organic cotton. Built for warm-weather city movement with sweat-wicking treatment, reinforced seam binding, and signature 3D cartoon liquid pop-art graphics curated by KhanhBro.",
    images: [
      "https://res.cloudinary.com/dptpb60p7/image/upload/f_auto,q_auto/v1793892122/fashionwekk/masterpieces/synth_wave_sunset.png",
      "https://res.cloudinary.com/dptpb60p7/image/upload/c_fill,w_800,h_1000,g_auto/f_auto,q_auto/v1793892122/fashionwekk/masterpieces/synth_wave_sunset.png",
      "https://res.cloudinary.com/dptpb60p7/image/upload/c_crop,w_600,h_600,g_center/f_auto,q_auto/v1793892122/fashionwekk/masterpieces/synth_wave_sunset.png"
    ],
    colors: [
      "Graphite Grey",
      "Comic Yellow"
    ],
    sizes: [
      "S",
      "M",
      "L",
      "XL",
      "XXL"
    ],
    gsm: 240,
    stock: 35,
    isFlashSale: false,
    discountPercent: 0,
    tags: [
      "SynthWave",
      "SS26",
      "SpringSummer",
      "Streetwear",
      "FashionWekk",
      "KhanhBro",
      "outerwear"
    ],
    rating: 4.7,
    reviewCount: 38,
    mascotSlot: "top",
    mascotAsset: "asset_ss_outerwear_2",
    featured: false,
    createdAt: "2026-11-04T18:29:11.801Z",
    updatedAt: "2026-11-04T18:29:11.801Z"
  },
  {
    _id: "prod_ss_37",
    title: "Chibi Harajuku Splash Packable UV Shield Windbreaker #37",
    price: 100,
    originalPrice: 100,
    category: "outerwear",
    season: "SS26",
    collectionName: "Chibi Harajuku Splash",
    description: "Spring/Summer 2026 edition from the Chibi Harajuku Splash capsule. Crafted with breathable 260 GSM combed organic cotton. Built for warm-weather city movement with sweat-wicking treatment, reinforced seam binding, and signature 3D cartoon liquid pop-art graphics curated by KhanhBro.",
    images: [
      "https://res.cloudinary.com/dptpb60p7/image/upload/f_auto,q_auto/v1793891791/fashionwekk/masterpieces/chibi_harajuku_splash.png",
      "https://res.cloudinary.com/dptpb60p7/image/upload/c_fill,w_800,h_1000,g_auto/f_auto,q_auto/v1793891791/fashionwekk/masterpieces/chibi_harajuku_splash.png",
      "https://res.cloudinary.com/dptpb60p7/image/upload/c_crop,w_600,h_600,g_center/f_auto,q_auto/v1793891791/fashionwekk/masterpieces/chibi_harajuku_splash.png"
    ],
    colors: [
      "Onyx Black",
      "Sunset Coral"
    ],
    sizes: [
      "S",
      "M",
      "L",
      "XL",
      "XXL"
    ],
    gsm: 260,
    stock: 35,
    isFlashSale: false,
    discountPercent: 0,
    tags: [
      "ChibiDrip",
      "SS26",
      "SpringSummer",
      "Streetwear",
      "FashionWekk",
      "KhanhBro",
      "outerwear"
    ],
    rating: 4.8,
    reviewCount: 38,
    mascotSlot: "top",
    mascotAsset: "asset_ss_outerwear_3",
    featured: false,
    createdAt: "2026-11-04T19:29:11.801Z",
    updatedAt: "2026-11-04T19:29:11.801Z"
  },
  {
    _id: "prod_ss_38",
    title: "Pixel Quest 8-Bit Packable UV Shield Windbreaker #38",
    price: 105,
    originalPrice: 105,
    category: "outerwear",
    season: "SS26",
    collectionName: "Pixel Quest 8-Bit",
    description: "Spring/Summer 2026 edition from the Pixel Quest 8-Bit capsule. Crafted with breathable 250 GSM combed organic cotton. Built for warm-weather city movement with sweat-wicking treatment, reinforced seam binding, and signature 3D cartoon liquid pop-art graphics curated by KhanhBro.",
    images: [
      "https://res.cloudinary.com/dptpb60p7/image/upload/f_auto,q_auto/v1793891935/fashionwekk/masterpieces/pixel_quest_8bit.png",
      "https://res.cloudinary.com/dptpb60p7/image/upload/c_fill,w_800,h_1000,g_auto/f_auto,q_auto/v1793891935/fashionwekk/masterpieces/pixel_quest_8bit.png",
      "https://res.cloudinary.com/dptpb60p7/image/upload/c_crop,w_600,h_600,g_center/f_auto,q_auto/v1793891935/fashionwekk/masterpieces/pixel_quest_8bit.png"
    ],
    colors: [
      "Washed Charcoal",
      "Electric Cyan"
    ],
    sizes: [
      "S",
      "M",
      "L",
      "XL",
      "XXL"
    ],
    gsm: 250,
    stock: 35,
    isFlashSale: false,
    discountPercent: 0,
    tags: [
      "PixelArt",
      "SS26",
      "SpringSummer",
      "Streetwear",
      "FashionWekk",
      "KhanhBro",
      "outerwear"
    ],
    rating: 4.9,
    reviewCount: 38,
    mascotSlot: "top",
    mascotAsset: "asset_ss_outerwear_4",
    featured: false,
    createdAt: "2026-11-04T20:29:11.801Z",
    updatedAt: "2026-11-04T20:29:11.801Z"
  },
  {
    _id: "prod_ss_39",
    title: "Solar Flare Washed Packable UV Shield Windbreaker #39",
    price: 110,
    originalPrice: 110,
    category: "outerwear",
    season: "SS26",
    collectionName: "Solar Flare Washed",
    description: "Spring/Summer 2026 edition from the Solar Flare Washed capsule. Crafted with breathable 270 GSM combed organic cotton. Built for warm-weather city movement with sweat-wicking treatment, reinforced seam binding, and signature 3D cartoon liquid pop-art graphics curated by KhanhBro.",
    images: [
      "https://res.cloudinary.com/dptpb60p7/image/upload/f_auto,q_auto/v1793892087/fashionwekk/masterpieces/solar_flare_washed.png",
      "https://res.cloudinary.com/dptpb60p7/image/upload/c_fill,w_800,h_1000,g_auto/f_auto,q_auto/v1793892087/fashionwekk/masterpieces/solar_flare_washed.png",
      "https://res.cloudinary.com/dptpb60p7/image/upload/c_crop,w_600,h_600,g_center/f_auto,q_auto/v1793892087/fashionwekk/masterpieces/solar_flare_washed.png"
    ],
    colors: [
      "Deep Lavender",
      "Shadow Black"
    ],
    sizes: [
      "S",
      "M",
      "L",
      "XL",
      "XXL"
    ],
    gsm: 270,
    stock: 35,
    isFlashSale: false,
    discountPercent: 0,
    tags: [
      "SolarFlare",
      "SS26",
      "SpringSummer",
      "Streetwear",
      "FashionWekk",
      "KhanhBro",
      "outerwear"
    ],
    rating: 4.9,
    reviewCount: 38,
    mascotSlot: "top",
    mascotAsset: "asset_ss_outerwear_5",
    featured: false,
    createdAt: "2026-11-04T21:29:11.801Z",
    updatedAt: "2026-11-04T21:29:11.801Z"
  },
  {
    _id: "prod_ss_40",
    title: "Synth Wave Sunset Packable UV Shield Windbreaker #40",
    price: 115,
    originalPrice: 144,
    category: "outerwear",
    season: "SS26",
    collectionName: "Synth Wave Sunset",
    description: "Spring/Summer 2026 edition from the Synth Wave Sunset capsule. Crafted with breathable 240 GSM combed organic cotton. Built for warm-weather city movement with sweat-wicking treatment, reinforced seam binding, and signature 3D cartoon liquid pop-art graphics curated by KhanhBro.",
    images: [
      "https://res.cloudinary.com/dptpb60p7/image/upload/f_auto,q_auto/v1793892122/fashionwekk/masterpieces/synth_wave_sunset.png",
      "https://res.cloudinary.com/dptpb60p7/image/upload/c_fill,w_800,h_1000,g_auto/f_auto,q_auto/v1793892122/fashionwekk/masterpieces/synth_wave_sunset.png",
      "https://res.cloudinary.com/dptpb60p7/image/upload/c_crop,w_600,h_600,g_center/f_auto,q_auto/v1793892122/fashionwekk/masterpieces/synth_wave_sunset.png"
    ],
    colors: [
      "Bone White",
      "Pop Magenta"
    ],
    sizes: [
      "S",
      "M",
      "L",
      "XL",
      "XXL"
    ],
    gsm: 240,
    stock: 35,
    isFlashSale: true,
    discountPercent: 20,
    tags: [
      "SynthWave",
      "SS26",
      "SpringSummer",
      "Streetwear",
      "FashionWekk",
      "KhanhBro",
      "outerwear"
    ],
    rating: 4.7,
    reviewCount: 38,
    mascotSlot: "top",
    mascotAsset: "asset_ss_outerwear_1",
    featured: false,
    createdAt: "2026-11-04T22:29:11.801Z",
    updatedAt: "2026-11-04T22:29:11.801Z"
  },
  {
    _id: "prod_ss_41",
    title: "Chibi Harajuku Splash Packable UV Shield Windbreaker #41",
    price: 120,
    originalPrice: 120,
    category: "outerwear",
    season: "SS26",
    collectionName: "Chibi Harajuku Splash",
    description: "Spring/Summer 2026 edition from the Chibi Harajuku Splash capsule. Crafted with breathable 260 GSM combed organic cotton. Built for warm-weather city movement with sweat-wicking treatment, reinforced seam binding, and signature 3D cartoon liquid pop-art graphics curated by KhanhBro.",
    images: [
      "https://res.cloudinary.com/dptpb60p7/image/upload/f_auto,q_auto/v1793891791/fashionwekk/masterpieces/chibi_harajuku_splash.png",
      "https://res.cloudinary.com/dptpb60p7/image/upload/c_fill,w_800,h_1000,g_auto/f_auto,q_auto/v1793891791/fashionwekk/masterpieces/chibi_harajuku_splash.png",
      "https://res.cloudinary.com/dptpb60p7/image/upload/c_crop,w_600,h_600,g_center/f_auto,q_auto/v1793891791/fashionwekk/masterpieces/chibi_harajuku_splash.png"
    ],
    colors: [
      "Neon Purple",
      "Hyper Green"
    ],
    sizes: [
      "S",
      "M",
      "L",
      "XL",
      "XXL"
    ],
    gsm: 260,
    stock: 35,
    isFlashSale: false,
    discountPercent: 0,
    tags: [
      "ChibiDrip",
      "SS26",
      "SpringSummer",
      "Streetwear",
      "FashionWekk",
      "KhanhBro",
      "outerwear"
    ],
    rating: 4.8,
    reviewCount: 38,
    mascotSlot: "top",
    mascotAsset: "asset_ss_outerwear_2",
    featured: false,
    createdAt: "2026-11-04T23:29:11.801Z",
    updatedAt: "2026-11-04T23:29:11.801Z"
  },
  {
    _id: "prod_ss_42",
    title: "Pixel Quest 8-Bit Packable UV Shield Windbreaker #42",
    price: 95,
    originalPrice: 95,
    category: "outerwear",
    season: "SS26",
    collectionName: "Pixel Quest 8-Bit",
    description: "Spring/Summer 2026 edition from the Pixel Quest 8-Bit capsule. Crafted with breathable 250 GSM combed organic cotton. Built for warm-weather city movement with sweat-wicking treatment, reinforced seam binding, and signature 3D cartoon liquid pop-art graphics curated by KhanhBro.",
    images: [
      "https://res.cloudinary.com/dptpb60p7/image/upload/f_auto,q_auto/v1793891935/fashionwekk/masterpieces/pixel_quest_8bit.png",
      "https://res.cloudinary.com/dptpb60p7/image/upload/c_fill,w_800,h_1000,g_auto/f_auto,q_auto/v1793891935/fashionwekk/masterpieces/pixel_quest_8bit.png",
      "https://res.cloudinary.com/dptpb60p7/image/upload/c_crop,w_600,h_600,g_center/f_auto,q_auto/v1793891935/fashionwekk/masterpieces/pixel_quest_8bit.png"
    ],
    colors: [
      "Graphite Grey",
      "Comic Yellow"
    ],
    sizes: [
      "S",
      "M",
      "L",
      "XL",
      "XXL"
    ],
    gsm: 250,
    stock: 35,
    isFlashSale: false,
    discountPercent: 0,
    tags: [
      "PixelArt",
      "SS26",
      "SpringSummer",
      "Streetwear",
      "FashionWekk",
      "KhanhBro",
      "outerwear"
    ],
    rating: 4.9,
    reviewCount: 38,
    mascotSlot: "top",
    mascotAsset: "asset_ss_outerwear_3",
    featured: false,
    createdAt: "2026-11-05T00:29:11.801Z",
    updatedAt: "2026-11-05T00:29:11.801Z"
  },
  {
    _id: "prod_ss_43",
    title: "Solar Flare Washed Packable UV Shield Windbreaker #43",
    price: 100,
    originalPrice: 100,
    category: "outerwear",
    season: "SS26",
    collectionName: "Solar Flare Washed",
    description: "Spring/Summer 2026 edition from the Solar Flare Washed capsule. Crafted with breathable 270 GSM combed organic cotton. Built for warm-weather city movement with sweat-wicking treatment, reinforced seam binding, and signature 3D cartoon liquid pop-art graphics curated by KhanhBro.",
    images: [
      "https://res.cloudinary.com/dptpb60p7/image/upload/f_auto,q_auto/v1793892087/fashionwekk/masterpieces/solar_flare_washed.png",
      "https://res.cloudinary.com/dptpb60p7/image/upload/c_fill,w_800,h_1000,g_auto/f_auto,q_auto/v1793892087/fashionwekk/masterpieces/solar_flare_washed.png",
      "https://res.cloudinary.com/dptpb60p7/image/upload/c_crop,w_600,h_600,g_center/f_auto,q_auto/v1793892087/fashionwekk/masterpieces/solar_flare_washed.png"
    ],
    colors: [
      "Onyx Black",
      "Sunset Coral"
    ],
    sizes: [
      "S",
      "M",
      "L",
      "XL",
      "XXL"
    ],
    gsm: 270,
    stock: 35,
    isFlashSale: false,
    discountPercent: 0,
    tags: [
      "SolarFlare",
      "SS26",
      "SpringSummer",
      "Streetwear",
      "FashionWekk",
      "KhanhBro",
      "outerwear"
    ],
    rating: 4.9,
    reviewCount: 38,
    mascotSlot: "top",
    mascotAsset: "asset_ss_outerwear_4",
    featured: false,
    createdAt: "2026-11-05T01:29:11.801Z",
    updatedAt: "2026-11-05T01:29:11.801Z"
  },
  {
    _id: "prod_ss_44",
    title: "Synth Wave Sunset Packable UV Shield Windbreaker #44",
    price: 105,
    originalPrice: 105,
    category: "outerwear",
    season: "SS26",
    collectionName: "Synth Wave Sunset",
    description: "Spring/Summer 2026 edition from the Synth Wave Sunset capsule. Crafted with breathable 240 GSM combed organic cotton. Built for warm-weather city movement with sweat-wicking treatment, reinforced seam binding, and signature 3D cartoon liquid pop-art graphics curated by KhanhBro.",
    images: [
      "https://res.cloudinary.com/dptpb60p7/image/upload/f_auto,q_auto/v1793892122/fashionwekk/masterpieces/synth_wave_sunset.png",
      "https://res.cloudinary.com/dptpb60p7/image/upload/c_fill,w_800,h_1000,g_auto/f_auto,q_auto/v1793892122/fashionwekk/masterpieces/synth_wave_sunset.png",
      "https://res.cloudinary.com/dptpb60p7/image/upload/c_crop,w_600,h_600,g_center/f_auto,q_auto/v1793892122/fashionwekk/masterpieces/synth_wave_sunset.png"
    ],
    colors: [
      "Washed Charcoal",
      "Electric Cyan"
    ],
    sizes: [
      "S",
      "M",
      "L",
      "XL",
      "XXL"
    ],
    gsm: 240,
    stock: 35,
    isFlashSale: false,
    discountPercent: 0,
    tags: [
      "SynthWave",
      "SS26",
      "SpringSummer",
      "Streetwear",
      "FashionWekk",
      "KhanhBro",
      "outerwear"
    ],
    rating: 4.7,
    reviewCount: 38,
    mascotSlot: "top",
    mascotAsset: "asset_ss_outerwear_5",
    featured: false,
    createdAt: "2026-11-05T02:29:11.801Z",
    updatedAt: "2026-11-05T02:29:11.801Z"
  },
  {
    _id: "prod_ss_45",
    title: "Chibi Harajuku Splash Packable UV Shield Windbreaker #45",
    price: 110,
    originalPrice: 138,
    category: "outerwear",
    season: "SS26",
    collectionName: "Chibi Harajuku Splash",
    description: "Spring/Summer 2026 edition from the Chibi Harajuku Splash capsule. Crafted with breathable 260 GSM combed organic cotton. Built for warm-weather city movement with sweat-wicking treatment, reinforced seam binding, and signature 3D cartoon liquid pop-art graphics curated by KhanhBro.",
    images: [
      "https://res.cloudinary.com/dptpb60p7/image/upload/f_auto,q_auto/v1793891791/fashionwekk/masterpieces/chibi_harajuku_splash.png",
      "https://res.cloudinary.com/dptpb60p7/image/upload/c_fill,w_800,h_1000,g_auto/f_auto,q_auto/v1793891791/fashionwekk/masterpieces/chibi_harajuku_splash.png",
      "https://res.cloudinary.com/dptpb60p7/image/upload/c_crop,w_600,h_600,g_center/f_auto,q_auto/v1793891791/fashionwekk/masterpieces/chibi_harajuku_splash.png"
    ],
    colors: [
      "Deep Lavender",
      "Shadow Black"
    ],
    sizes: [
      "S",
      "M",
      "L",
      "XL",
      "XXL"
    ],
    gsm: 260,
    stock: 35,
    isFlashSale: true,
    discountPercent: 20,
    tags: [
      "ChibiDrip",
      "SS26",
      "SpringSummer",
      "Streetwear",
      "FashionWekk",
      "KhanhBro",
      "outerwear"
    ],
    rating: 4.8,
    reviewCount: 38,
    mascotSlot: "top",
    mascotAsset: "asset_ss_outerwear_1",
    featured: false,
    createdAt: "2026-11-05T03:29:11.801Z",
    updatedAt: "2026-11-05T03:29:11.801Z"
  },
  {
    _id: "prod_ss_46",
    title: "Pixel Quest 8-Bit Distressed 5-Panel Street Cap #46",
    price: 52,
    originalPrice: 52,
    category: "accessories",
    season: "SS26",
    collectionName: "Pixel Quest 8-Bit",
    description: "Spring/Summer 2026 edition from the Pixel Quest 8-Bit capsule. Crafted with breathable 250 GSM combed organic cotton. Built for warm-weather city movement with sweat-wicking treatment, reinforced seam binding, and signature 3D cartoon liquid pop-art graphics curated by KhanhBro.",
    images: [
      "https://res.cloudinary.com/dptpb60p7/image/upload/f_auto,q_auto/v1793891935/fashionwekk/masterpieces/pixel_quest_8bit.png",
      "https://res.cloudinary.com/dptpb60p7/image/upload/c_fill,w_800,h_1000,g_auto/f_auto,q_auto/v1793891935/fashionwekk/masterpieces/pixel_quest_8bit.png",
      "https://res.cloudinary.com/dptpb60p7/image/upload/c_crop,w_600,h_600,g_center/f_auto,q_auto/v1793891935/fashionwekk/masterpieces/pixel_quest_8bit.png"
    ],
    colors: [
      "Bone White",
      "Pop Magenta"
    ],
    sizes: [
      "One Size"
    ],
    gsm: 250,
    stock: 35,
    isFlashSale: false,
    discountPercent: 0,
    tags: [
      "PixelArt",
      "SS26",
      "SpringSummer",
      "Streetwear",
      "FashionWekk",
      "KhanhBro",
      "accessories"
    ],
    rating: 4.9,
    reviewCount: 38,
    mascotSlot: "head",
    mascotAsset: "asset_ss_accessories_2",
    featured: false,
    createdAt: "2026-11-05T04:29:11.801Z",
    updatedAt: "2026-11-05T04:29:11.801Z"
  },
  {
    _id: "prod_ss_47",
    title: "Solar Flare Washed Distressed 5-Panel Street Cap #47",
    price: 57,
    originalPrice: 57,
    category: "accessories",
    season: "SS26",
    collectionName: "Solar Flare Washed",
    description: "Spring/Summer 2026 edition from the Solar Flare Washed capsule. Crafted with breathable 270 GSM combed organic cotton. Built for warm-weather city movement with sweat-wicking treatment, reinforced seam binding, and signature 3D cartoon liquid pop-art graphics curated by KhanhBro.",
    images: [
      "https://res.cloudinary.com/dptpb60p7/image/upload/f_auto,q_auto/v1793892087/fashionwekk/masterpieces/solar_flare_washed.png",
      "https://res.cloudinary.com/dptpb60p7/image/upload/c_fill,w_800,h_1000,g_auto/f_auto,q_auto/v1793892087/fashionwekk/masterpieces/solar_flare_washed.png",
      "https://res.cloudinary.com/dptpb60p7/image/upload/c_crop,w_600,h_600,g_center/f_auto,q_auto/v1793892087/fashionwekk/masterpieces/solar_flare_washed.png"
    ],
    colors: [
      "Neon Purple",
      "Hyper Green"
    ],
    sizes: [
      "One Size"
    ],
    gsm: 270,
    stock: 35,
    isFlashSale: false,
    discountPercent: 0,
    tags: [
      "SolarFlare",
      "SS26",
      "SpringSummer",
      "Streetwear",
      "FashionWekk",
      "KhanhBro",
      "accessories"
    ],
    rating: 4.9,
    reviewCount: 38,
    mascotSlot: "head",
    mascotAsset: "asset_ss_accessories_3",
    featured: false,
    createdAt: "2026-11-05T05:29:11.801Z",
    updatedAt: "2026-11-05T05:29:11.801Z"
  },
  {
    _id: "prod_ss_48",
    title: "Synth Wave Sunset Distressed 5-Panel Street Cap #48",
    price: 32,
    originalPrice: 32,
    category: "accessories",
    season: "SS26",
    collectionName: "Synth Wave Sunset",
    description: "Spring/Summer 2026 edition from the Synth Wave Sunset capsule. Crafted with breathable 240 GSM combed organic cotton. Built for warm-weather city movement with sweat-wicking treatment, reinforced seam binding, and signature 3D cartoon liquid pop-art graphics curated by KhanhBro.",
    images: [
      "https://res.cloudinary.com/dptpb60p7/image/upload/f_auto,q_auto/v1793892122/fashionwekk/masterpieces/synth_wave_sunset.png",
      "https://res.cloudinary.com/dptpb60p7/image/upload/c_fill,w_800,h_1000,g_auto/f_auto,q_auto/v1793892122/fashionwekk/masterpieces/synth_wave_sunset.png",
      "https://res.cloudinary.com/dptpb60p7/image/upload/c_crop,w_600,h_600,g_center/f_auto,q_auto/v1793892122/fashionwekk/masterpieces/synth_wave_sunset.png"
    ],
    colors: [
      "Graphite Grey",
      "Comic Yellow"
    ],
    sizes: [
      "One Size"
    ],
    gsm: 240,
    stock: 35,
    isFlashSale: false,
    discountPercent: 0,
    tags: [
      "SynthWave",
      "SS26",
      "SpringSummer",
      "Streetwear",
      "FashionWekk",
      "KhanhBro",
      "accessories"
    ],
    rating: 4.7,
    reviewCount: 38,
    mascotSlot: "head",
    mascotAsset: "asset_ss_accessories_4",
    featured: false,
    createdAt: "2026-11-05T06:29:11.801Z",
    updatedAt: "2026-11-05T06:29:11.801Z"
  },
  {
    _id: "prod_ss_49",
    title: "Chibi Harajuku Splash Chunky Y2K Neon Jewelry Set #49",
    price: 37,
    originalPrice: 37,
    category: "accessories",
    season: "SS26",
    collectionName: "Chibi Harajuku Splash",
    description: "Spring/Summer 2026 edition from the Chibi Harajuku Splash capsule. Crafted with breathable 260 GSM combed organic cotton. Built for warm-weather city movement with sweat-wicking treatment, reinforced seam binding, and signature 3D cartoon liquid pop-art graphics curated by KhanhBro.",
    images: [
      "https://res.cloudinary.com/dptpb60p7/image/upload/f_auto,q_auto/v1793891791/fashionwekk/masterpieces/chibi_harajuku_splash.png",
      "https://res.cloudinary.com/dptpb60p7/image/upload/c_fill,w_800,h_1000,g_auto/f_auto,q_auto/v1793891791/fashionwekk/masterpieces/chibi_harajuku_splash.png",
      "https://res.cloudinary.com/dptpb60p7/image/upload/c_crop,w_600,h_600,g_center/f_auto,q_auto/v1793891791/fashionwekk/masterpieces/chibi_harajuku_splash.png"
    ],
    colors: [
      "Onyx Black",
      "Sunset Coral"
    ],
    sizes: [
      "One Size"
    ],
    gsm: 260,
    stock: 35,
    isFlashSale: false,
    discountPercent: 0,
    tags: [
      "ChibiDrip",
      "SS26",
      "SpringSummer",
      "Streetwear",
      "FashionWekk",
      "KhanhBro",
      "accessories"
    ],
    rating: 4.8,
    reviewCount: 38,
    mascotSlot: "accessory",
    mascotAsset: "asset_ss_accessories_5",
    featured: false,
    createdAt: "2026-11-05T07:29:11.801Z",
    updatedAt: "2026-11-05T07:29:11.801Z"
  },
  {
    _id: "prod_ss_50",
    title: "Pixel Quest 8-Bit Chunky Y2K Neon Jewelry Set #50",
    price: 42,
    originalPrice: 53,
    category: "accessories",
    season: "SS26",
    collectionName: "Pixel Quest 8-Bit",
    description: "Spring/Summer 2026 edition from the Pixel Quest 8-Bit capsule. Crafted with breathable 250 GSM combed organic cotton. Built for warm-weather city movement with sweat-wicking treatment, reinforced seam binding, and signature 3D cartoon liquid pop-art graphics curated by KhanhBro.",
    images: [
      "https://res.cloudinary.com/dptpb60p7/image/upload/f_auto,q_auto/v1793891935/fashionwekk/masterpieces/pixel_quest_8bit.png",
      "https://res.cloudinary.com/dptpb60p7/image/upload/c_fill,w_800,h_1000,g_auto/f_auto,q_auto/v1793891935/fashionwekk/masterpieces/pixel_quest_8bit.png",
      "https://res.cloudinary.com/dptpb60p7/image/upload/c_crop,w_600,h_600,g_center/f_auto,q_auto/v1793891935/fashionwekk/masterpieces/pixel_quest_8bit.png"
    ],
    colors: [
      "Washed Charcoal",
      "Electric Cyan"
    ],
    sizes: [
      "One Size"
    ],
    gsm: 250,
    stock: 35,
    isFlashSale: true,
    discountPercent: 20,
    tags: [
      "PixelArt",
      "SS26",
      "SpringSummer",
      "Streetwear",
      "FashionWekk",
      "KhanhBro",
      "accessories"
    ],
    rating: 4.9,
    reviewCount: 38,
    mascotSlot: "accessory",
    mascotAsset: "asset_ss_accessories_1",
    featured: false,
    createdAt: "2026-11-05T08:29:11.801Z",
    updatedAt: "2026-11-05T08:29:11.801Z"
  },
  {
    _id: "prod_fw_51",
    title: "Street Ronin Brush Heavyweight Boxy Drip Hoodie #51",
    price: 104,
    originalPrice: 104,
    category: "hoodies",
    season: "FW26",
    collectionName: "Street Ronin Brush",
    description: "Fall/Winter 2026 heavyweight capsule from the Street Ronin Brush collection. Built with armor-grade 500 GSM double-brushed French terry and water-repellent shell. Features custom embroidered wax seal patches, thick ribbed cuffs, drop-shoulder tailoring, and signature KhanhBro pop-art graphics.",
    images: [
      "https://res.cloudinary.com/dptpb60p7/image/upload/f_auto,q_auto/v1793891754/fashionwekk/masterpieces/street_ronin_brush.png",
      "https://res.cloudinary.com/dptpb60p7/image/upload/c_fill,w_800,h_1000,g_auto/f_auto,q_auto/v1793891754/fashionwekk/masterpieces/street_ronin_brush.png",
      "https://res.cloudinary.com/dptpb60p7/image/upload/c_crop,w_600,h_600,g_center/f_auto,q_auto/v1793891754/fashionwekk/masterpieces/street_ronin_brush.png"
    ],
    colors: [
      "Deep Lavender",
      "Shadow Black"
    ],
    sizes: [
      "S",
      "M",
      "L",
      "XL",
      "XXL"
    ],
    gsm: 500,
    stock: 28,
    isFlashSale: false,
    discountPercent: 0,
    tags: [
      "RoninBrush",
      "FW26",
      "FallWinter",
      "Heavyweight",
      "Streetwear",
      "FashionWekk",
      "KhanhBro",
      "hoodies"
    ],
    rating: 4.8,
    reviewCount: 45,
    mascotSlot: "top",
    mascotAsset: "asset_fw_hoodies_2",
    featured: false,
    createdAt: "2026-11-05T09:29:11.801Z",
    updatedAt: "2026-11-05T09:29:11.801Z"
  },
  {
    _id: "prod_fw_52",
    title: "Demon Mask Pop Art Heavyweight Boxy Drip Hoodie #52",
    price: 110,
    originalPrice: 146,
    category: "hoodies",
    season: "FW26",
    collectionName: "Demon Mask Pop Art",
    description: "Fall/Winter 2026 heavyweight capsule from the Demon Mask Pop Art collection. Built with armor-grade 470 GSM double-brushed French terry and water-repellent shell. Features custom embroidered wax seal patches, thick ribbed cuffs, drop-shoulder tailoring, and signature KhanhBro pop-art graphics.",
    images: [
      "https://res.cloudinary.com/dptpb60p7/image/upload/f_auto,q_auto/v1793892193/fashionwekk/masterpieces/demon_mask_popart.png",
      "https://res.cloudinary.com/dptpb60p7/image/upload/c_fill,w_800,h_1000,g_auto/f_auto,q_auto/v1793892193/fashionwekk/masterpieces/demon_mask_popart.png",
      "https://res.cloudinary.com/dptpb60p7/image/upload/c_crop,w_600,h_600,g_center/f_auto,q_auto/v1793892193/fashionwekk/masterpieces/demon_mask_popart.png"
    ],
    colors: [
      "Bone White",
      "Pop Magenta"
    ],
    sizes: [
      "S",
      "M",
      "L",
      "XL",
      "XXL"
    ],
    gsm: 470,
    stock: 28,
    isFlashSale: true,
    discountPercent: 25,
    tags: [
      "DemonPop",
      "FW26",
      "FallWinter",
      "Heavyweight",
      "Streetwear",
      "FashionWekk",
      "KhanhBro",
      "hoodies"
    ],
    rating: 4.9,
    reviewCount: 45,
    mascotSlot: "top",
    mascotAsset: "asset_fw_hoodies_3",
    featured: false,
    createdAt: "2026-11-05T10:29:11.801Z",
    updatedAt: "2026-11-05T10:29:11.801Z"
  },
  {
    _id: "prod_fw_53",
    title: "Rogue Clan Distressed Heavyweight Boxy Drip Hoodie #53",
    price: 116,
    originalPrice: 116,
    category: "hoodies",
    season: "FW26",
    collectionName: "Rogue Clan Distressed",
    description: "Fall/Winter 2026 heavyweight capsule from the Rogue Clan Distressed collection. Built with armor-grade 450 GSM double-brushed French terry and water-repellent shell. Features custom embroidered wax seal patches, thick ribbed cuffs, drop-shoulder tailoring, and signature KhanhBro pop-art graphics.",
    images: [
      "https://res.cloudinary.com/dptpb60p7/image/upload/f_auto,q_auto/v1793892268/fashionwekk/masterpieces/rogue_clan_distressed.png",
      "https://res.cloudinary.com/dptpb60p7/image/upload/c_fill,w_800,h_1000,g_auto/f_auto,q_auto/v1793892268/fashionwekk/masterpieces/rogue_clan_distressed.png",
      "https://res.cloudinary.com/dptpb60p7/image/upload/c_crop,w_600,h_600,g_center/f_auto,q_auto/v1793892268/fashionwekk/masterpieces/rogue_clan_distressed.png"
    ],
    colors: [
      "Neon Purple",
      "Hyper Green"
    ],
    sizes: [
      "S",
      "M",
      "L",
      "XL",
      "XXL"
    ],
    gsm: 450,
    stock: 28,
    isFlashSale: false,
    discountPercent: 0,
    tags: [
      "RogueClan",
      "FW26",
      "FallWinter",
      "Heavyweight",
      "Streetwear",
      "FashionWekk",
      "KhanhBro",
      "hoodies"
    ],
    rating: 5,
    reviewCount: 45,
    mascotSlot: "top",
    mascotAsset: "asset_fw_hoodies_4",
    featured: false,
    createdAt: "2026-11-05T11:29:11.801Z",
    updatedAt: "2026-11-05T11:29:11.801Z"
  },
  {
    _id: "prod_fw_54",
    title: "KhanhBro Signature Drip Heavyweight Boxy Drip Hoodie #54",
    price: 122,
    originalPrice: 122,
    category: "hoodies",
    season: "FW26",
    collectionName: "KhanhBro Signature Drip",
    description: "Fall/Winter 2026 heavyweight capsule from the KhanhBro Signature Drip collection. Built with armor-grade 490 GSM double-brushed French terry and water-repellent shell. Features custom embroidered wax seal patches, thick ribbed cuffs, drop-shoulder tailoring, and signature KhanhBro pop-art graphics.",
    images: [
      "https://res.cloudinary.com/dptpb60p7/image/upload/f_auto,q_auto/v1793892321/fashionwekk/masterpieces/khanhbro_hero_signature_drip.png",
      "https://res.cloudinary.com/dptpb60p7/image/upload/c_fill,w_800,h_1000,g_auto/f_auto,q_auto/v1793892321/fashionwekk/masterpieces/khanhbro_hero_signature_drip.png",
      "https://res.cloudinary.com/dptpb60p7/image/upload/c_crop,w_600,h_600,g_center/f_auto,q_auto/v1793892321/fashionwekk/masterpieces/khanhbro_hero_signature_drip.png"
    ],
    colors: [
      "Graphite Grey",
      "Comic Yellow"
    ],
    sizes: [
      "S",
      "M",
      "L",
      "XL",
      "XXL"
    ],
    gsm: 490,
    stock: 28,
    isFlashSale: false,
    discountPercent: 0,
    tags: [
      "KhanhBro",
      "FW26",
      "FallWinter",
      "Heavyweight",
      "Streetwear",
      "FashionWekk",
      "KhanhBro",
      "hoodies"
    ],
    rating: 4.8,
    reviewCount: 45,
    mascotSlot: "top",
    mascotAsset: "asset_fw_hoodies_5",
    featured: false,
    createdAt: "2026-11-05T12:29:11.801Z",
    updatedAt: "2026-11-05T12:29:11.801Z"
  },
  {
    _id: "prod_fw_55",
    title: "Cyber Toon Glitch Heavyweight Boxy Drip Hoodie #55",
    price: 128,
    originalPrice: 128,
    category: "hoodies",
    season: "FW26",
    collectionName: "Cyber Toon Glitch",
    description: "Fall/Winter 2026 heavyweight capsule from the Cyber Toon Glitch collection. Built with armor-grade 460 GSM double-brushed French terry and water-repellent shell. Features custom embroidered wax seal patches, thick ribbed cuffs, drop-shoulder tailoring, and signature KhanhBro pop-art graphics.",
    images: [
      "https://res.cloudinary.com/dptpb60p7/image/upload/f_auto,q_auto/v1793891701/fashionwekk/masterpieces/cyber_toon_glitch_hero.png",
      "https://res.cloudinary.com/dptpb60p7/image/upload/c_fill,w_800,h_1000,g_auto/f_auto,q_auto/v1793891701/fashionwekk/masterpieces/cyber_toon_glitch_hero.png",
      "https://res.cloudinary.com/dptpb60p7/image/upload/c_crop,w_600,h_600,g_center/f_auto,q_auto/v1793891701/fashionwekk/masterpieces/cyber_toon_glitch_hero.png"
    ],
    colors: [
      "Onyx Black",
      "Sunset Coral"
    ],
    sizes: [
      "S",
      "M",
      "L",
      "XL",
      "XXL"
    ],
    gsm: 460,
    stock: 28,
    isFlashSale: false,
    discountPercent: 0,
    tags: [
      "PopGlitch",
      "FW26",
      "FallWinter",
      "Heavyweight",
      "Streetwear",
      "FashionWekk",
      "KhanhBro",
      "hoodies"
    ],
    rating: 4.9,
    reviewCount: 45,
    mascotSlot: "top",
    mascotAsset: "asset_fw_hoodies_1",
    featured: false,
    createdAt: "2026-11-05T13:29:11.801Z",
    updatedAt: "2026-11-05T13:29:11.801Z"
  },
  {
    _id: "prod_fw_56",
    title: "Mecha Bot Evolution Heavyweight Boxy Drip Hoodie #56",
    price: 92,
    originalPrice: 122,
    category: "hoodies",
    season: "FW26",
    collectionName: "Mecha Bot Evolution",
    description: "Fall/Winter 2026 heavyweight capsule from the Mecha Bot Evolution collection. Built with armor-grade 480 GSM double-brushed French terry and water-repellent shell. Features custom embroidered wax seal patches, thick ribbed cuffs, drop-shoulder tailoring, and signature KhanhBro pop-art graphics.",
    images: [
      "https://res.cloudinary.com/dptpb60p7/image/upload/f_auto,q_auto/v1793891719/fashionwekk/masterpieces/mecha_bot_evolution.png",
      "https://res.cloudinary.com/dptpb60p7/image/upload/c_fill,w_800,h_1000,g_auto/f_auto,q_auto/v1793891719/fashionwekk/masterpieces/mecha_bot_evolution.png",
      "https://res.cloudinary.com/dptpb60p7/image/upload/c_crop,w_600,h_600,g_center/f_auto,q_auto/v1793891719/fashionwekk/masterpieces/mecha_bot_evolution.png"
    ],
    colors: [
      "Washed Charcoal",
      "Electric Cyan"
    ],
    sizes: [
      "S",
      "M",
      "L",
      "XL",
      "XXL"
    ],
    gsm: 480,
    stock: 28,
    isFlashSale: true,
    discountPercent: 25,
    tags: [
      "MechaBot",
      "FW26",
      "FallWinter",
      "Heavyweight",
      "Streetwear",
      "FashionWekk",
      "KhanhBro",
      "hoodies"
    ],
    rating: 5,
    reviewCount: 45,
    mascotSlot: "top",
    mascotAsset: "asset_fw_hoodies_2",
    featured: false,
    createdAt: "2026-11-05T14:29:11.801Z",
    updatedAt: "2026-11-05T14:29:11.801Z"
  },
  {
    _id: "prod_fw_57",
    title: "Street Ronin Brush Heavyweight Boxy Drip Hoodie #57",
    price: 98,
    originalPrice: 98,
    category: "hoodies",
    season: "FW26",
    collectionName: "Street Ronin Brush",
    description: "Fall/Winter 2026 heavyweight capsule from the Street Ronin Brush collection. Built with armor-grade 500 GSM double-brushed French terry and water-repellent shell. Features custom embroidered wax seal patches, thick ribbed cuffs, drop-shoulder tailoring, and signature KhanhBro pop-art graphics.",
    images: [
      "https://res.cloudinary.com/dptpb60p7/image/upload/f_auto,q_auto/v1793891754/fashionwekk/masterpieces/street_ronin_brush.png",
      "https://res.cloudinary.com/dptpb60p7/image/upload/c_fill,w_800,h_1000,g_auto/f_auto,q_auto/v1793891754/fashionwekk/masterpieces/street_ronin_brush.png",
      "https://res.cloudinary.com/dptpb60p7/image/upload/c_crop,w_600,h_600,g_center/f_auto,q_auto/v1793891754/fashionwekk/masterpieces/street_ronin_brush.png"
    ],
    colors: [
      "Deep Lavender",
      "Shadow Black"
    ],
    sizes: [
      "S",
      "M",
      "L",
      "XL",
      "XXL"
    ],
    gsm: 500,
    stock: 28,
    isFlashSale: false,
    discountPercent: 0,
    tags: [
      "RoninBrush",
      "FW26",
      "FallWinter",
      "Heavyweight",
      "Streetwear",
      "FashionWekk",
      "KhanhBro",
      "hoodies"
    ],
    rating: 4.8,
    reviewCount: 45,
    mascotSlot: "top",
    mascotAsset: "asset_fw_hoodies_3",
    featured: false,
    createdAt: "2026-11-05T15:29:11.801Z",
    updatedAt: "2026-11-05T15:29:11.801Z"
  },
  {
    _id: "prod_fw_58",
    title: "Demon Mask Pop Art Heavyweight Boxy Drip Hoodie #58",
    price: 104,
    originalPrice: 104,
    category: "hoodies",
    season: "FW26",
    collectionName: "Demon Mask Pop Art",
    description: "Fall/Winter 2026 heavyweight capsule from the Demon Mask Pop Art collection. Built with armor-grade 470 GSM double-brushed French terry and water-repellent shell. Features custom embroidered wax seal patches, thick ribbed cuffs, drop-shoulder tailoring, and signature KhanhBro pop-art graphics.",
    images: [
      "https://res.cloudinary.com/dptpb60p7/image/upload/f_auto,q_auto/v1793892193/fashionwekk/masterpieces/demon_mask_popart.png",
      "https://res.cloudinary.com/dptpb60p7/image/upload/c_fill,w_800,h_1000,g_auto/f_auto,q_auto/v1793892193/fashionwekk/masterpieces/demon_mask_popart.png",
      "https://res.cloudinary.com/dptpb60p7/image/upload/c_crop,w_600,h_600,g_center/f_auto,q_auto/v1793892193/fashionwekk/masterpieces/demon_mask_popart.png"
    ],
    colors: [
      "Bone White",
      "Pop Magenta"
    ],
    sizes: [
      "S",
      "M",
      "L",
      "XL",
      "XXL"
    ],
    gsm: 470,
    stock: 28,
    isFlashSale: false,
    discountPercent: 0,
    tags: [
      "DemonPop",
      "FW26",
      "FallWinter",
      "Heavyweight",
      "Streetwear",
      "FashionWekk",
      "KhanhBro",
      "hoodies"
    ],
    rating: 4.9,
    reviewCount: 45,
    mascotSlot: "top",
    mascotAsset: "asset_fw_hoodies_4",
    featured: false,
    createdAt: "2026-11-05T16:29:11.801Z",
    updatedAt: "2026-11-05T16:29:11.801Z"
  },
  {
    _id: "prod_fw_59",
    title: "Rogue Clan Distressed Heavyweight Boxy Drip Hoodie #59",
    price: 110,
    originalPrice: 110,
    category: "hoodies",
    season: "FW26",
    collectionName: "Rogue Clan Distressed",
    description: "Fall/Winter 2026 heavyweight capsule from the Rogue Clan Distressed collection. Built with armor-grade 450 GSM double-brushed French terry and water-repellent shell. Features custom embroidered wax seal patches, thick ribbed cuffs, drop-shoulder tailoring, and signature KhanhBro pop-art graphics.",
    images: [
      "https://res.cloudinary.com/dptpb60p7/image/upload/f_auto,q_auto/v1793892268/fashionwekk/masterpieces/rogue_clan_distressed.png",
      "https://res.cloudinary.com/dptpb60p7/image/upload/c_fill,w_800,h_1000,g_auto/f_auto,q_auto/v1793892268/fashionwekk/masterpieces/rogue_clan_distressed.png",
      "https://res.cloudinary.com/dptpb60p7/image/upload/c_crop,w_600,h_600,g_center/f_auto,q_auto/v1793892268/fashionwekk/masterpieces/rogue_clan_distressed.png"
    ],
    colors: [
      "Neon Purple",
      "Hyper Green"
    ],
    sizes: [
      "S",
      "M",
      "L",
      "XL",
      "XXL"
    ],
    gsm: 450,
    stock: 28,
    isFlashSale: false,
    discountPercent: 0,
    tags: [
      "RogueClan",
      "FW26",
      "FallWinter",
      "Heavyweight",
      "Streetwear",
      "FashionWekk",
      "KhanhBro",
      "hoodies"
    ],
    rating: 5,
    reviewCount: 45,
    mascotSlot: "top",
    mascotAsset: "asset_fw_hoodies_5",
    featured: false,
    createdAt: "2026-11-05T17:29:11.801Z",
    updatedAt: "2026-11-05T17:29:11.801Z"
  },
  {
    _id: "prod_fw_60",
    title: "KhanhBro Signature Drip Heavyweight Boxy Drip Hoodie #60",
    price: 116,
    originalPrice: 154,
    category: "hoodies",
    season: "FW26",
    collectionName: "KhanhBro Signature Drip",
    description: "Fall/Winter 2026 heavyweight capsule from the KhanhBro Signature Drip collection. Built with armor-grade 490 GSM double-brushed French terry and water-repellent shell. Features custom embroidered wax seal patches, thick ribbed cuffs, drop-shoulder tailoring, and signature KhanhBro pop-art graphics.",
    images: [
      "https://res.cloudinary.com/dptpb60p7/image/upload/f_auto,q_auto/v1793892321/fashionwekk/masterpieces/khanhbro_hero_signature_drip.png",
      "https://res.cloudinary.com/dptpb60p7/image/upload/c_fill,w_800,h_1000,g_auto/f_auto,q_auto/v1793892321/fashionwekk/masterpieces/khanhbro_hero_signature_drip.png",
      "https://res.cloudinary.com/dptpb60p7/image/upload/c_crop,w_600,h_600,g_center/f_auto,q_auto/v1793892321/fashionwekk/masterpieces/khanhbro_hero_signature_drip.png"
    ],
    colors: [
      "Graphite Grey",
      "Comic Yellow"
    ],
    sizes: [
      "S",
      "M",
      "L",
      "XL",
      "XXL"
    ],
    gsm: 490,
    stock: 28,
    isFlashSale: true,
    discountPercent: 25,
    tags: [
      "KhanhBro",
      "FW26",
      "FallWinter",
      "Heavyweight",
      "Streetwear",
      "FashionWekk",
      "KhanhBro",
      "hoodies"
    ],
    rating: 4.8,
    reviewCount: 45,
    mascotSlot: "top",
    mascotAsset: "asset_fw_hoodies_1",
    featured: false,
    createdAt: "2026-11-05T18:29:11.801Z",
    updatedAt: "2026-11-05T18:29:11.801Z"
  },
  {
    _id: "prod_fw_61",
    title: "Cyber Toon Glitch Heavyweight Boxy Drip Hoodie #61",
    price: 122,
    originalPrice: 122,
    category: "hoodies",
    season: "FW26",
    collectionName: "Cyber Toon Glitch",
    description: "Fall/Winter 2026 heavyweight capsule from the Cyber Toon Glitch collection. Built with armor-grade 460 GSM double-brushed French terry and water-repellent shell. Features custom embroidered wax seal patches, thick ribbed cuffs, drop-shoulder tailoring, and signature KhanhBro pop-art graphics.",
    images: [
      "https://res.cloudinary.com/dptpb60p7/image/upload/f_auto,q_auto/v1793891701/fashionwekk/masterpieces/cyber_toon_glitch_hero.png",
      "https://res.cloudinary.com/dptpb60p7/image/upload/c_fill,w_800,h_1000,g_auto/f_auto,q_auto/v1793891701/fashionwekk/masterpieces/cyber_toon_glitch_hero.png",
      "https://res.cloudinary.com/dptpb60p7/image/upload/c_crop,w_600,h_600,g_center/f_auto,q_auto/v1793891701/fashionwekk/masterpieces/cyber_toon_glitch_hero.png"
    ],
    colors: [
      "Onyx Black",
      "Sunset Coral"
    ],
    sizes: [
      "S",
      "M",
      "L",
      "XL",
      "XXL"
    ],
    gsm: 460,
    stock: 28,
    isFlashSale: false,
    discountPercent: 0,
    tags: [
      "PopGlitch",
      "FW26",
      "FallWinter",
      "Heavyweight",
      "Streetwear",
      "FashionWekk",
      "KhanhBro",
      "hoodies"
    ],
    rating: 4.9,
    reviewCount: 45,
    mascotSlot: "top",
    mascotAsset: "asset_fw_hoodies_2",
    featured: false,
    createdAt: "2026-11-05T19:29:11.801Z",
    updatedAt: "2026-11-05T19:29:11.801Z"
  },
  {
    _id: "prod_fw_62",
    title: "Mecha Bot Evolution Heavyweight Boxy Drip Hoodie #62",
    price: 128,
    originalPrice: 128,
    category: "hoodies",
    season: "FW26",
    collectionName: "Mecha Bot Evolution",
    description: "Fall/Winter 2026 heavyweight capsule from the Mecha Bot Evolution collection. Built with armor-grade 480 GSM double-brushed French terry and water-repellent shell. Features custom embroidered wax seal patches, thick ribbed cuffs, drop-shoulder tailoring, and signature KhanhBro pop-art graphics.",
    images: [
      "https://res.cloudinary.com/dptpb60p7/image/upload/f_auto,q_auto/v1793891719/fashionwekk/masterpieces/mecha_bot_evolution.png",
      "https://res.cloudinary.com/dptpb60p7/image/upload/c_fill,w_800,h_1000,g_auto/f_auto,q_auto/v1793891719/fashionwekk/masterpieces/mecha_bot_evolution.png",
      "https://res.cloudinary.com/dptpb60p7/image/upload/c_crop,w_600,h_600,g_center/f_auto,q_auto/v1793891719/fashionwekk/masterpieces/mecha_bot_evolution.png"
    ],
    colors: [
      "Washed Charcoal",
      "Electric Cyan"
    ],
    sizes: [
      "S",
      "M",
      "L",
      "XL",
      "XXL"
    ],
    gsm: 480,
    stock: 28,
    isFlashSale: false,
    discountPercent: 0,
    tags: [
      "MechaBot",
      "FW26",
      "FallWinter",
      "Heavyweight",
      "Streetwear",
      "FashionWekk",
      "KhanhBro",
      "hoodies"
    ],
    rating: 5,
    reviewCount: 45,
    mascotSlot: "top",
    mascotAsset: "asset_fw_hoodies_3",
    featured: false,
    createdAt: "2026-11-05T20:29:11.801Z",
    updatedAt: "2026-11-05T20:29:11.801Z"
  },
  {
    _id: "prod_fw_63",
    title: "Street Ronin Brush Heavyweight Boxy Drip Hoodie #63",
    price: 92,
    originalPrice: 92,
    category: "hoodies",
    season: "FW26",
    collectionName: "Street Ronin Brush",
    description: "Fall/Winter 2026 heavyweight capsule from the Street Ronin Brush collection. Built with armor-grade 500 GSM double-brushed French terry and water-repellent shell. Features custom embroidered wax seal patches, thick ribbed cuffs, drop-shoulder tailoring, and signature KhanhBro pop-art graphics.",
    images: [
      "https://res.cloudinary.com/dptpb60p7/image/upload/f_auto,q_auto/v1793891754/fashionwekk/masterpieces/street_ronin_brush.png",
      "https://res.cloudinary.com/dptpb60p7/image/upload/c_fill,w_800,h_1000,g_auto/f_auto,q_auto/v1793891754/fashionwekk/masterpieces/street_ronin_brush.png",
      "https://res.cloudinary.com/dptpb60p7/image/upload/c_crop,w_600,h_600,g_center/f_auto,q_auto/v1793891754/fashionwekk/masterpieces/street_ronin_brush.png"
    ],
    colors: [
      "Deep Lavender",
      "Shadow Black"
    ],
    sizes: [
      "S",
      "M",
      "L",
      "XL",
      "XXL"
    ],
    gsm: 500,
    stock: 28,
    isFlashSale: false,
    discountPercent: 0,
    tags: [
      "RoninBrush",
      "FW26",
      "FallWinter",
      "Heavyweight",
      "Streetwear",
      "FashionWekk",
      "KhanhBro",
      "hoodies"
    ],
    rating: 4.8,
    reviewCount: 45,
    mascotSlot: "top",
    mascotAsset: "asset_fw_hoodies_4",
    featured: false,
    createdAt: "2026-11-05T21:29:11.801Z",
    updatedAt: "2026-11-05T21:29:11.801Z"
  },
  {
    _id: "prod_fw_64",
    title: "Demon Mask Pop Art Heavyweight Boxy Drip Hoodie #64",
    price: 98,
    originalPrice: 130,
    category: "hoodies",
    season: "FW26",
    collectionName: "Demon Mask Pop Art",
    description: "Fall/Winter 2026 heavyweight capsule from the Demon Mask Pop Art collection. Built with armor-grade 470 GSM double-brushed French terry and water-repellent shell. Features custom embroidered wax seal patches, thick ribbed cuffs, drop-shoulder tailoring, and signature KhanhBro pop-art graphics.",
    images: [
      "https://res.cloudinary.com/dptpb60p7/image/upload/f_auto,q_auto/v1793892193/fashionwekk/masterpieces/demon_mask_popart.png",
      "https://res.cloudinary.com/dptpb60p7/image/upload/c_fill,w_800,h_1000,g_auto/f_auto,q_auto/v1793892193/fashionwekk/masterpieces/demon_mask_popart.png",
      "https://res.cloudinary.com/dptpb60p7/image/upload/c_crop,w_600,h_600,g_center/f_auto,q_auto/v1793892193/fashionwekk/masterpieces/demon_mask_popart.png"
    ],
    colors: [
      "Bone White",
      "Pop Magenta"
    ],
    sizes: [
      "S",
      "M",
      "L",
      "XL",
      "XXL"
    ],
    gsm: 470,
    stock: 28,
    isFlashSale: true,
    discountPercent: 25,
    tags: [
      "DemonPop",
      "FW26",
      "FallWinter",
      "Heavyweight",
      "Streetwear",
      "FashionWekk",
      "KhanhBro",
      "hoodies"
    ],
    rating: 4.9,
    reviewCount: 45,
    mascotSlot: "top",
    mascotAsset: "asset_fw_hoodies_5",
    featured: false,
    createdAt: "2026-11-05T22:29:11.801Z",
    updatedAt: "2026-11-05T22:29:11.801Z"
  },
  {
    _id: "prod_fw_65",
    title: "Rogue Clan Distressed Heavyweight Boxy Drip Hoodie #65",
    price: 104,
    originalPrice: 104,
    category: "hoodies",
    season: "FW26",
    collectionName: "Rogue Clan Distressed",
    description: "Fall/Winter 2026 heavyweight capsule from the Rogue Clan Distressed collection. Built with armor-grade 450 GSM double-brushed French terry and water-repellent shell. Features custom embroidered wax seal patches, thick ribbed cuffs, drop-shoulder tailoring, and signature KhanhBro pop-art graphics.",
    images: [
      "https://res.cloudinary.com/dptpb60p7/image/upload/f_auto,q_auto/v1793892268/fashionwekk/masterpieces/rogue_clan_distressed.png",
      "https://res.cloudinary.com/dptpb60p7/image/upload/c_fill,w_800,h_1000,g_auto/f_auto,q_auto/v1793892268/fashionwekk/masterpieces/rogue_clan_distressed.png",
      "https://res.cloudinary.com/dptpb60p7/image/upload/c_crop,w_600,h_600,g_center/f_auto,q_auto/v1793892268/fashionwekk/masterpieces/rogue_clan_distressed.png"
    ],
    colors: [
      "Neon Purple",
      "Hyper Green"
    ],
    sizes: [
      "S",
      "M",
      "L",
      "XL",
      "XXL"
    ],
    gsm: 450,
    stock: 28,
    isFlashSale: false,
    discountPercent: 0,
    tags: [
      "RogueClan",
      "FW26",
      "FallWinter",
      "Heavyweight",
      "Streetwear",
      "FashionWekk",
      "KhanhBro",
      "hoodies"
    ],
    rating: 5,
    reviewCount: 45,
    mascotSlot: "top",
    mascotAsset: "asset_fw_hoodies_1",
    featured: false,
    createdAt: "2026-11-05T23:29:11.801Z",
    updatedAt: "2026-11-05T23:29:11.801Z"
  },
  {
    _id: "prod_fw_66",
    title: "KhanhBro Signature Drip Heavyweight Boxy Drip Hoodie #66",
    price: 110,
    originalPrice: 110,
    category: "hoodies",
    season: "FW26",
    collectionName: "KhanhBro Signature Drip",
    description: "Fall/Winter 2026 heavyweight capsule from the KhanhBro Signature Drip collection. Built with armor-grade 490 GSM double-brushed French terry and water-repellent shell. Features custom embroidered wax seal patches, thick ribbed cuffs, drop-shoulder tailoring, and signature KhanhBro pop-art graphics.",
    images: [
      "https://res.cloudinary.com/dptpb60p7/image/upload/f_auto,q_auto/v1793892321/fashionwekk/masterpieces/khanhbro_hero_signature_drip.png",
      "https://res.cloudinary.com/dptpb60p7/image/upload/c_fill,w_800,h_1000,g_auto/f_auto,q_auto/v1793892321/fashionwekk/masterpieces/khanhbro_hero_signature_drip.png",
      "https://res.cloudinary.com/dptpb60p7/image/upload/c_crop,w_600,h_600,g_center/f_auto,q_auto/v1793892321/fashionwekk/masterpieces/khanhbro_hero_signature_drip.png"
    ],
    colors: [
      "Graphite Grey",
      "Comic Yellow"
    ],
    sizes: [
      "S",
      "M",
      "L",
      "XL",
      "XXL"
    ],
    gsm: 490,
    stock: 28,
    isFlashSale: false,
    discountPercent: 0,
    tags: [
      "KhanhBro",
      "FW26",
      "FallWinter",
      "Heavyweight",
      "Streetwear",
      "FashionWekk",
      "KhanhBro",
      "hoodies"
    ],
    rating: 4.8,
    reviewCount: 45,
    mascotSlot: "top",
    mascotAsset: "asset_fw_hoodies_2",
    featured: false,
    createdAt: "2026-11-06T00:29:11.801Z",
    updatedAt: "2026-11-06T00:29:11.801Z"
  },
  {
    _id: "prod_fw_67",
    title: "Cyber Toon Glitch Heavyweight Boxy Drip Hoodie #67",
    price: 116,
    originalPrice: 116,
    category: "hoodies",
    season: "FW26",
    collectionName: "Cyber Toon Glitch",
    description: "Fall/Winter 2026 heavyweight capsule from the Cyber Toon Glitch collection. Built with armor-grade 460 GSM double-brushed French terry and water-repellent shell. Features custom embroidered wax seal patches, thick ribbed cuffs, drop-shoulder tailoring, and signature KhanhBro pop-art graphics.",
    images: [
      "https://res.cloudinary.com/dptpb60p7/image/upload/f_auto,q_auto/v1793891701/fashionwekk/masterpieces/cyber_toon_glitch_hero.png",
      "https://res.cloudinary.com/dptpb60p7/image/upload/c_fill,w_800,h_1000,g_auto/f_auto,q_auto/v1793891701/fashionwekk/masterpieces/cyber_toon_glitch_hero.png",
      "https://res.cloudinary.com/dptpb60p7/image/upload/c_crop,w_600,h_600,g_center/f_auto,q_auto/v1793891701/fashionwekk/masterpieces/cyber_toon_glitch_hero.png"
    ],
    colors: [
      "Onyx Black",
      "Sunset Coral"
    ],
    sizes: [
      "S",
      "M",
      "L",
      "XL",
      "XXL"
    ],
    gsm: 460,
    stock: 28,
    isFlashSale: false,
    discountPercent: 0,
    tags: [
      "PopGlitch",
      "FW26",
      "FallWinter",
      "Heavyweight",
      "Streetwear",
      "FashionWekk",
      "KhanhBro",
      "hoodies"
    ],
    rating: 4.9,
    reviewCount: 45,
    mascotSlot: "top",
    mascotAsset: "asset_fw_hoodies_3",
    featured: false,
    createdAt: "2026-11-06T01:29:11.801Z",
    updatedAt: "2026-11-06T01:29:11.801Z"
  },
  {
    _id: "prod_fw_68",
    title: "Mecha Bot Evolution Heavyweight Boxy Drip Hoodie #68",
    price: 122,
    originalPrice: 162,
    category: "hoodies",
    season: "FW26",
    collectionName: "Mecha Bot Evolution",
    description: "Fall/Winter 2026 heavyweight capsule from the Mecha Bot Evolution collection. Built with armor-grade 480 GSM double-brushed French terry and water-repellent shell. Features custom embroidered wax seal patches, thick ribbed cuffs, drop-shoulder tailoring, and signature KhanhBro pop-art graphics.",
    images: [
      "https://res.cloudinary.com/dptpb60p7/image/upload/f_auto,q_auto/v1793891719/fashionwekk/masterpieces/mecha_bot_evolution.png",
      "https://res.cloudinary.com/dptpb60p7/image/upload/c_fill,w_800,h_1000,g_auto/f_auto,q_auto/v1793891719/fashionwekk/masterpieces/mecha_bot_evolution.png",
      "https://res.cloudinary.com/dptpb60p7/image/upload/c_crop,w_600,h_600,g_center/f_auto,q_auto/v1793891719/fashionwekk/masterpieces/mecha_bot_evolution.png"
    ],
    colors: [
      "Washed Charcoal",
      "Electric Cyan"
    ],
    sizes: [
      "S",
      "M",
      "L",
      "XL",
      "XXL"
    ],
    gsm: 480,
    stock: 28,
    isFlashSale: true,
    discountPercent: 25,
    tags: [
      "MechaBot",
      "FW26",
      "FallWinter",
      "Heavyweight",
      "Streetwear",
      "FashionWekk",
      "KhanhBro",
      "hoodies"
    ],
    rating: 5,
    reviewCount: 45,
    mascotSlot: "top",
    mascotAsset: "asset_fw_hoodies_4",
    featured: false,
    createdAt: "2026-11-06T02:29:11.801Z",
    updatedAt: "2026-11-06T02:29:11.801Z"
  },
  {
    _id: "prod_fw_69",
    title: "Street Ronin Brush Heavyweight Boxy Drip Hoodie #69",
    price: 128,
    originalPrice: 128,
    category: "hoodies",
    season: "FW26",
    collectionName: "Street Ronin Brush",
    description: "Fall/Winter 2026 heavyweight capsule from the Street Ronin Brush collection. Built with armor-grade 500 GSM double-brushed French terry and water-repellent shell. Features custom embroidered wax seal patches, thick ribbed cuffs, drop-shoulder tailoring, and signature KhanhBro pop-art graphics.",
    images: [
      "https://res.cloudinary.com/dptpb60p7/image/upload/f_auto,q_auto/v1793891754/fashionwekk/masterpieces/street_ronin_brush.png",
      "https://res.cloudinary.com/dptpb60p7/image/upload/c_fill,w_800,h_1000,g_auto/f_auto,q_auto/v1793891754/fashionwekk/masterpieces/street_ronin_brush.png",
      "https://res.cloudinary.com/dptpb60p7/image/upload/c_crop,w_600,h_600,g_center/f_auto,q_auto/v1793891754/fashionwekk/masterpieces/street_ronin_brush.png"
    ],
    colors: [
      "Deep Lavender",
      "Shadow Black"
    ],
    sizes: [
      "S",
      "M",
      "L",
      "XL",
      "XXL"
    ],
    gsm: 500,
    stock: 28,
    isFlashSale: false,
    discountPercent: 0,
    tags: [
      "RoninBrush",
      "FW26",
      "FallWinter",
      "Heavyweight",
      "Streetwear",
      "FashionWekk",
      "KhanhBro",
      "hoodies"
    ],
    rating: 4.8,
    reviewCount: 45,
    mascotSlot: "top",
    mascotAsset: "asset_fw_hoodies_5",
    featured: false,
    createdAt: "2026-11-06T03:29:11.801Z",
    updatedAt: "2026-11-06T03:29:11.801Z"
  },
  {
    _id: "prod_fw_70",
    title: "Demon Mask Pop Art Heavyweight Boxy Drip Hoodie #70",
    price: 92,
    originalPrice: 92,
    category: "hoodies",
    season: "FW26",
    collectionName: "Demon Mask Pop Art",
    description: "Fall/Winter 2026 heavyweight capsule from the Demon Mask Pop Art collection. Built with armor-grade 470 GSM double-brushed French terry and water-repellent shell. Features custom embroidered wax seal patches, thick ribbed cuffs, drop-shoulder tailoring, and signature KhanhBro pop-art graphics.",
    images: [
      "https://res.cloudinary.com/dptpb60p7/image/upload/f_auto,q_auto/v1793892193/fashionwekk/masterpieces/demon_mask_popart.png",
      "https://res.cloudinary.com/dptpb60p7/image/upload/c_fill,w_800,h_1000,g_auto/f_auto,q_auto/v1793892193/fashionwekk/masterpieces/demon_mask_popart.png",
      "https://res.cloudinary.com/dptpb60p7/image/upload/c_crop,w_600,h_600,g_center/f_auto,q_auto/v1793892193/fashionwekk/masterpieces/demon_mask_popart.png"
    ],
    colors: [
      "Bone White",
      "Pop Magenta"
    ],
    sizes: [
      "S",
      "M",
      "L",
      "XL",
      "XXL"
    ],
    gsm: 470,
    stock: 28,
    isFlashSale: false,
    discountPercent: 0,
    tags: [
      "DemonPop",
      "FW26",
      "FallWinter",
      "Heavyweight",
      "Streetwear",
      "FashionWekk",
      "KhanhBro",
      "hoodies"
    ],
    rating: 4.9,
    reviewCount: 45,
    mascotSlot: "top",
    mascotAsset: "asset_fw_hoodies_1",
    featured: false,
    createdAt: "2026-11-06T04:29:11.801Z",
    updatedAt: "2026-11-06T04:29:11.801Z"
  },
  {
    _id: "prod_fw_71",
    title: "Rogue Clan Distressed Heavy French Terry Cargo Pants #71",
    price: 90,
    originalPrice: 90,
    category: "bottoms",
    season: "FW26",
    collectionName: "Rogue Clan Distressed",
    description: "Fall/Winter 2026 heavyweight capsule from the Rogue Clan Distressed collection. Built with armor-grade 450 GSM double-brushed French terry and water-repellent shell. Features custom embroidered wax seal patches, thick ribbed cuffs, drop-shoulder tailoring, and signature KhanhBro pop-art graphics.",
    images: [
      "https://res.cloudinary.com/dptpb60p7/image/upload/f_auto,q_auto/v1793892268/fashionwekk/masterpieces/rogue_clan_distressed.png",
      "https://res.cloudinary.com/dptpb60p7/image/upload/c_fill,w_800,h_1000,g_auto/f_auto,q_auto/v1793892268/fashionwekk/masterpieces/rogue_clan_distressed.png",
      "https://res.cloudinary.com/dptpb60p7/image/upload/c_crop,w_600,h_600,g_center/f_auto,q_auto/v1793892268/fashionwekk/masterpieces/rogue_clan_distressed.png"
    ],
    colors: [
      "Neon Purple",
      "Hyper Green"
    ],
    sizes: [
      "S",
      "M",
      "L",
      "XL",
      "XXL"
    ],
    gsm: 450,
    stock: 28,
    isFlashSale: false,
    discountPercent: 0,
    tags: [
      "RogueClan",
      "FW26",
      "FallWinter",
      "Heavyweight",
      "Streetwear",
      "FashionWekk",
      "KhanhBro",
      "bottoms"
    ],
    rating: 5,
    reviewCount: 45,
    mascotSlot: "bottom",
    mascotAsset: "asset_fw_bottoms_2",
    featured: false,
    createdAt: "2026-11-06T05:29:11.801Z",
    updatedAt: "2026-11-06T05:29:11.801Z"
  },
  {
    _id: "prod_fw_72",
    title: "KhanhBro Signature Drip Heavy French Terry Cargo Pants #72",
    price: 96,
    originalPrice: 128,
    category: "bottoms",
    season: "FW26",
    collectionName: "KhanhBro Signature Drip",
    description: "Fall/Winter 2026 heavyweight capsule from the KhanhBro Signature Drip collection. Built with armor-grade 490 GSM double-brushed French terry and water-repellent shell. Features custom embroidered wax seal patches, thick ribbed cuffs, drop-shoulder tailoring, and signature KhanhBro pop-art graphics.",
    images: [
      "https://res.cloudinary.com/dptpb60p7/image/upload/f_auto,q_auto/v1793892321/fashionwekk/masterpieces/khanhbro_hero_signature_drip.png",
      "https://res.cloudinary.com/dptpb60p7/image/upload/c_fill,w_800,h_1000,g_auto/f_auto,q_auto/v1793892321/fashionwekk/masterpieces/khanhbro_hero_signature_drip.png",
      "https://res.cloudinary.com/dptpb60p7/image/upload/c_crop,w_600,h_600,g_center/f_auto,q_auto/v1793892321/fashionwekk/masterpieces/khanhbro_hero_signature_drip.png"
    ],
    colors: [
      "Graphite Grey",
      "Comic Yellow"
    ],
    sizes: [
      "S",
      "M",
      "L",
      "XL",
      "XXL"
    ],
    gsm: 490,
    stock: 28,
    isFlashSale: true,
    discountPercent: 25,
    tags: [
      "KhanhBro",
      "FW26",
      "FallWinter",
      "Heavyweight",
      "Streetwear",
      "FashionWekk",
      "KhanhBro",
      "bottoms"
    ],
    rating: 4.8,
    reviewCount: 45,
    mascotSlot: "bottom",
    mascotAsset: "asset_fw_bottoms_3",
    featured: false,
    createdAt: "2026-11-06T06:29:11.801Z",
    updatedAt: "2026-11-06T06:29:11.801Z"
  },
  {
    _id: "prod_fw_73",
    title: "Cyber Toon Glitch Heavy French Terry Cargo Pants #73",
    price: 102,
    originalPrice: 102,
    category: "bottoms",
    season: "FW26",
    collectionName: "Cyber Toon Glitch",
    description: "Fall/Winter 2026 heavyweight capsule from the Cyber Toon Glitch collection. Built with armor-grade 460 GSM double-brushed French terry and water-repellent shell. Features custom embroidered wax seal patches, thick ribbed cuffs, drop-shoulder tailoring, and signature KhanhBro pop-art graphics.",
    images: [
      "https://res.cloudinary.com/dptpb60p7/image/upload/f_auto,q_auto/v1793891701/fashionwekk/masterpieces/cyber_toon_glitch_hero.png",
      "https://res.cloudinary.com/dptpb60p7/image/upload/c_fill,w_800,h_1000,g_auto/f_auto,q_auto/v1793891701/fashionwekk/masterpieces/cyber_toon_glitch_hero.png",
      "https://res.cloudinary.com/dptpb60p7/image/upload/c_crop,w_600,h_600,g_center/f_auto,q_auto/v1793891701/fashionwekk/masterpieces/cyber_toon_glitch_hero.png"
    ],
    colors: [
      "Onyx Black",
      "Sunset Coral"
    ],
    sizes: [
      "S",
      "M",
      "L",
      "XL",
      "XXL"
    ],
    gsm: 460,
    stock: 28,
    isFlashSale: false,
    discountPercent: 0,
    tags: [
      "PopGlitch",
      "FW26",
      "FallWinter",
      "Heavyweight",
      "Streetwear",
      "FashionWekk",
      "KhanhBro",
      "bottoms"
    ],
    rating: 4.9,
    reviewCount: 45,
    mascotSlot: "bottom",
    mascotAsset: "asset_fw_bottoms_4",
    featured: false,
    createdAt: "2026-11-06T07:29:11.801Z",
    updatedAt: "2026-11-06T07:29:11.801Z"
  },
  {
    _id: "prod_fw_74",
    title: "Mecha Bot Evolution Heavy French Terry Cargo Pants #74",
    price: 108,
    originalPrice: 108,
    category: "bottoms",
    season: "FW26",
    collectionName: "Mecha Bot Evolution",
    description: "Fall/Winter 2026 heavyweight capsule from the Mecha Bot Evolution collection. Built with armor-grade 480 GSM double-brushed French terry and water-repellent shell. Features custom embroidered wax seal patches, thick ribbed cuffs, drop-shoulder tailoring, and signature KhanhBro pop-art graphics.",
    images: [
      "https://res.cloudinary.com/dptpb60p7/image/upload/f_auto,q_auto/v1793891719/fashionwekk/masterpieces/mecha_bot_evolution.png",
      "https://res.cloudinary.com/dptpb60p7/image/upload/c_fill,w_800,h_1000,g_auto/f_auto,q_auto/v1793891719/fashionwekk/masterpieces/mecha_bot_evolution.png",
      "https://res.cloudinary.com/dptpb60p7/image/upload/c_crop,w_600,h_600,g_center/f_auto,q_auto/v1793891719/fashionwekk/masterpieces/mecha_bot_evolution.png"
    ],
    colors: [
      "Washed Charcoal",
      "Electric Cyan"
    ],
    sizes: [
      "S",
      "M",
      "L",
      "XL",
      "XXL"
    ],
    gsm: 480,
    stock: 28,
    isFlashSale: false,
    discountPercent: 0,
    tags: [
      "MechaBot",
      "FW26",
      "FallWinter",
      "Heavyweight",
      "Streetwear",
      "FashionWekk",
      "KhanhBro",
      "bottoms"
    ],
    rating: 5,
    reviewCount: 45,
    mascotSlot: "bottom",
    mascotAsset: "asset_fw_bottoms_5",
    featured: false,
    createdAt: "2026-11-06T08:29:11.801Z",
    updatedAt: "2026-11-06T08:29:11.801Z"
  },
  {
    _id: "prod_fw_75",
    title: "Street Ronin Brush Heavy French Terry Cargo Pants #75",
    price: 114,
    originalPrice: 114,
    category: "bottoms",
    season: "FW26",
    collectionName: "Street Ronin Brush",
    description: "Fall/Winter 2026 heavyweight capsule from the Street Ronin Brush collection. Built with armor-grade 500 GSM double-brushed French terry and water-repellent shell. Features custom embroidered wax seal patches, thick ribbed cuffs, drop-shoulder tailoring, and signature KhanhBro pop-art graphics.",
    images: [
      "https://res.cloudinary.com/dptpb60p7/image/upload/f_auto,q_auto/v1793891754/fashionwekk/masterpieces/street_ronin_brush.png",
      "https://res.cloudinary.com/dptpb60p7/image/upload/c_fill,w_800,h_1000,g_auto/f_auto,q_auto/v1793891754/fashionwekk/masterpieces/street_ronin_brush.png",
      "https://res.cloudinary.com/dptpb60p7/image/upload/c_crop,w_600,h_600,g_center/f_auto,q_auto/v1793891754/fashionwekk/masterpieces/street_ronin_brush.png"
    ],
    colors: [
      "Deep Lavender",
      "Shadow Black"
    ],
    sizes: [
      "S",
      "M",
      "L",
      "XL",
      "XXL"
    ],
    gsm: 500,
    stock: 28,
    isFlashSale: false,
    discountPercent: 0,
    tags: [
      "RoninBrush",
      "FW26",
      "FallWinter",
      "Heavyweight",
      "Streetwear",
      "FashionWekk",
      "KhanhBro",
      "bottoms"
    ],
    rating: 4.8,
    reviewCount: 45,
    mascotSlot: "bottom",
    mascotAsset: "asset_fw_bottoms_1",
    featured: false,
    createdAt: "2026-11-06T09:29:11.801Z",
    updatedAt: "2026-11-06T09:29:11.801Z"
  },
  {
    _id: "prod_fw_76",
    title: "Demon Mask Pop Art Heavy French Terry Cargo Pants #76",
    price: 120,
    originalPrice: 160,
    category: "bottoms",
    season: "FW26",
    collectionName: "Demon Mask Pop Art",
    description: "Fall/Winter 2026 heavyweight capsule from the Demon Mask Pop Art collection. Built with armor-grade 470 GSM double-brushed French terry and water-repellent shell. Features custom embroidered wax seal patches, thick ribbed cuffs, drop-shoulder tailoring, and signature KhanhBro pop-art graphics.",
    images: [
      "https://res.cloudinary.com/dptpb60p7/image/upload/f_auto,q_auto/v1793892193/fashionwekk/masterpieces/demon_mask_popart.png",
      "https://res.cloudinary.com/dptpb60p7/image/upload/c_fill,w_800,h_1000,g_auto/f_auto,q_auto/v1793892193/fashionwekk/masterpieces/demon_mask_popart.png",
      "https://res.cloudinary.com/dptpb60p7/image/upload/c_crop,w_600,h_600,g_center/f_auto,q_auto/v1793892193/fashionwekk/masterpieces/demon_mask_popart.png"
    ],
    colors: [
      "Bone White",
      "Pop Magenta"
    ],
    sizes: [
      "S",
      "M",
      "L",
      "XL",
      "XXL"
    ],
    gsm: 470,
    stock: 28,
    isFlashSale: true,
    discountPercent: 25,
    tags: [
      "DemonPop",
      "FW26",
      "FallWinter",
      "Heavyweight",
      "Streetwear",
      "FashionWekk",
      "KhanhBro",
      "bottoms"
    ],
    rating: 4.9,
    reviewCount: 45,
    mascotSlot: "bottom",
    mascotAsset: "asset_fw_bottoms_2",
    featured: false,
    createdAt: "2026-11-06T10:29:11.801Z",
    updatedAt: "2026-11-06T10:29:11.801Z"
  },
  {
    _id: "prod_fw_77",
    title: "Rogue Clan Distressed Heavy French Terry Cargo Pants #77",
    price: 84,
    originalPrice: 84,
    category: "bottoms",
    season: "FW26",
    collectionName: "Rogue Clan Distressed",
    description: "Fall/Winter 2026 heavyweight capsule from the Rogue Clan Distressed collection. Built with armor-grade 450 GSM double-brushed French terry and water-repellent shell. Features custom embroidered wax seal patches, thick ribbed cuffs, drop-shoulder tailoring, and signature KhanhBro pop-art graphics.",
    images: [
      "https://res.cloudinary.com/dptpb60p7/image/upload/f_auto,q_auto/v1793892268/fashionwekk/masterpieces/rogue_clan_distressed.png",
      "https://res.cloudinary.com/dptpb60p7/image/upload/c_fill,w_800,h_1000,g_auto/f_auto,q_auto/v1793892268/fashionwekk/masterpieces/rogue_clan_distressed.png",
      "https://res.cloudinary.com/dptpb60p7/image/upload/c_crop,w_600,h_600,g_center/f_auto,q_auto/v1793892268/fashionwekk/masterpieces/rogue_clan_distressed.png"
    ],
    colors: [
      "Neon Purple",
      "Hyper Green"
    ],
    sizes: [
      "S",
      "M",
      "L",
      "XL",
      "XXL"
    ],
    gsm: 450,
    stock: 28,
    isFlashSale: false,
    discountPercent: 0,
    tags: [
      "RogueClan",
      "FW26",
      "FallWinter",
      "Heavyweight",
      "Streetwear",
      "FashionWekk",
      "KhanhBro",
      "bottoms"
    ],
    rating: 5,
    reviewCount: 45,
    mascotSlot: "bottom",
    mascotAsset: "asset_fw_bottoms_3",
    featured: false,
    createdAt: "2026-11-06T11:29:11.801Z",
    updatedAt: "2026-11-06T11:29:11.801Z"
  },
  {
    _id: "prod_fw_78",
    title: "KhanhBro Signature Drip Heavy French Terry Cargo Pants #78",
    price: 90,
    originalPrice: 90,
    category: "bottoms",
    season: "FW26",
    collectionName: "KhanhBro Signature Drip",
    description: "Fall/Winter 2026 heavyweight capsule from the KhanhBro Signature Drip collection. Built with armor-grade 490 GSM double-brushed French terry and water-repellent shell. Features custom embroidered wax seal patches, thick ribbed cuffs, drop-shoulder tailoring, and signature KhanhBro pop-art graphics.",
    images: [
      "https://res.cloudinary.com/dptpb60p7/image/upload/f_auto,q_auto/v1793892321/fashionwekk/masterpieces/khanhbro_hero_signature_drip.png",
      "https://res.cloudinary.com/dptpb60p7/image/upload/c_fill,w_800,h_1000,g_auto/f_auto,q_auto/v1793892321/fashionwekk/masterpieces/khanhbro_hero_signature_drip.png",
      "https://res.cloudinary.com/dptpb60p7/image/upload/c_crop,w_600,h_600,g_center/f_auto,q_auto/v1793892321/fashionwekk/masterpieces/khanhbro_hero_signature_drip.png"
    ],
    colors: [
      "Graphite Grey",
      "Comic Yellow"
    ],
    sizes: [
      "S",
      "M",
      "L",
      "XL",
      "XXL"
    ],
    gsm: 490,
    stock: 28,
    isFlashSale: false,
    discountPercent: 0,
    tags: [
      "KhanhBro",
      "FW26",
      "FallWinter",
      "Heavyweight",
      "Streetwear",
      "FashionWekk",
      "KhanhBro",
      "bottoms"
    ],
    rating: 4.8,
    reviewCount: 45,
    mascotSlot: "bottom",
    mascotAsset: "asset_fw_bottoms_4",
    featured: false,
    createdAt: "2026-11-06T12:29:11.801Z",
    updatedAt: "2026-11-06T12:29:11.801Z"
  },
  {
    _id: "prod_fw_79",
    title: "Cyber Toon Glitch Heavy French Terry Cargo Pants #79",
    price: 96,
    originalPrice: 96,
    category: "bottoms",
    season: "FW26",
    collectionName: "Cyber Toon Glitch",
    description: "Fall/Winter 2026 heavyweight capsule from the Cyber Toon Glitch collection. Built with armor-grade 460 GSM double-brushed French terry and water-repellent shell. Features custom embroidered wax seal patches, thick ribbed cuffs, drop-shoulder tailoring, and signature KhanhBro pop-art graphics.",
    images: [
      "https://res.cloudinary.com/dptpb60p7/image/upload/f_auto,q_auto/v1793891701/fashionwekk/masterpieces/cyber_toon_glitch_hero.png",
      "https://res.cloudinary.com/dptpb60p7/image/upload/c_fill,w_800,h_1000,g_auto/f_auto,q_auto/v1793891701/fashionwekk/masterpieces/cyber_toon_glitch_hero.png",
      "https://res.cloudinary.com/dptpb60p7/image/upload/c_crop,w_600,h_600,g_center/f_auto,q_auto/v1793891701/fashionwekk/masterpieces/cyber_toon_glitch_hero.png"
    ],
    colors: [
      "Onyx Black",
      "Sunset Coral"
    ],
    sizes: [
      "S",
      "M",
      "L",
      "XL",
      "XXL"
    ],
    gsm: 460,
    stock: 28,
    isFlashSale: false,
    discountPercent: 0,
    tags: [
      "PopGlitch",
      "FW26",
      "FallWinter",
      "Heavyweight",
      "Streetwear",
      "FashionWekk",
      "KhanhBro",
      "bottoms"
    ],
    rating: 4.9,
    reviewCount: 45,
    mascotSlot: "bottom",
    mascotAsset: "asset_fw_bottoms_5",
    featured: false,
    createdAt: "2026-11-06T13:29:11.801Z",
    updatedAt: "2026-11-06T13:29:11.801Z"
  },
  {
    _id: "prod_fw_80",
    title: "Mecha Bot Evolution Heavy French Terry Cargo Pants #80",
    price: 102,
    originalPrice: 136,
    category: "bottoms",
    season: "FW26",
    collectionName: "Mecha Bot Evolution",
    description: "Fall/Winter 2026 heavyweight capsule from the Mecha Bot Evolution collection. Built with armor-grade 480 GSM double-brushed French terry and water-repellent shell. Features custom embroidered wax seal patches, thick ribbed cuffs, drop-shoulder tailoring, and signature KhanhBro pop-art graphics.",
    images: [
      "https://res.cloudinary.com/dptpb60p7/image/upload/f_auto,q_auto/v1793891719/fashionwekk/masterpieces/mecha_bot_evolution.png",
      "https://res.cloudinary.com/dptpb60p7/image/upload/c_fill,w_800,h_1000,g_auto/f_auto,q_auto/v1793891719/fashionwekk/masterpieces/mecha_bot_evolution.png",
      "https://res.cloudinary.com/dptpb60p7/image/upload/c_crop,w_600,h_600,g_center/f_auto,q_auto/v1793891719/fashionwekk/masterpieces/mecha_bot_evolution.png"
    ],
    colors: [
      "Washed Charcoal",
      "Electric Cyan"
    ],
    sizes: [
      "S",
      "M",
      "L",
      "XL",
      "XXL"
    ],
    gsm: 480,
    stock: 28,
    isFlashSale: true,
    discountPercent: 25,
    tags: [
      "MechaBot",
      "FW26",
      "FallWinter",
      "Heavyweight",
      "Streetwear",
      "FashionWekk",
      "KhanhBro",
      "bottoms"
    ],
    rating: 5,
    reviewCount: 45,
    mascotSlot: "bottom",
    mascotAsset: "asset_fw_bottoms_1",
    featured: false,
    createdAt: "2026-11-06T14:29:11.801Z",
    updatedAt: "2026-11-06T14:29:11.801Z"
  },
  {
    _id: "prod_fw_81",
    title: "Street Ronin Brush Heavy French Terry Cargo Pants #81",
    price: 108,
    originalPrice: 108,
    category: "bottoms",
    season: "FW26",
    collectionName: "Street Ronin Brush",
    description: "Fall/Winter 2026 heavyweight capsule from the Street Ronin Brush collection. Built with armor-grade 500 GSM double-brushed French terry and water-repellent shell. Features custom embroidered wax seal patches, thick ribbed cuffs, drop-shoulder tailoring, and signature KhanhBro pop-art graphics.",
    images: [
      "https://res.cloudinary.com/dptpb60p7/image/upload/f_auto,q_auto/v1793891754/fashionwekk/masterpieces/street_ronin_brush.png",
      "https://res.cloudinary.com/dptpb60p7/image/upload/c_fill,w_800,h_1000,g_auto/f_auto,q_auto/v1793891754/fashionwekk/masterpieces/street_ronin_brush.png",
      "https://res.cloudinary.com/dptpb60p7/image/upload/c_crop,w_600,h_600,g_center/f_auto,q_auto/v1793891754/fashionwekk/masterpieces/street_ronin_brush.png"
    ],
    colors: [
      "Deep Lavender",
      "Shadow Black"
    ],
    sizes: [
      "S",
      "M",
      "L",
      "XL",
      "XXL"
    ],
    gsm: 500,
    stock: 28,
    isFlashSale: false,
    discountPercent: 0,
    tags: [
      "RoninBrush",
      "FW26",
      "FallWinter",
      "Heavyweight",
      "Streetwear",
      "FashionWekk",
      "KhanhBro",
      "bottoms"
    ],
    rating: 4.8,
    reviewCount: 45,
    mascotSlot: "bottom",
    mascotAsset: "asset_fw_bottoms_2",
    featured: false,
    createdAt: "2026-11-06T15:29:11.801Z",
    updatedAt: "2026-11-06T15:29:11.801Z"
  },
  {
    _id: "prod_fw_82",
    title: "Demon Mask Pop Art Heavy French Terry Cargo Pants #82",
    price: 114,
    originalPrice: 114,
    category: "bottoms",
    season: "FW26",
    collectionName: "Demon Mask Pop Art",
    description: "Fall/Winter 2026 heavyweight capsule from the Demon Mask Pop Art collection. Built with armor-grade 470 GSM double-brushed French terry and water-repellent shell. Features custom embroidered wax seal patches, thick ribbed cuffs, drop-shoulder tailoring, and signature KhanhBro pop-art graphics.",
    images: [
      "https://res.cloudinary.com/dptpb60p7/image/upload/f_auto,q_auto/v1793892193/fashionwekk/masterpieces/demon_mask_popart.png",
      "https://res.cloudinary.com/dptpb60p7/image/upload/c_fill,w_800,h_1000,g_auto/f_auto,q_auto/v1793892193/fashionwekk/masterpieces/demon_mask_popart.png",
      "https://res.cloudinary.com/dptpb60p7/image/upload/c_crop,w_600,h_600,g_center/f_auto,q_auto/v1793892193/fashionwekk/masterpieces/demon_mask_popart.png"
    ],
    colors: [
      "Bone White",
      "Pop Magenta"
    ],
    sizes: [
      "S",
      "M",
      "L",
      "XL",
      "XXL"
    ],
    gsm: 470,
    stock: 28,
    isFlashSale: false,
    discountPercent: 0,
    tags: [
      "DemonPop",
      "FW26",
      "FallWinter",
      "Heavyweight",
      "Streetwear",
      "FashionWekk",
      "KhanhBro",
      "bottoms"
    ],
    rating: 4.9,
    reviewCount: 45,
    mascotSlot: "bottom",
    mascotAsset: "asset_fw_bottoms_3",
    featured: false,
    createdAt: "2026-11-06T16:29:11.801Z",
    updatedAt: "2026-11-06T16:29:11.801Z"
  },
  {
    _id: "prod_fw_83",
    title: "Rogue Clan Distressed Heavy French Terry Cargo Pants #83",
    price: 120,
    originalPrice: 120,
    category: "bottoms",
    season: "FW26",
    collectionName: "Rogue Clan Distressed",
    description: "Fall/Winter 2026 heavyweight capsule from the Rogue Clan Distressed collection. Built with armor-grade 450 GSM double-brushed French terry and water-repellent shell. Features custom embroidered wax seal patches, thick ribbed cuffs, drop-shoulder tailoring, and signature KhanhBro pop-art graphics.",
    images: [
      "https://res.cloudinary.com/dptpb60p7/image/upload/f_auto,q_auto/v1793892268/fashionwekk/masterpieces/rogue_clan_distressed.png",
      "https://res.cloudinary.com/dptpb60p7/image/upload/c_fill,w_800,h_1000,g_auto/f_auto,q_auto/v1793892268/fashionwekk/masterpieces/rogue_clan_distressed.png",
      "https://res.cloudinary.com/dptpb60p7/image/upload/c_crop,w_600,h_600,g_center/f_auto,q_auto/v1793892268/fashionwekk/masterpieces/rogue_clan_distressed.png"
    ],
    colors: [
      "Neon Purple",
      "Hyper Green"
    ],
    sizes: [
      "S",
      "M",
      "L",
      "XL",
      "XXL"
    ],
    gsm: 450,
    stock: 28,
    isFlashSale: false,
    discountPercent: 0,
    tags: [
      "RogueClan",
      "FW26",
      "FallWinter",
      "Heavyweight",
      "Streetwear",
      "FashionWekk",
      "KhanhBro",
      "bottoms"
    ],
    rating: 5,
    reviewCount: 45,
    mascotSlot: "bottom",
    mascotAsset: "asset_fw_bottoms_4",
    featured: false,
    createdAt: "2026-11-06T17:29:11.801Z",
    updatedAt: "2026-11-06T17:29:11.801Z"
  },
  {
    _id: "prod_fw_84",
    title: "KhanhBro Signature Drip Heavy French Terry Cargo Pants #84",
    price: 84,
    originalPrice: 112,
    category: "bottoms",
    season: "FW26",
    collectionName: "KhanhBro Signature Drip",
    description: "Fall/Winter 2026 heavyweight capsule from the KhanhBro Signature Drip collection. Built with armor-grade 490 GSM double-brushed French terry and water-repellent shell. Features custom embroidered wax seal patches, thick ribbed cuffs, drop-shoulder tailoring, and signature KhanhBro pop-art graphics.",
    images: [
      "https://res.cloudinary.com/dptpb60p7/image/upload/f_auto,q_auto/v1793892321/fashionwekk/masterpieces/khanhbro_hero_signature_drip.png",
      "https://res.cloudinary.com/dptpb60p7/image/upload/c_fill,w_800,h_1000,g_auto/f_auto,q_auto/v1793892321/fashionwekk/masterpieces/khanhbro_hero_signature_drip.png",
      "https://res.cloudinary.com/dptpb60p7/image/upload/c_crop,w_600,h_600,g_center/f_auto,q_auto/v1793892321/fashionwekk/masterpieces/khanhbro_hero_signature_drip.png"
    ],
    colors: [
      "Graphite Grey",
      "Comic Yellow"
    ],
    sizes: [
      "S",
      "M",
      "L",
      "XL",
      "XXL"
    ],
    gsm: 490,
    stock: 28,
    isFlashSale: true,
    discountPercent: 25,
    tags: [
      "KhanhBro",
      "FW26",
      "FallWinter",
      "Heavyweight",
      "Streetwear",
      "FashionWekk",
      "KhanhBro",
      "bottoms"
    ],
    rating: 4.8,
    reviewCount: 45,
    mascotSlot: "bottom",
    mascotAsset: "asset_fw_bottoms_5",
    featured: false,
    createdAt: "2026-11-06T18:29:11.801Z",
    updatedAt: "2026-11-06T18:29:11.801Z"
  },
  {
    _id: "prod_fw_85",
    title: "Cyber Toon Glitch Heavy French Terry Cargo Pants #85",
    price: 90,
    originalPrice: 90,
    category: "bottoms",
    season: "FW26",
    collectionName: "Cyber Toon Glitch",
    description: "Fall/Winter 2026 heavyweight capsule from the Cyber Toon Glitch collection. Built with armor-grade 460 GSM double-brushed French terry and water-repellent shell. Features custom embroidered wax seal patches, thick ribbed cuffs, drop-shoulder tailoring, and signature KhanhBro pop-art graphics.",
    images: [
      "https://res.cloudinary.com/dptpb60p7/image/upload/f_auto,q_auto/v1793891701/fashionwekk/masterpieces/cyber_toon_glitch_hero.png",
      "https://res.cloudinary.com/dptpb60p7/image/upload/c_fill,w_800,h_1000,g_auto/f_auto,q_auto/v1793891701/fashionwekk/masterpieces/cyber_toon_glitch_hero.png",
      "https://res.cloudinary.com/dptpb60p7/image/upload/c_crop,w_600,h_600,g_center/f_auto,q_auto/v1793891701/fashionwekk/masterpieces/cyber_toon_glitch_hero.png"
    ],
    colors: [
      "Onyx Black",
      "Sunset Coral"
    ],
    sizes: [
      "S",
      "M",
      "L",
      "XL",
      "XXL"
    ],
    gsm: 460,
    stock: 28,
    isFlashSale: false,
    discountPercent: 0,
    tags: [
      "PopGlitch",
      "FW26",
      "FallWinter",
      "Heavyweight",
      "Streetwear",
      "FashionWekk",
      "KhanhBro",
      "bottoms"
    ],
    rating: 4.9,
    reviewCount: 45,
    mascotSlot: "bottom",
    mascotAsset: "asset_fw_bottoms_1",
    featured: false,
    createdAt: "2026-11-06T19:29:11.801Z",
    updatedAt: "2026-11-06T19:29:11.801Z"
  },
  {
    _id: "prod_fw_86",
    title: "Mecha Bot Evolution Quilted Boxy Puffer Down Jacket #86",
    price: 157,
    originalPrice: 157,
    category: "outerwear",
    season: "FW26",
    collectionName: "Mecha Bot Evolution",
    description: "Fall/Winter 2026 heavyweight capsule from the Mecha Bot Evolution collection. Built with armor-grade 480 GSM double-brushed French terry and water-repellent shell. Features custom embroidered wax seal patches, thick ribbed cuffs, drop-shoulder tailoring, and signature KhanhBro pop-art graphics.",
    images: [
      "https://res.cloudinary.com/dptpb60p7/image/upload/f_auto,q_auto/v1793891719/fashionwekk/masterpieces/mecha_bot_evolution.png",
      "https://res.cloudinary.com/dptpb60p7/image/upload/c_fill,w_800,h_1000,g_auto/f_auto,q_auto/v1793891719/fashionwekk/masterpieces/mecha_bot_evolution.png",
      "https://res.cloudinary.com/dptpb60p7/image/upload/c_crop,w_600,h_600,g_center/f_auto,q_auto/v1793891719/fashionwekk/masterpieces/mecha_bot_evolution.png"
    ],
    colors: [
      "Washed Charcoal",
      "Electric Cyan"
    ],
    sizes: [
      "S",
      "M",
      "L",
      "XL",
      "XXL"
    ],
    gsm: 480,
    stock: 28,
    isFlashSale: false,
    discountPercent: 0,
    tags: [
      "MechaBot",
      "FW26",
      "FallWinter",
      "Heavyweight",
      "Streetwear",
      "FashionWekk",
      "KhanhBro",
      "outerwear"
    ],
    rating: 5,
    reviewCount: 45,
    mascotSlot: "top",
    mascotAsset: "asset_fw_outerwear_2",
    featured: false,
    createdAt: "2026-11-06T20:29:11.801Z",
    updatedAt: "2026-11-06T20:29:11.801Z"
  },
  {
    _id: "prod_fw_87",
    title: "Street Ronin Brush Quilted Boxy Puffer Down Jacket #87",
    price: 163,
    originalPrice: 163,
    category: "outerwear",
    season: "FW26",
    collectionName: "Street Ronin Brush",
    description: "Fall/Winter 2026 heavyweight capsule from the Street Ronin Brush collection. Built with armor-grade 500 GSM double-brushed French terry and water-repellent shell. Features custom embroidered wax seal patches, thick ribbed cuffs, drop-shoulder tailoring, and signature KhanhBro pop-art graphics.",
    images: [
      "https://res.cloudinary.com/dptpb60p7/image/upload/f_auto,q_auto/v1793891754/fashionwekk/masterpieces/street_ronin_brush.png",
      "https://res.cloudinary.com/dptpb60p7/image/upload/c_fill,w_800,h_1000,g_auto/f_auto,q_auto/v1793891754/fashionwekk/masterpieces/street_ronin_brush.png",
      "https://res.cloudinary.com/dptpb60p7/image/upload/c_crop,w_600,h_600,g_center/f_auto,q_auto/v1793891754/fashionwekk/masterpieces/street_ronin_brush.png"
    ],
    colors: [
      "Deep Lavender",
      "Shadow Black"
    ],
    sizes: [
      "S",
      "M",
      "L",
      "XL",
      "XXL"
    ],
    gsm: 500,
    stock: 28,
    isFlashSale: false,
    discountPercent: 0,
    tags: [
      "RoninBrush",
      "FW26",
      "FallWinter",
      "Heavyweight",
      "Streetwear",
      "FashionWekk",
      "KhanhBro",
      "outerwear"
    ],
    rating: 4.8,
    reviewCount: 45,
    mascotSlot: "top",
    mascotAsset: "asset_fw_outerwear_3",
    featured: false,
    createdAt: "2026-11-06T21:29:11.801Z",
    updatedAt: "2026-11-06T21:29:11.801Z"
  },
  {
    _id: "prod_fw_88",
    title: "Demon Mask Pop Art Quilted Boxy Puffer Down Jacket #88",
    price: 169,
    originalPrice: 225,
    category: "outerwear",
    season: "FW26",
    collectionName: "Demon Mask Pop Art",
    description: "Fall/Winter 2026 heavyweight capsule from the Demon Mask Pop Art collection. Built with armor-grade 470 GSM double-brushed French terry and water-repellent shell. Features custom embroidered wax seal patches, thick ribbed cuffs, drop-shoulder tailoring, and signature KhanhBro pop-art graphics.",
    images: [
      "https://res.cloudinary.com/dptpb60p7/image/upload/f_auto,q_auto/v1793892193/fashionwekk/masterpieces/demon_mask_popart.png",
      "https://res.cloudinary.com/dptpb60p7/image/upload/c_fill,w_800,h_1000,g_auto/f_auto,q_auto/v1793892193/fashionwekk/masterpieces/demon_mask_popart.png",
      "https://res.cloudinary.com/dptpb60p7/image/upload/c_crop,w_600,h_600,g_center/f_auto,q_auto/v1793892193/fashionwekk/masterpieces/demon_mask_popart.png"
    ],
    colors: [
      "Bone White",
      "Pop Magenta"
    ],
    sizes: [
      "S",
      "M",
      "L",
      "XL",
      "XXL"
    ],
    gsm: 470,
    stock: 28,
    isFlashSale: true,
    discountPercent: 25,
    tags: [
      "DemonPop",
      "FW26",
      "FallWinter",
      "Heavyweight",
      "Streetwear",
      "FashionWekk",
      "KhanhBro",
      "outerwear"
    ],
    rating: 4.9,
    reviewCount: 45,
    mascotSlot: "top",
    mascotAsset: "asset_fw_outerwear_4",
    featured: false,
    createdAt: "2026-11-06T22:29:11.801Z",
    updatedAt: "2026-11-06T22:29:11.801Z"
  },
  {
    _id: "prod_fw_89",
    title: "Rogue Clan Distressed Quilted Boxy Puffer Down Jacket #89",
    price: 175,
    originalPrice: 175,
    category: "outerwear",
    season: "FW26",
    collectionName: "Rogue Clan Distressed",
    description: "Fall/Winter 2026 heavyweight capsule from the Rogue Clan Distressed collection. Built with armor-grade 450 GSM double-brushed French terry and water-repellent shell. Features custom embroidered wax seal patches, thick ribbed cuffs, drop-shoulder tailoring, and signature KhanhBro pop-art graphics.",
    images: [
      "https://res.cloudinary.com/dptpb60p7/image/upload/f_auto,q_auto/v1793892268/fashionwekk/masterpieces/rogue_clan_distressed.png",
      "https://res.cloudinary.com/dptpb60p7/image/upload/c_fill,w_800,h_1000,g_auto/f_auto,q_auto/v1793892268/fashionwekk/masterpieces/rogue_clan_distressed.png",
      "https://res.cloudinary.com/dptpb60p7/image/upload/c_crop,w_600,h_600,g_center/f_auto,q_auto/v1793892268/fashionwekk/masterpieces/rogue_clan_distressed.png"
    ],
    colors: [
      "Neon Purple",
      "Hyper Green"
    ],
    sizes: [
      "S",
      "M",
      "L",
      "XL",
      "XXL"
    ],
    gsm: 450,
    stock: 28,
    isFlashSale: false,
    discountPercent: 0,
    tags: [
      "RogueClan",
      "FW26",
      "FallWinter",
      "Heavyweight",
      "Streetwear",
      "FashionWekk",
      "KhanhBro",
      "outerwear"
    ],
    rating: 5,
    reviewCount: 45,
    mascotSlot: "top",
    mascotAsset: "asset_fw_outerwear_5",
    featured: false,
    createdAt: "2026-11-06T23:29:11.801Z",
    updatedAt: "2026-11-06T23:29:11.801Z"
  },
  {
    _id: "prod_fw_90",
    title: "KhanhBro Signature Drip Quilted Boxy Puffer Down Jacket #90",
    price: 181,
    originalPrice: 181,
    category: "outerwear",
    season: "FW26",
    collectionName: "KhanhBro Signature Drip",
    description: "Fall/Winter 2026 heavyweight capsule from the KhanhBro Signature Drip collection. Built with armor-grade 490 GSM double-brushed French terry and water-repellent shell. Features custom embroidered wax seal patches, thick ribbed cuffs, drop-shoulder tailoring, and signature KhanhBro pop-art graphics.",
    images: [
      "https://res.cloudinary.com/dptpb60p7/image/upload/f_auto,q_auto/v1793892321/fashionwekk/masterpieces/khanhbro_hero_signature_drip.png",
      "https://res.cloudinary.com/dptpb60p7/image/upload/c_fill,w_800,h_1000,g_auto/f_auto,q_auto/v1793892321/fashionwekk/masterpieces/khanhbro_hero_signature_drip.png",
      "https://res.cloudinary.com/dptpb60p7/image/upload/c_crop,w_600,h_600,g_center/f_auto,q_auto/v1793892321/fashionwekk/masterpieces/khanhbro_hero_signature_drip.png"
    ],
    colors: [
      "Graphite Grey",
      "Comic Yellow"
    ],
    sizes: [
      "S",
      "M",
      "L",
      "XL",
      "XXL"
    ],
    gsm: 490,
    stock: 28,
    isFlashSale: false,
    discountPercent: 0,
    tags: [
      "KhanhBro",
      "FW26",
      "FallWinter",
      "Heavyweight",
      "Streetwear",
      "FashionWekk",
      "KhanhBro",
      "outerwear"
    ],
    rating: 4.8,
    reviewCount: 45,
    mascotSlot: "top",
    mascotAsset: "asset_fw_outerwear_1",
    featured: false,
    createdAt: "2026-11-07T00:29:11.801Z",
    updatedAt: "2026-11-07T00:29:11.801Z"
  },
  {
    _id: "prod_fw_91",
    title: "Cyber Toon Glitch Quilted Boxy Puffer Down Jacket #91",
    price: 145,
    originalPrice: 145,
    category: "outerwear",
    season: "FW26",
    collectionName: "Cyber Toon Glitch",
    description: "Fall/Winter 2026 heavyweight capsule from the Cyber Toon Glitch collection. Built with armor-grade 460 GSM double-brushed French terry and water-repellent shell. Features custom embroidered wax seal patches, thick ribbed cuffs, drop-shoulder tailoring, and signature KhanhBro pop-art graphics.",
    images: [
      "https://res.cloudinary.com/dptpb60p7/image/upload/f_auto,q_auto/v1793891701/fashionwekk/masterpieces/cyber_toon_glitch_hero.png",
      "https://res.cloudinary.com/dptpb60p7/image/upload/c_fill,w_800,h_1000,g_auto/f_auto,q_auto/v1793891701/fashionwekk/masterpieces/cyber_toon_glitch_hero.png",
      "https://res.cloudinary.com/dptpb60p7/image/upload/c_crop,w_600,h_600,g_center/f_auto,q_auto/v1793891701/fashionwekk/masterpieces/cyber_toon_glitch_hero.png"
    ],
    colors: [
      "Onyx Black",
      "Sunset Coral"
    ],
    sizes: [
      "S",
      "M",
      "L",
      "XL",
      "XXL"
    ],
    gsm: 460,
    stock: 28,
    isFlashSale: false,
    discountPercent: 0,
    tags: [
      "PopGlitch",
      "FW26",
      "FallWinter",
      "Heavyweight",
      "Streetwear",
      "FashionWekk",
      "KhanhBro",
      "outerwear"
    ],
    rating: 4.9,
    reviewCount: 45,
    mascotSlot: "top",
    mascotAsset: "asset_fw_outerwear_2",
    featured: false,
    createdAt: "2026-11-07T01:29:11.801Z",
    updatedAt: "2026-11-07T01:29:11.801Z"
  },
  {
    _id: "prod_fw_92",
    title: "Mecha Bot Evolution Quilted Boxy Puffer Down Jacket #92",
    price: 151,
    originalPrice: 201,
    category: "outerwear",
    season: "FW26",
    collectionName: "Mecha Bot Evolution",
    description: "Fall/Winter 2026 heavyweight capsule from the Mecha Bot Evolution collection. Built with armor-grade 480 GSM double-brushed French terry and water-repellent shell. Features custom embroidered wax seal patches, thick ribbed cuffs, drop-shoulder tailoring, and signature KhanhBro pop-art graphics.",
    images: [
      "https://res.cloudinary.com/dptpb60p7/image/upload/f_auto,q_auto/v1793891719/fashionwekk/masterpieces/mecha_bot_evolution.png",
      "https://res.cloudinary.com/dptpb60p7/image/upload/c_fill,w_800,h_1000,g_auto/f_auto,q_auto/v1793891719/fashionwekk/masterpieces/mecha_bot_evolution.png",
      "https://res.cloudinary.com/dptpb60p7/image/upload/c_crop,w_600,h_600,g_center/f_auto,q_auto/v1793891719/fashionwekk/masterpieces/mecha_bot_evolution.png"
    ],
    colors: [
      "Washed Charcoal",
      "Electric Cyan"
    ],
    sizes: [
      "S",
      "M",
      "L",
      "XL",
      "XXL"
    ],
    gsm: 480,
    stock: 28,
    isFlashSale: true,
    discountPercent: 25,
    tags: [
      "MechaBot",
      "FW26",
      "FallWinter",
      "Heavyweight",
      "Streetwear",
      "FashionWekk",
      "KhanhBro",
      "outerwear"
    ],
    rating: 5,
    reviewCount: 45,
    mascotSlot: "top",
    mascotAsset: "asset_fw_outerwear_3",
    featured: false,
    createdAt: "2026-11-07T02:29:11.801Z",
    updatedAt: "2026-11-07T02:29:11.801Z"
  },
  {
    _id: "prod_fw_93",
    title: "Street Ronin Brush Quilted Boxy Puffer Down Jacket #93",
    price: 157,
    originalPrice: 157,
    category: "outerwear",
    season: "FW26",
    collectionName: "Street Ronin Brush",
    description: "Fall/Winter 2026 heavyweight capsule from the Street Ronin Brush collection. Built with armor-grade 500 GSM double-brushed French terry and water-repellent shell. Features custom embroidered wax seal patches, thick ribbed cuffs, drop-shoulder tailoring, and signature KhanhBro pop-art graphics.",
    images: [
      "https://res.cloudinary.com/dptpb60p7/image/upload/f_auto,q_auto/v1793891754/fashionwekk/masterpieces/street_ronin_brush.png",
      "https://res.cloudinary.com/dptpb60p7/image/upload/c_fill,w_800,h_1000,g_auto/f_auto,q_auto/v1793891754/fashionwekk/masterpieces/street_ronin_brush.png",
      "https://res.cloudinary.com/dptpb60p7/image/upload/c_crop,w_600,h_600,g_center/f_auto,q_auto/v1793891754/fashionwekk/masterpieces/street_ronin_brush.png"
    ],
    colors: [
      "Deep Lavender",
      "Shadow Black"
    ],
    sizes: [
      "S",
      "M",
      "L",
      "XL",
      "XXL"
    ],
    gsm: 500,
    stock: 28,
    isFlashSale: false,
    discountPercent: 0,
    tags: [
      "RoninBrush",
      "FW26",
      "FallWinter",
      "Heavyweight",
      "Streetwear",
      "FashionWekk",
      "KhanhBro",
      "outerwear"
    ],
    rating: 4.8,
    reviewCount: 45,
    mascotSlot: "top",
    mascotAsset: "asset_fw_outerwear_4",
    featured: false,
    createdAt: "2026-11-07T03:29:11.801Z",
    updatedAt: "2026-11-07T03:29:11.801Z"
  },
  {
    _id: "prod_fw_94",
    title: "Demon Mask Pop Art Quilted Boxy Puffer Down Jacket #94",
    price: 163,
    originalPrice: 163,
    category: "outerwear",
    season: "FW26",
    collectionName: "Demon Mask Pop Art",
    description: "Fall/Winter 2026 heavyweight capsule from the Demon Mask Pop Art collection. Built with armor-grade 470 GSM double-brushed French terry and water-repellent shell. Features custom embroidered wax seal patches, thick ribbed cuffs, drop-shoulder tailoring, and signature KhanhBro pop-art graphics.",
    images: [
      "https://res.cloudinary.com/dptpb60p7/image/upload/f_auto,q_auto/v1793892193/fashionwekk/masterpieces/demon_mask_popart.png",
      "https://res.cloudinary.com/dptpb60p7/image/upload/c_fill,w_800,h_1000,g_auto/f_auto,q_auto/v1793892193/fashionwekk/masterpieces/demon_mask_popart.png",
      "https://res.cloudinary.com/dptpb60p7/image/upload/c_crop,w_600,h_600,g_center/f_auto,q_auto/v1793892193/fashionwekk/masterpieces/demon_mask_popart.png"
    ],
    colors: [
      "Bone White",
      "Pop Magenta"
    ],
    sizes: [
      "S",
      "M",
      "L",
      "XL",
      "XXL"
    ],
    gsm: 470,
    stock: 28,
    isFlashSale: false,
    discountPercent: 0,
    tags: [
      "DemonPop",
      "FW26",
      "FallWinter",
      "Heavyweight",
      "Streetwear",
      "FashionWekk",
      "KhanhBro",
      "outerwear"
    ],
    rating: 4.9,
    reviewCount: 45,
    mascotSlot: "top",
    mascotAsset: "asset_fw_outerwear_5",
    featured: false,
    createdAt: "2026-11-07T04:29:11.801Z",
    updatedAt: "2026-11-07T04:29:11.801Z"
  },
  {
    _id: "prod_fw_95",
    title: "Rogue Clan Distressed Quilted Boxy Puffer Down Jacket #95",
    price: 169,
    originalPrice: 169,
    category: "outerwear",
    season: "FW26",
    collectionName: "Rogue Clan Distressed",
    description: "Fall/Winter 2026 heavyweight capsule from the Rogue Clan Distressed collection. Built with armor-grade 450 GSM double-brushed French terry and water-repellent shell. Features custom embroidered wax seal patches, thick ribbed cuffs, drop-shoulder tailoring, and signature KhanhBro pop-art graphics.",
    images: [
      "https://res.cloudinary.com/dptpb60p7/image/upload/f_auto,q_auto/v1793892268/fashionwekk/masterpieces/rogue_clan_distressed.png",
      "https://res.cloudinary.com/dptpb60p7/image/upload/c_fill,w_800,h_1000,g_auto/f_auto,q_auto/v1793892268/fashionwekk/masterpieces/rogue_clan_distressed.png",
      "https://res.cloudinary.com/dptpb60p7/image/upload/c_crop,w_600,h_600,g_center/f_auto,q_auto/v1793892268/fashionwekk/masterpieces/rogue_clan_distressed.png"
    ],
    colors: [
      "Neon Purple",
      "Hyper Green"
    ],
    sizes: [
      "S",
      "M",
      "L",
      "XL",
      "XXL"
    ],
    gsm: 450,
    stock: 28,
    isFlashSale: false,
    discountPercent: 0,
    tags: [
      "RogueClan",
      "FW26",
      "FallWinter",
      "Heavyweight",
      "Streetwear",
      "FashionWekk",
      "KhanhBro",
      "outerwear"
    ],
    rating: 5,
    reviewCount: 45,
    mascotSlot: "top",
    mascotAsset: "asset_fw_outerwear_1",
    featured: false,
    createdAt: "2026-11-07T05:29:11.801Z",
    updatedAt: "2026-11-07T05:29:11.801Z"
  },
  {
    _id: "prod_fw_96",
    title: "KhanhBro Signature Drip Heavy Ribbed Knit Beanie #96",
    price: 65,
    originalPrice: 86,
    category: "accessories",
    season: "FW26",
    collectionName: "KhanhBro Signature Drip",
    description: "Fall/Winter 2026 heavyweight capsule from the KhanhBro Signature Drip collection. Built with armor-grade 490 GSM double-brushed French terry and water-repellent shell. Features custom embroidered wax seal patches, thick ribbed cuffs, drop-shoulder tailoring, and signature KhanhBro pop-art graphics.",
    images: [
      "https://res.cloudinary.com/dptpb60p7/image/upload/f_auto,q_auto/v1793892321/fashionwekk/masterpieces/khanhbro_hero_signature_drip.png",
      "https://res.cloudinary.com/dptpb60p7/image/upload/c_fill,w_800,h_1000,g_auto/f_auto,q_auto/v1793892321/fashionwekk/masterpieces/khanhbro_hero_signature_drip.png",
      "https://res.cloudinary.com/dptpb60p7/image/upload/c_crop,w_600,h_600,g_center/f_auto,q_auto/v1793892321/fashionwekk/masterpieces/khanhbro_hero_signature_drip.png"
    ],
    colors: [
      "Graphite Grey",
      "Comic Yellow"
    ],
    sizes: [
      "One Size"
    ],
    gsm: 490,
    stock: 28,
    isFlashSale: true,
    discountPercent: 25,
    tags: [
      "KhanhBro",
      "FW26",
      "FallWinter",
      "Heavyweight",
      "Streetwear",
      "FashionWekk",
      "KhanhBro",
      "accessories"
    ],
    rating: 4.8,
    reviewCount: 45,
    mascotSlot: "head",
    mascotAsset: "asset_fw_accessories_2",
    featured: false,
    createdAt: "2026-11-07T06:29:11.801Z",
    updatedAt: "2026-11-07T06:29:11.801Z"
  },
  {
    _id: "prod_fw_97",
    title: "Cyber Toon Glitch Heavy Ribbed Knit Beanie #97",
    price: 71,
    originalPrice: 71,
    category: "accessories",
    season: "FW26",
    collectionName: "Cyber Toon Glitch",
    description: "Fall/Winter 2026 heavyweight capsule from the Cyber Toon Glitch collection. Built with armor-grade 460 GSM double-brushed French terry and water-repellent shell. Features custom embroidered wax seal patches, thick ribbed cuffs, drop-shoulder tailoring, and signature KhanhBro pop-art graphics.",
    images: [
      "https://res.cloudinary.com/dptpb60p7/image/upload/f_auto,q_auto/v1793891701/fashionwekk/masterpieces/cyber_toon_glitch_hero.png",
      "https://res.cloudinary.com/dptpb60p7/image/upload/c_fill,w_800,h_1000,g_auto/f_auto,q_auto/v1793891701/fashionwekk/masterpieces/cyber_toon_glitch_hero.png",
      "https://res.cloudinary.com/dptpb60p7/image/upload/c_crop,w_600,h_600,g_center/f_auto,q_auto/v1793891701/fashionwekk/masterpieces/cyber_toon_glitch_hero.png"
    ],
    colors: [
      "Onyx Black",
      "Sunset Coral"
    ],
    sizes: [
      "One Size"
    ],
    gsm: 460,
    stock: 28,
    isFlashSale: false,
    discountPercent: 0,
    tags: [
      "PopGlitch",
      "FW26",
      "FallWinter",
      "Heavyweight",
      "Streetwear",
      "FashionWekk",
      "KhanhBro",
      "accessories"
    ],
    rating: 4.9,
    reviewCount: 45,
    mascotSlot: "head",
    mascotAsset: "asset_fw_accessories_3",
    featured: false,
    createdAt: "2026-11-07T07:29:11.801Z",
    updatedAt: "2026-11-07T07:29:11.801Z"
  },
  {
    _id: "prod_fw_98",
    title: "Mecha Bot Evolution Heavy Ribbed Knit Beanie #98",
    price: 35,
    originalPrice: 35,
    category: "accessories",
    season: "FW26",
    collectionName: "Mecha Bot Evolution",
    description: "Fall/Winter 2026 heavyweight capsule from the Mecha Bot Evolution collection. Built with armor-grade 480 GSM double-brushed French terry and water-repellent shell. Features custom embroidered wax seal patches, thick ribbed cuffs, drop-shoulder tailoring, and signature KhanhBro pop-art graphics.",
    images: [
      "https://res.cloudinary.com/dptpb60p7/image/upload/f_auto,q_auto/v1793891719/fashionwekk/masterpieces/mecha_bot_evolution.png",
      "https://res.cloudinary.com/dptpb60p7/image/upload/c_fill,w_800,h_1000,g_auto/f_auto,q_auto/v1793891719/fashionwekk/masterpieces/mecha_bot_evolution.png",
      "https://res.cloudinary.com/dptpb60p7/image/upload/c_crop,w_600,h_600,g_center/f_auto,q_auto/v1793891719/fashionwekk/masterpieces/mecha_bot_evolution.png"
    ],
    colors: [
      "Washed Charcoal",
      "Electric Cyan"
    ],
    sizes: [
      "One Size"
    ],
    gsm: 480,
    stock: 28,
    isFlashSale: false,
    discountPercent: 0,
    tags: [
      "MechaBot",
      "FW26",
      "FallWinter",
      "Heavyweight",
      "Streetwear",
      "FashionWekk",
      "KhanhBro",
      "accessories"
    ],
    rating: 5,
    reviewCount: 45,
    mascotSlot: "head",
    mascotAsset: "asset_fw_accessories_4",
    featured: false,
    createdAt: "2026-11-07T08:29:11.801Z",
    updatedAt: "2026-11-07T08:29:11.801Z"
  },
  {
    _id: "prod_fw_99",
    title: "Street Ronin Brush Tactical Fidlock Chest Rig Bag #99",
    price: 41,
    originalPrice: 41,
    category: "accessories",
    season: "FW26",
    collectionName: "Street Ronin Brush",
    description: "Fall/Winter 2026 heavyweight capsule from the Street Ronin Brush collection. Built with armor-grade 500 GSM double-brushed French terry and water-repellent shell. Features custom embroidered wax seal patches, thick ribbed cuffs, drop-shoulder tailoring, and signature KhanhBro pop-art graphics.",
    images: [
      "https://res.cloudinary.com/dptpb60p7/image/upload/f_auto,q_auto/v1793891754/fashionwekk/masterpieces/street_ronin_brush.png",
      "https://res.cloudinary.com/dptpb60p7/image/upload/c_fill,w_800,h_1000,g_auto/f_auto,q_auto/v1793891754/fashionwekk/masterpieces/street_ronin_brush.png",
      "https://res.cloudinary.com/dptpb60p7/image/upload/c_crop,w_600,h_600,g_center/f_auto,q_auto/v1793891754/fashionwekk/masterpieces/street_ronin_brush.png"
    ],
    colors: [
      "Deep Lavender",
      "Shadow Black"
    ],
    sizes: [
      "One Size"
    ],
    gsm: 500,
    stock: 28,
    isFlashSale: false,
    discountPercent: 0,
    tags: [
      "RoninBrush",
      "FW26",
      "FallWinter",
      "Heavyweight",
      "Streetwear",
      "FashionWekk",
      "KhanhBro",
      "accessories"
    ],
    rating: 4.8,
    reviewCount: 45,
    mascotSlot: "accessory",
    mascotAsset: "asset_fw_accessories_5",
    featured: false,
    createdAt: "2026-11-07T09:29:11.801Z",
    updatedAt: "2026-11-07T09:29:11.801Z"
  },
  {
    _id: "prod_fw_100",
    title: "Demon Mask Pop Art Tactical Fidlock Chest Rig Bag #100",
    price: 47,
    originalPrice: 63,
    category: "accessories",
    season: "FW26",
    collectionName: "Demon Mask Pop Art",
    description: "Fall/Winter 2026 heavyweight capsule from the Demon Mask Pop Art collection. Built with armor-grade 470 GSM double-brushed French terry and water-repellent shell. Features custom embroidered wax seal patches, thick ribbed cuffs, drop-shoulder tailoring, and signature KhanhBro pop-art graphics.",
    images: [
      "https://res.cloudinary.com/dptpb60p7/image/upload/f_auto,q_auto/v1793892193/fashionwekk/masterpieces/demon_mask_popart.png",
      "https://res.cloudinary.com/dptpb60p7/image/upload/c_fill,w_800,h_1000,g_auto/f_auto,q_auto/v1793892193/fashionwekk/masterpieces/demon_mask_popart.png",
      "https://res.cloudinary.com/dptpb60p7/image/upload/c_crop,w_600,h_600,g_center/f_auto,q_auto/v1793892193/fashionwekk/masterpieces/demon_mask_popart.png"
    ],
    colors: [
      "Bone White",
      "Pop Magenta"
    ],
    sizes: [
      "One Size"
    ],
    gsm: 470,
    stock: 28,
    isFlashSale: true,
    discountPercent: 25,
    tags: [
      "DemonPop",
      "FW26",
      "FallWinter",
      "Heavyweight",
      "Streetwear",
      "FashionWekk",
      "KhanhBro",
      "accessories"
    ],
    rating: 4.9,
    reviewCount: 45,
    mascotSlot: "accessory",
    mascotAsset: "asset_fw_accessories_1",
    featured: false,
    createdAt: "2026-11-07T10:29:11.801Z",
    updatedAt: "2026-11-07T10:29:11.801Z"
  },
  {
    _id: "prod_collectible_1",
    title: "KhanhBro 3D Liquid Drip Mascot Art Toy 28cm (Limited 100 Pcs)",
    price: 120,
    originalPrice: 150,
    category: "collectibles",
    season: "All-Season",
    collectionName: "KhanhBro Signature Drip",
    description: "Numbered atelier art collector drop directed by KhanhBro. Stamped with authentic gold wax emblem, custom collector wooden presentation crate, and holographic verification certificate.",
    images: [
      "https://res.cloudinary.com/dptpb60p7/image/upload/f_auto,q_auto/v1793892956/fashionwekk/collectibles/collectible_khanhbro_vinyl_toy.png",
      "https://res.cloudinary.com/dptpb60p7/image/upload/c_fill,w_800,h_1000,g_auto/f_auto,q_auto/v1793892956/fashionwekk/collectibles/collectible_khanhbro_vinyl_toy.png",
      "https://res.cloudinary.com/dptpb60p7/image/upload/c_crop,w_600,h_600,g_center/f_auto,q_auto/v1793892956/fashionwekk/collectibles/collectible_khanhbro_vinyl_toy.png"
    ],
    colors: [
      "Collector Edition Monochrome",
      "Neon Gold Splash"
    ],
    sizes: [
      "One Size"
    ],
    gsm: 0,
    stock: 15,
    isFlashSale: false,
    discountPercent: 0,
    tags: [
      "Collectible",
      "ArtToy",
      "SkateDeck",
      "VIP",
      "KhanhBro",
      "FashionWekk"
    ],
    rating: 5,
    reviewCount: 42,
    mascotSlot: "accessory",
    mascotAsset: "asset_collectible_1",
    featured: true,
    createdAt: "2026-11-07T15:29:11.802Z",
    updatedAt: "2026-11-07T15:29:11.802Z"
  },
  {
    _id: "prod_collectible_2",
    title: "Cyber Toon Glitch 8-Ply Canadian Maple Skate Deck",
    price: 165,
    originalPrice: 205,
    category: "collectibles",
    season: "All-Season",
    collectionName: "KhanhBro Signature Drip",
    description: "Numbered atelier art collector drop directed by KhanhBro. Stamped with authentic gold wax emblem, custom collector wooden presentation crate, and holographic verification certificate.",
    images: [
      "https://res.cloudinary.com/dptpb60p7/image/upload/f_auto,q_auto/v1793895481/fashionwekk/accessories/accessory_demon_skate_deck.png",
      "https://res.cloudinary.com/dptpb60p7/image/upload/c_fill,w_800,h_1000,g_auto/f_auto,q_auto/v1793895481/fashionwekk/accessories/accessory_demon_skate_deck.png",
      "https://res.cloudinary.com/dptpb60p7/image/upload/c_crop,w_600,h_600,g_center/f_auto,q_auto/v1793895481/fashionwekk/accessories/accessory_demon_skate_deck.png"
    ],
    colors: [
      "Collector Edition Monochrome",
      "Neon Gold Splash"
    ],
    sizes: [
      "One Size"
    ],
    gsm: 0,
    stock: 15,
    isFlashSale: false,
    discountPercent: 0,
    tags: [
      "Collectible",
      "ArtToy",
      "SkateDeck",
      "VIP",
      "KhanhBro",
      "FashionWekk"
    ],
    rating: 5,
    reviewCount: 42,
    mascotSlot: "accessory",
    mascotAsset: "asset_collectible_2",
    featured: true,
    createdAt: "2026-11-07T15:29:11.802Z",
    updatedAt: "2026-11-07T15:29:11.802Z"
  },
  {
    _id: "prod_collectible_3",
    title: "Demon Mask Pop Art Hand-Painted Resin Bust Statue",
    price: 210,
    originalPrice: 260,
    category: "collectibles",
    season: "All-Season",
    collectionName: "KhanhBro Signature Drip",
    description: "Numbered atelier art collector drop directed by KhanhBro. Stamped with authentic gold wax emblem, custom collector wooden presentation crate, and holographic verification certificate.",
    images: [
      "https://res.cloudinary.com/dptpb60p7/image/upload/f_auto,q_auto/v1793892998/fashionwekk/collectibles/collectible_demon_resin_bust.png",
      "https://res.cloudinary.com/dptpb60p7/image/upload/c_fill,w_800,h_1000,g_auto/f_auto,q_auto/v1793892998/fashionwekk/collectibles/collectible_demon_resin_bust.png",
      "https://res.cloudinary.com/dptpb60p7/image/upload/c_crop,w_600,h_600,g_center/f_auto,q_auto/v1793892998/fashionwekk/collectibles/collectible_demon_resin_bust.png"
    ],
    colors: [
      "Collector Edition Monochrome",
      "Neon Gold Splash"
    ],
    sizes: [
      "One Size"
    ],
    gsm: 0,
    stock: 15,
    isFlashSale: false,
    discountPercent: 0,
    tags: [
      "Collectible",
      "ArtToy",
      "SkateDeck",
      "VIP",
      "KhanhBro",
      "FashionWekk"
    ],
    rating: 5,
    reviewCount: 42,
    mascotSlot: "accessory",
    mascotAsset: "asset_collectible_3",
    featured: true,
    createdAt: "2026-11-07T15:29:11.802Z",
    updatedAt: "2026-11-07T15:29:11.802Z"
  },
  {
    _id: "prod_collectible_4",
    title: "Mecha Bot Evolution Collector Vinyl Figure Metallic Edition",
    price: 255,
    originalPrice: 315,
    category: "collectibles",
    season: "All-Season",
    collectionName: "KhanhBro Signature Drip",
    description: "Numbered atelier art collector drop directed by KhanhBro. Stamped with authentic gold wax emblem, custom collector wooden presentation crate, and holographic verification certificate.",
    images: [
      "https://res.cloudinary.com/dptpb60p7/image/upload/f_auto,q_auto/v1793895619/fashionwekk/accessories/accessory_pixel_companion_plush.png",
      "https://res.cloudinary.com/dptpb60p7/image/upload/c_fill,w_800,h_1000,g_auto/f_auto,q_auto/v1793895619/fashionwekk/accessories/accessory_pixel_companion_plush.png",
      "https://res.cloudinary.com/dptpb60p7/image/upload/c_crop,w_600,h_600,g_center/f_auto,q_auto/v1793895619/fashionwekk/accessories/accessory_pixel_companion_plush.png"
    ],
    colors: [
      "Collector Edition Monochrome",
      "Neon Gold Splash"
    ],
    sizes: [
      "One Size"
    ],
    gsm: 0,
    stock: 15,
    isFlashSale: false,
    discountPercent: 0,
    tags: [
      "Collectible",
      "ArtToy",
      "SkateDeck",
      "VIP",
      "KhanhBro",
      "FashionWekk"
    ],
    rating: 5,
    reviewCount: 42,
    mascotSlot: "accessory",
    mascotAsset: "asset_collectible_4",
    featured: true,
    createdAt: "2026-11-07T15:29:11.802Z",
    updatedAt: "2026-11-07T15:29:11.802Z"
  }
];

// server/controllers/productController.ts
var fallbackProducts = fallback_products_default;
function queryFallbackProducts(query) {
  const {
    category,
    collection,
    season,
    search,
    flashSale,
    minPrice,
    maxPrice,
    sortBy = "featured",
    order = "desc",
    limit = 12,
    page = 1,
    mascotSlot
  } = query;
  let filtered = [...fallbackProducts];
  if (category && category !== "all") {
    filtered = filtered.filter((p) => (p.category || "").toLowerCase() === String(category).toLowerCase());
  }
  if (collection && collection !== "all") {
    filtered = filtered.filter((p) => p.collectionName === collection);
  }
  if (season && season !== "all") {
    filtered = filtered.filter((p) => p.season === season);
  }
  if (flashSale === "true") {
    filtered = filtered.filter((p) => p.isFlashSale);
  }
  if (mascotSlot && mascotSlot !== "all") {
    filtered = filtered.filter((p) => (p.mascotSlot || "").toLowerCase() === String(mascotSlot).toLowerCase());
  }
  if (minPrice) {
    filtered = filtered.filter((p) => p.price >= Number(minPrice));
  }
  if (maxPrice) {
    filtered = filtered.filter((p) => p.price <= Number(maxPrice));
  }
  if (search) {
    const term = String(search).toLowerCase();
    filtered = filtered.filter(
      (p) => p.title && p.title.toLowerCase().includes(term) || p.description && p.description.toLowerCase().includes(term) || p.collectionName && p.collectionName.toLowerCase().includes(term) || Array.isArray(p.tags) && p.tags.some((t) => t.toLowerCase().includes(term))
    );
  }
  if (sortBy === "featured") {
    filtered.sort((a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0) || b.rating - a.rating);
  } else if (sortBy === "price") {
    filtered.sort((a, b) => order === "asc" ? a.price - b.price : b.price - a.price);
  } else if (sortBy === "rating") {
    filtered.sort((a, b) => b.rating - a.rating);
  } else if (sortBy === "createdAt") {
    filtered.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }
  const total = filtered.length;
  const numLimit = Number(limit) || 12;
  const numPage = Number(page) || 1;
  const skip = (numPage - 1) * numLimit;
  const paginated = filtered.slice(skip, skip + numLimit);
  return {
    success: true,
    count: paginated.length,
    total,
    page: numPage,
    totalPages: Math.ceil(total / numLimit),
    data: paginated
  };
}
var getProducts = async (req, res) => {
  if (mongoose3.connection.readyState >= 1) {
    try {
      const {
        category,
        collection,
        season,
        search,
        flashSale,
        minPrice,
        maxPrice,
        sortBy = "featured",
        order = "desc",
        limit = 12,
        page = 1,
        mascotSlot
      } = req.query;
      const filter = {};
      if (category && category !== "all") {
        filter.category = category;
      }
      if (collection && collection !== "all") {
        filter.collectionName = collection;
      }
      if (season && season !== "all") {
        filter.season = season;
      }
      if (flashSale === "true") {
        filter.isFlashSale = true;
      }
      if (mascotSlot && mascotSlot !== "all") {
        filter.mascotSlot = mascotSlot;
      }
      if (minPrice || maxPrice) {
        filter.price = {};
        if (minPrice) filter.price.$gte = Number(minPrice);
        if (maxPrice) filter.price.$lte = Number(maxPrice);
      }
      if (search) {
        const searchRegex = new RegExp(String(search), "i");
        filter.$or = [
          { title: searchRegex },
          { description: searchRegex },
          { tags: searchRegex },
          { collectionName: searchRegex }
        ];
      }
      let sortCriteria = {};
      if (sortBy === "featured") {
        sortCriteria = { featured: -1, rating: -1, createdAt: -1 };
      } else {
        const sortOrder = order === "asc" ? 1 : -1;
        const sortField = String(sortBy);
        sortCriteria = { [sortField]: sortOrder };
      }
      const skip = (Number(page) - 1) * Number(limit);
      const total = await Product_default.countDocuments(filter);
      const products = await Product_default.find(filter).sort(sortCriteria).skip(skip).limit(Number(limit));
      return res.json({
        success: true,
        count: products.length,
        total,
        page: Number(page),
        totalPages: Math.ceil(total / Number(limit)),
        data: products
      });
    } catch (error) {
      console.warn("MongoDB query failed, falling back to local catalog:", error.message);
    }
  }
  const fallbackResult = queryFallbackProducts(req.query);
  return res.json(fallbackResult);
};
var getProductById = async (req, res) => {
  if (mongoose3.connection.readyState >= 1) {
    try {
      const product = await Product_default.findById(req.params.id);
      if (product) {
        return res.json({ success: true, data: product });
      }
    } catch (err) {
    }
  }
  const fallback = fallbackProducts.find((p) => p._id === req.params.id || p.id === req.params.id);
  if (fallback) {
    return res.json({ success: true, data: fallback });
  }
  if (fallbackProducts.length > 0) {
    return res.json({ success: true, data: fallbackProducts[0] });
  }
  return res.status(404).json({ success: false, message: "Product not found" });
};
var createProduct = async (req, res) => {
  try {
    if (mongoose3.connection.readyState >= 1) {
      const product = await Product_default.create(req.body);
      return res.status(201).json({ success: true, data: product });
    }
    const mockCreated = {
      _id: `prod_custom_${Date.now()}`,
      ...req.body,
      createdAt: (/* @__PURE__ */ new Date()).toISOString(),
      updatedAt: (/* @__PURE__ */ new Date()).toISOString()
    };
    return res.status(201).json({ success: true, data: mockCreated });
  } catch (error) {
    return res.status(400).json({ success: false, message: error.message });
  }
};
var updateProduct = async (req, res) => {
  try {
    if (mongoose3.connection.readyState >= 1) {
      const product = await Product_default.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true
      });
      if (product) {
        return res.json({ success: true, data: product });
      }
    }
    const fallback = fallbackProducts.find((p) => p._id === req.params.id);
    if (fallback) {
      Object.assign(fallback, req.body);
      return res.json({ success: true, data: fallback });
    }
    return res.status(404).json({ success: false, message: "Product not found" });
  } catch (error) {
    return res.status(400).json({ success: false, message: error.message });
  }
};
var deleteProduct = async (req, res) => {
  try {
    if (mongoose3.connection.readyState >= 1) {
      const product = await Product_default.findByIdAndDelete(req.params.id);
      if (product) {
        return res.json({ success: true, message: "Product deleted successfully" });
      }
    }
    return res.json({ success: true, message: "Product deleted successfully" });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// server/routes/productRoutes.ts
var router = Router();
router.get("/", getProducts);
router.get("/:id", getProductById);
router.post("/", createProduct);
router.put("/:id", updateProduct);
router.delete("/:id", deleteProduct);
var productRoutes_default = router;

// server/routes/orderRoutes.ts
import { Router as Router2 } from "express";

// server/models/Order.ts
import mongoose4, { Schema as Schema2 } from "mongoose";
var OrderItemSchema = new Schema2(
  {
    productId: { type: String, required: true },
    title: { type: String, required: true },
    price: { type: Number, required: true },
    quantity: { type: Number, required: true, min: 1 },
    size: { type: String, default: "M" },
    color: { type: String, default: "Black" },
    image: { type: String, default: "" }
  },
  { _id: false }
);
var OrderSchema = new Schema2(
  {
    orderNumber: {
      type: String,
      required: true,
      unique: true,
      default: () => "FW-" + Math.floor(1e5 + Math.random() * 9e5)
    },
    customerName: { type: String, required: true, trim: true },
    customerEmail: { type: String, required: true, trim: true, lowercase: true },
    customerPhone: { type: String, default: "" },
    shippingAddress: { type: String, required: true },
    items: { type: [OrderItemSchema], required: true },
    subtotal: { type: Number, required: true, min: 0 },
    discountAmount: { type: Number, default: 0, min: 0 },
    shippingFee: { type: Number, default: 0, min: 0 },
    totalAmount: { type: Number, required: true, min: 0 },
    couponApplied: { type: String, default: "" },
    status: {
      type: String,
      enum: ["pending", "processing", "shipped", "delivered", "cancelled"],
      default: "pending"
    },
    paymentMethod: { type: String, default: "cod" }
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);
var Order_default = mongoose4.models.Order || mongoose4.model("Order", OrderSchema);

// server/models/Coupon.ts
import mongoose5, { Schema as Schema3 } from "mongoose";
var CouponSchema = new Schema3(
  {
    code: {
      type: String,
      required: true,
      unique: true,
      uppercase: true,
      trim: true
    },
    discountPercent: { type: Number, default: 0, min: 0, max: 100 },
    fixedDiscount: { type: Number, default: 0, min: 0 },
    isFreeShipping: { type: Boolean, default: false },
    minOrderValue: { type: Number, default: 0, min: 0 },
    expiryDate: {
      type: Date,
      default: () => new Date(Date.now() + 30 * 24 * 60 * 60 * 1e3)
    },
    usageLimit: { type: Number, default: 0, min: 0 },
    // 0 = unlimited
    timesUsed: { type: Number, default: 0, min: 0 },
    isActive: { type: Boolean, default: true },
    description: { type: String, default: "" }
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);
var Coupon_default = mongoose5.models.Coupon || mongoose5.model("Coupon", CouponSchema);

// server/controllers/orderController.ts
var createOrder = async (req, res) => {
  try {
    const {
      customerName,
      customerEmail,
      customerPhone,
      shippingAddress,
      items,
      subtotal,
      discountAmount = 0,
      shippingFee = 0,
      totalAmount,
      couponApplied,
      paymentMethod = "cod"
    } = req.body;
    if (!items || items.length === 0) {
      return res.status(400).json({ success: false, message: "Cart items cannot be empty" });
    }
    if (!customerName || !customerEmail || !shippingAddress) {
      return res.status(400).json({ success: false, message: "Please provide all required shipping details" });
    }
    for (const item of items) {
      if (item.productId) {
        const product = await Product_default.findById(item.productId);
        if (!product) {
          return res.status(400).json({
            success: false,
            message: `Product "${item.title}" does not exist in inventory.`
          });
        }
        if (product.stock <= 0) {
          return res.status(400).json({
            success: false,
            message: `Product "${product.title}" is out of stock. Please update your bag.`
          });
        }
        if (item.quantity > product.stock) {
          return res.status(400).json({
            success: false,
            message: `Product "${product.title}" only has ${product.stock} items left in stock, cannot fulfill requested quantity (${item.quantity}).`
          });
        }
      }
    }
    const order = await Order_default.create({
      customerName,
      customerEmail,
      customerPhone,
      shippingAddress,
      items,
      subtotal,
      discountAmount,
      shippingFee,
      totalAmount,
      couponApplied,
      paymentMethod,
      status: "pending"
    });
    for (const item of items) {
      if (item.productId) {
        await Product_default.findByIdAndUpdate(item.productId, {
          $inc: { stock: -item.quantity }
        }).catch(() => null);
      }
    }
    if (couponApplied) {
      await Coupon_default.findOneAndUpdate(
        { code: String(couponApplied).trim().toUpperCase() },
        { $inc: { timesUsed: 1 } }
      ).catch(() => null);
    }
    res.status(201).json({ success: true, data: order });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};
var getOrders = async (req, res) => {
  try {
    const { status, limit = 50, page = 1 } = req.query;
    const filter = {};
    if (status && status !== "all") {
      filter.status = status;
    }
    const total = await Order_default.countDocuments(filter);
    const orders = await Order_default.find(filter).sort({ createdAt: -1 }).skip((Number(page) - 1) * Number(limit)).limit(Number(limit));
    res.json({
      success: true,
      count: orders.length,
      total,
      page: Number(page),
      data: orders
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
var getOrderById = async (req, res) => {
  try {
    const order = await Order_default.findOne({
      $or: [{ _id: req.params.id }, { orderNumber: req.params.id }]
    });
    if (!order) {
      return res.status(404).json({ success: false, message: "Order not found" });
    }
    res.json({ success: true, data: order });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
var updateOrderStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const order = await Order_default.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true, runValidators: true }
    );
    if (!order) {
      return res.status(404).json({ success: false, message: "Order not found" });
    }
    res.json({ success: true, data: order });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};
var getAnalytics = async (_req, res) => {
  try {
    const totalOrders = await Order_default.countDocuments();
    const orders = await Order_default.find();
    const totalRevenue = orders.reduce((sum, order) => sum + (order.totalAmount || 0), 0);
    const totalProducts = await Product_default.countDocuments();
    const statusCounts = {
      pending: orders.filter((o) => o.status === "pending").length,
      processing: orders.filter((o) => o.status === "processing").length,
      shipped: orders.filter((o) => o.status === "shipped").length,
      delivered: orders.filter((o) => o.status === "delivered").length,
      cancelled: orders.filter((o) => o.status === "cancelled").length
    };
    const recentOrders = orders.slice(0, 5);
    res.json({
      success: true,
      data: {
        totalRevenue: Math.round(totalRevenue * 100) / 100,
        totalOrders,
        totalProducts,
        statusCounts,
        recentOrders
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// server/routes/orderRoutes.ts
var router2 = Router2();
router2.post("/", createOrder);
router2.get("/", getOrders);
router2.get("/analytics/overview", getAnalytics);
router2.get("/:id", getOrderById);
router2.patch("/:id/status", updateOrderStatus);
var orderRoutes_default = router2;

// server/routes/couponRoutes.ts
import { Router as Router3 } from "express";

// server/controllers/couponController.ts
import mongoose6 from "mongoose";
var FALLBACK_COUPONS = [
  {
    _id: "coupon_toon10",
    code: "TOON10",
    discountPercent: 10,
    fixedDiscount: 0,
    isFreeShipping: false,
    minOrderValue: 0,
    description: "Instant 10% OFF on all cartoon streetwear drops",
    expiryDate: /* @__PURE__ */ new Date("2028-12-31"),
    usageLimit: 0,
    timesUsed: 0,
    isActive: true
  },
  {
    _id: "coupon_freeship",
    code: "FREESHIP",
    discountPercent: 0,
    fixedDiscount: 0,
    isFreeShipping: true,
    minOrderValue: 75,
    description: "Free Worldwide Express Shipping on orders over $75",
    expiryDate: /* @__PURE__ */ new Date("2028-12-31"),
    usageLimit: 0,
    timesUsed: 0,
    isActive: true
  },
  {
    _id: "coupon_cyber20",
    code: "CYBER20",
    discountPercent: 20,
    fixedDiscount: 0,
    isFreeShipping: false,
    minOrderValue: 120,
    description: "20% Mega Pop Discount on orders over $120",
    expiryDate: /* @__PURE__ */ new Date("2028-12-31"),
    usageLimit: 0,
    timesUsed: 0,
    isActive: true
  },
  {
    _id: "coupon_neotokyo30",
    code: "NEOTOKYO30",
    discountPercent: 30,
    fixedDiscount: 0,
    isFreeShipping: false,
    minOrderValue: 200,
    description: "30% VIP Collector pass for elite streetwear hauls",
    expiryDate: /* @__PURE__ */ new Date("2028-12-31"),
    usageLimit: 0,
    timesUsed: 0,
    isActive: true
  },
  {
    _id: "coupon_luckyspin",
    code: "LUCKYSPIN",
    discountPercent: 15,
    fixedDiscount: 0,
    isFreeShipping: false,
    minOrderValue: 50,
    description: "Mystery Wheel Lucky Spin 15% Pop Discount",
    expiryDate: /* @__PURE__ */ new Date("2028-12-31"),
    usageLimit: 0,
    timesUsed: 0,
    isActive: true
  }
];
var validateCoupon = async (req, res) => {
  try {
    const { code, cartTotal = 0 } = req.body;
    if (!code) {
      return res.status(400).json({ success: false, message: "Coupon code is required" });
    }
    const cleanCode = String(code).trim().toUpperCase();
    let coupon = null;
    if (mongoose6.connection.readyState >= 1) {
      try {
        coupon = await Coupon_default.findOne({ code: cleanCode });
      } catch (err) {
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
    const now = /* @__PURE__ */ new Date();
    const expiry = new Date(coupon.expiryDate);
    if (expiry < now) {
      const formattedDate = expiry.toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric"
      });
      return res.status(400).json({
        success: false,
        message: `Coupon '${cleanCode}' expired on ${formattedDate}`
      });
    }
    if (coupon.usageLimit > 0 && coupon.timesUsed >= coupon.usageLimit) {
      return res.status(400).json({
        success: false,
        message: `Coupon '${cleanCode}' has reached its maximum redemption limit (${coupon.usageLimit} uses)`
      });
    }
    if (cartTotal < coupon.minOrderValue) {
      return res.status(400).json({
        success: false,
        message: `Cart subtotal must be at least $${coupon.minOrderValue.toFixed(2)} (current subtotal is $${Number(cartTotal).toFixed(2)}) to activate this coupon`
      });
    }
    let discountAmount = 0;
    if (coupon.discountPercent > 0) {
      discountAmount = cartTotal * coupon.discountPercent / 100;
    } else if (coupon.fixedDiscount && coupon.fixedDiscount > 0) {
      discountAmount = Math.min(coupon.fixedDiscount, cartTotal);
    }
    return res.json({
      success: true,
      message: "Coupon successfully validated and applied!",
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
        isActive: coupon.isActive
      }
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};
var getCoupons = async (_req, res) => {
  try {
    if (mongoose6.connection.readyState >= 1) {
      const coupons = await Coupon_default.find().sort({ createdAt: -1 });
      return res.json({ success: true, count: coupons.length, data: coupons });
    }
    return res.json({ success: true, count: FALLBACK_COUPONS.length, data: FALLBACK_COUPONS });
  } catch (error) {
    return res.json({ success: true, count: FALLBACK_COUPONS.length, data: FALLBACK_COUPONS });
  }
};
var createCoupon = async (req, res) => {
  try {
    const {
      code,
      discountPercent = 0,
      fixedDiscount = 0,
      isFreeShipping = false,
      minOrderValue = 0,
      expiryDate,
      usageLimit = 0,
      description = "",
      isActive = true
    } = req.body;
    if (!code || !String(code).trim()) {
      return res.status(400).json({ success: false, message: "Coupon code is required" });
    }
    const cleanCode = String(code).trim().toUpperCase();
    const existing = await Coupon_default.findOne({ code: cleanCode });
    if (existing) {
      return res.status(400).json({
        success: false,
        message: `A coupon with code '${cleanCode}' already exists in the vault`
      });
    }
    const parsedExpiry = expiryDate ? new Date(expiryDate) : new Date(Date.now() + 30 * 24 * 60 * 60 * 1e3);
    const coupon = await Coupon_default.create({
      code: cleanCode,
      discountPercent: Number(discountPercent) || 0,
      fixedDiscount: Number(fixedDiscount) || 0,
      isFreeShipping: Boolean(isFreeShipping),
      minOrderValue: Number(minOrderValue) || 0,
      expiryDate: parsedExpiry,
      usageLimit: Number(usageLimit) || 0,
      timesUsed: 0,
      description: String(description).trim(),
      isActive: Boolean(isActive)
    });
    res.status(201).json({ success: true, message: "Coupon created successfully in vault", data: coupon });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};
var updateCoupon = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = { ...req.body };
    if (updates.code) {
      updates.code = String(updates.code).trim().toUpperCase();
    }
    if (updates.expiryDate) {
      updates.expiryDate = new Date(updates.expiryDate);
    }
    const coupon = await Coupon_default.findByIdAndUpdate(id, updates, {
      new: true,
      runValidators: true
    });
    if (!coupon) {
      return res.status(404).json({ success: false, message: "Coupon not found" });
    }
    res.json({ success: true, message: "Coupon updated successfully", data: coupon });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};
var deleteCoupon = async (req, res) => {
  try {
    const coupon = await Coupon_default.findByIdAndDelete(req.params.id);
    if (!coupon) {
      return res.status(404).json({ success: false, message: "Coupon not found" });
    }
    res.json({ success: true, message: "Coupon deleted successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// server/routes/couponRoutes.ts
var router3 = Router3();
router3.post("/validate", validateCoupon);
router3.get("/", getCoupons);
router3.post("/", createCoupon);
router3.put("/:id", updateCoupon);
router3.delete("/:id", deleteCoupon);
var couponRoutes_default = router3;

// api/index.ts
dotenv2.config();
var app = express();
app.use(cors({
  origin: "*",
  credentials: true
}));
app.use(express.json());
app.use(async (_req, _res, next) => {
  try {
    await connectDB();
  } catch (err) {
    console.warn("MongoDB connection deferred:", err.message);
  }
  next();
});
app.use(["/api/products", "/products"], productRoutes_default);
app.use(["/api/orders", "/orders"], orderRoutes_default);
app.use(["/api/coupons", "/coupons"], couponRoutes_default);
app.get(["/api/health", "/health"], (_req, res) => {
  res.json({
    status: "ok",
    timestamp: (/* @__PURE__ */ new Date()).toISOString(),
    service: "FashionWekk Vercel Serverless API",
    environment: "production"
  });
});
app.use((err, _req, res, _next) => {
  console.error("Vercel API Unhandled Error:", err);
  res.status(500).json({
    success: false,
    message: err.message || "Internal Server Error"
  });
});
var index_default = app;
export {
  index_default as default
};
