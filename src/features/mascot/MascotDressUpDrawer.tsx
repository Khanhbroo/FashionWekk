import React, { useEffect, useRef, useState } from 'react';
import { X, ShoppingBag, RotateCcw, Shirt } from 'lucide-react';
import { useMascotStore } from '../../stores/mascotStore';
import { useCartStore } from '../../stores/cartStore';
import { useSoundFx } from '../../hooks/useSoundFx';
import { MascotAvatar } from './MascotAvatar';
import { animateDrawerOpen, animateDrawerClose, animateSquashAndStretch, useBodyScrollLock } from '../../utils/animations';
import { Product } from '../../types';
import { MASCOT_SLOT_CONFIG, MascotSlot, getMascotSlotBadge } from './mascotLabels';

export const ATELIER_WARDROBE_PRESETS: Product[] = [
  // Tops Collection
  {
    _id: 'mascot-preset-1',
    title: 'KhanhBro 3D Liquid Drip Hoodie',
    price: 125,
    originalPrice: 155,
    category: 'hoodies',
    collectionName: 'KhanhBro Signature Drip',
    description: 'Flagship 480 GSM French terry hoodie with 3D liquid cartoon splatters.',
    images: ['https://res.cloudinary.com/dptpb60p7/image/upload/f_auto,q_auto/fashionwekk/mascot/mascot_liquid_drip_hoodie.png'],
    colors: ['Onyx Black', 'Sunset Coral'],
    sizes: ['S', 'M', 'L', 'XL'],
    gsm: 480,
    stock: 25,
    isFlashSale: true,
    discountPercent: 20,
    tags: ['KhanhBro', 'Hoodie', '3DToon'],
    rating: 5.0,
    reviewCount: 42,
    mascotSlot: 'top',
    mascotAsset: 'khanhbro_hoodie',
    featured: true,
    createdAt: new Date().toISOString(),
  },
  {
    _id: 'mascot-preset-2',
    title: 'Cyber Toon Glitch Graphic Tee',
    price: 48,
    originalPrice: 65,
    category: 'tees',
    collectionName: 'Cyber Toon Glitch',
    description: 'Distorted electric neon CRT scanline graphic tee.',
    images: ['https://res.cloudinary.com/dptpb60p7/image/upload/f_auto,q_auto/fashionwekk/mascot/mascot_cyber_glitch_tee.png'],
    colors: ['Washed Charcoal', 'Electric Cyan'],
    sizes: ['S', 'M', 'L', 'XL'],
    gsm: 460,
    stock: 30,
    isFlashSale: false,
    discountPercent: 0,
    tags: ['CyberToon', 'Tee'],
    rating: 4.8,
    reviewCount: 36,
    mascotSlot: 'top',
    mascotAsset: 'cyber_tee',
    featured: true,
    createdAt: new Date().toISOString(),
  },
  {
    _id: 'mascot-preset-top-3',
    title: 'KhanhBro Hero Signature Drip Hoodie',
    price: 140,
    originalPrice: 175,
    category: 'hoodies',
    collectionName: 'KhanhBro Signature Drip',
    description: 'Ultra-heavyweight 500 GSM luxury hoodie with signature KhanhBro pop-art graphics.',
    images: ['https://res.cloudinary.com/dptpb60p7/image/upload/f_auto,q_auto/fashionwekk/masterpieces/khanhbro_hero_signature_drip.png'],
    colors: ['Onyx Black', 'Acid Lime'],
    sizes: ['S', 'M', 'L', 'XL'],
    gsm: 500,
    stock: 18,
    isFlashSale: true,
    discountPercent: 20,
    tags: ['KhanhBro', 'HeroDrip', 'Grail'],
    rating: 5.0,
    reviewCount: 96,
    mascotSlot: 'top',
    mascotAsset: 'khanhbro_hero_hoodie',
    featured: true,
    createdAt: new Date().toISOString(),
  },
  {
    _id: 'mascot-preset-top-4',
    title: 'Cyber Toon Glitch Hero Pullover',
    price: 110,
    originalPrice: 135,
    category: 'outerwear',
    collectionName: 'Cyber Toon Glitch',
    description: 'Cybernetic pop-art anime character oversized pullover with neon chromatic aberration.',
    images: ['https://res.cloudinary.com/dptpb60p7/image/upload/f_auto,q_auto/fashionwekk/masterpieces/cyber_toon_glitch_hero.png'],
    colors: ['Cyber Black', 'Neon Magenta'],
    sizes: ['S', 'M', 'L', 'XL'],
    gsm: 440,
    stock: 22,
    isFlashSale: false,
    discountPercent: 0,
    tags: ['CyberToon', 'HeroPullover'],
    rating: 4.9,
    reviewCount: 54,
    mascotSlot: 'top',
    mascotAsset: 'cyber_hero_pullover',
    featured: true,
    createdAt: new Date().toISOString(),
  },
  {
    _id: 'mascot-preset-top-5',
    title: 'Mecha Bot Evolution Tech Hoodie',
    price: 98,
    originalPrice: 125,
    category: 'hoodies',
    collectionName: 'Mecha Bot Evolution',
    description: 'Articulated tactical tech hoodie with line-art mecha robot schematics.',
    images: ['https://res.cloudinary.com/dptpb60p7/image/upload/f_auto,q_auto/fashionwekk/masterpieces/mecha_bot_evolution.png'],
    colors: ['Gunmetal Grey', 'Hyper Green'],
    sizes: ['S', 'M', 'L', 'XL'],
    gsm: 480,
    stock: 20,
    isFlashSale: true,
    discountPercent: 22,
    tags: ['MechaBot', 'TechWear'],
    rating: 4.9,
    reviewCount: 41,
    mascotSlot: 'top',
    mascotAsset: 'mecha_tech_hoodie',
    featured: true,
    createdAt: new Date().toISOString(),
  },
  {
    _id: 'mascot-preset-top-6',
    title: 'Street Ronin Ink Kanji Knit',
    price: 115,
    originalPrice: 145,
    category: 'hoodies',
    collectionName: 'Street Ronin Brush',
    description: 'Calligraphic sumi-e ink splatter brushed Japanese streetwear knit.',
    images: ['https://res.cloudinary.com/dptpb60p7/image/upload/f_auto,q_auto/fashionwekk/masterpieces/street_ronin_brush.png'],
    colors: ['Jet Black', 'Crimson Ink'],
    sizes: ['S', 'M', 'L', 'XL'],
    gsm: 480,
    stock: 14,
    isFlashSale: false,
    discountPercent: 0,
    tags: ['StreetRonin', 'KanjiKnit'],
    rating: 5.0,
    reviewCount: 63,
    mascotSlot: 'top',
    mascotAsset: 'ronin_kanji_knit',
    featured: true,
    createdAt: new Date().toISOString(),
  },
  {
    _id: 'mascot-preset-top-7',
    title: 'Pixel Quest 8-Bit Arcade Sweatshirt',
    price: 85,
    originalPrice: 105,
    category: 'hoodies',
    collectionName: 'Pixel Quest 8-Bit',
    description: 'Heavyweight loopback arcade graphic sweatshirt with retro pixel character sprite.',
    images: ['https://res.cloudinary.com/dptpb60p7/image/upload/f_auto,q_auto/fashionwekk/masterpieces/pixel_quest_8bit.png'],
    colors: ['Deep Charcoal', 'Pixel Cyan'],
    sizes: ['S', 'M', 'L', 'XL'],
    gsm: 450,
    stock: 26,
    isFlashSale: false,
    discountPercent: 0,
    tags: ['PixelQuest', 'ArcadeSweatshirt'],
    rating: 4.8,
    reviewCount: 38,
    mascotSlot: 'top',
    mascotAsset: 'pixel_arcade_sweatshirt',
    featured: true,
    createdAt: new Date().toISOString(),
  },
  {
    _id: 'mascot-preset-top-8',
    title: 'Solar Flare Washed Climax Vest',
    price: 92,
    originalPrice: 115,
    category: 'outerwear',
    collectionName: 'Solar Flare Washed',
    description: 'Washed charcoal comic climax energy burst streetwear utility vest.',
    images: ['https://res.cloudinary.com/dptpb60p7/image/upload/f_auto,q_auto/fashionwekk/masterpieces/solar_flare_washed.png'],
    colors: ['Washed Charcoal', 'Fiery Orange'],
    sizes: ['S', 'M', 'L', 'XL'],
    gsm: 420,
    stock: 16,
    isFlashSale: true,
    discountPercent: 20,
    tags: ['SolarFlare', 'Outerwear'],
    rating: 4.9,
    reviewCount: 29,
    mascotSlot: 'top',
    mascotAsset: 'solar_vest',
    featured: true,
    createdAt: new Date().toISOString(),
  },
  {
    _id: 'mascot-preset-top-9',
    title: 'Mecha Bot Wool Leather Varsity Jacket',
    price: 148,
    originalPrice: 185,
    category: 'outerwear',
    collectionName: 'Mecha Bot Evolution',
    description: 'Heavyweight melton wool varsity jacket with articulated leather sleeves and mecha robot patches.',
    images: ['https://res.cloudinary.com/dptpb60p7/image/upload/f_auto,q_auto/v1793894818/fashionwekk/tops/top_mecha_varsity_jacket.png'],
    colors: ['Gunmetal Grey', 'Hyper Green'],
    sizes: ['S', 'M', 'L', 'XL'],
    gsm: 520,
    stock: 15,
    isFlashSale: true,
    discountPercent: 20,
    tags: ['MechaBot', 'VarsityJacket', 'Grail'],
    rating: 5.0,
    reviewCount: 37,
    mascotSlot: 'top',
    mascotAsset: 'mecha_varsity_jacket',
    featured: true,
    createdAt: new Date().toISOString(),
  },
  {
    _id: 'mascot-preset-top-10',
    title: 'Cyber Toon CRT Acid Glitch Hoodie',
    price: 128,
    originalPrice: 160,
    category: 'hoodies',
    collectionName: 'Cyber Toon Glitch',
    description: 'Boxy drop-shoulder 500 GSM French terry hoodie with distorted neon CRT scanlines and dripping silicone ink.',
    images: ['https://res.cloudinary.com/dptpb60p7/image/upload/f_auto,q_auto/v1793894819/fashionwekk/tops/top_cyber_toon_acid_hoodie.png'],
    colors: ['Washed Charcoal', 'Neon Magenta'],
    sizes: ['S', 'M', 'L', 'XL'],
    gsm: 500,
    stock: 22,
    isFlashSale: false,
    discountPercent: 0,
    tags: ['CyberToon', 'AcidHoodie'],
    rating: 4.9,
    reviewCount: 44,
    mascotSlot: 'top',
    mascotAsset: 'cyber_acid_hoodie',
    featured: true,
    createdAt: new Date().toISOString(),
  },
  {
    _id: 'mascot-preset-top-11',
    title: 'Liquid Drip Technical Crop Windbreaker',
    price: 118,
    originalPrice: 145,
    category: 'outerwear',
    collectionName: 'KhanhBro Signature Drip',
    description: 'Ultra-lightweight weatherproof nylon windbreaker with 3D liquid cartoon splatters and neon bungee cords.',
    images: ['https://res.cloudinary.com/dptpb60p7/image/upload/f_auto,q_auto/v1793894820/fashionwekk/tops/top_liquid_drip_crop_windbreaker.png'],
    colors: ['Onyx Black', 'Acid Lime'],
    sizes: ['S', 'M', 'L', 'XL'],
    gsm: 380,
    stock: 18,
    isFlashSale: true,
    discountPercent: 18,
    tags: ['KhanhBro', 'Windbreaker', 'Techwear'],
    rating: 4.8,
    reviewCount: 29,
    mascotSlot: 'top',
    mascotAsset: 'liquid_windbreaker',
    featured: true,
    createdAt: new Date().toISOString(),
  },
  {
    _id: 'mascot-preset-top-12',
    title: 'Pixel Quest 8-Bit Reversible Bomber',
    price: 135,
    originalPrice: 168,
    category: 'outerwear',
    collectionName: 'Pixel Quest 8-Bit',
    description: 'Heavy reversible flight satin bomber with 8-bit arcade sprite chenille patch on back.',
    images: ['https://res.cloudinary.com/dptpb60p7/image/upload/f_auto,q_auto/v1793894821/fashionwekk/tops/top_pixel_retro_bomber.png'],
    colors: ['Deep Charcoal', 'Pixel Cyan'],
    sizes: ['S', 'M', 'L', 'XL'],
    gsm: 460,
    stock: 20,
    isFlashSale: false,
    discountPercent: 0,
    tags: ['PixelQuest', 'BomberJacket'],
    rating: 5.0,
    reviewCount: 52,
    mascotSlot: 'top',
    mascotAsset: 'pixel_bomber',
    featured: true,
    createdAt: new Date().toISOString(),
  },
  {
    _id: 'mascot-preset-top-13',
    title: 'Street Ronin Ink Noragi Kimono Hoodie',
    price: 132,
    originalPrice: 165,
    category: 'hoodies',
    collectionName: 'Street Ronin Brush',
    description: 'Samurai noragi kimono hoodie in indigo raw canvas with calligraphic sumi-e ink brush splatter art.',
    images: ['https://res.cloudinary.com/dptpb60p7/image/upload/f_auto,q_auto/v1793894821/fashionwekk/tops/top_ronin_brush_kimono_hoodie.png'],
    colors: ['Indigo Raw', 'Crimson Ink'],
    sizes: ['S', 'M', 'L', 'XL'],
    gsm: 480,
    stock: 16,
    isFlashSale: false,
    discountPercent: 0,
    tags: ['StreetRonin', 'Noragi', 'KimonoHoodie'],
    rating: 5.0,
    reviewCount: 48,
    mascotSlot: 'top',
    mascotAsset: 'ronin_kimono_hoodie',
    featured: true,
    createdAt: new Date().toISOString(),
  },
  {
    _id: 'mascot-preset-top-14',
    title: 'Solar Flare Washed Gradient Down Puffer',
    price: 155,
    originalPrice: 195,
    category: 'outerwear',
    collectionName: 'Solar Flare Washed',
    description: 'Cropped boxy down puffer jacket in washed copper and fiery orange gradient with cartoon sunbeam drip quilting.',
    images: ['https://res.cloudinary.com/dptpb60p7/image/upload/f_auto,q_auto/v1793894822/fashionwekk/tops/top_solar_flare_puffer.png'],
    colors: ['Washed Copper', 'Solar Gradient'],
    sizes: ['S', 'M', 'L', 'XL'],
    gsm: 520,
    stock: 12,
    isFlashSale: true,
    discountPercent: 20,
    tags: ['SolarFlare', 'DownPuffer', 'Grail'],
    rating: 4.9,
    reviewCount: 35,
    mascotSlot: 'top',
    mascotAsset: 'solar_flare_puffer',
    featured: true,
    createdAt: new Date().toISOString(),
  },

  // Bottoms Collection
  {
    _id: 'mascot-preset-3',
    title: 'Mecha Bot Evolution Tactical Cargo',
    price: 88,
    originalPrice: 110,
    category: 'bottoms',
    collectionName: 'Mecha Bot Evolution',
    description: 'Tactical cargo apparel with cybernetic robot line-art accents.',
    images: ['https://res.cloudinary.com/dptpb60p7/image/upload/f_auto,q_auto/fashionwekk/mascot/mascot_mecha_cargo.png'],
    colors: ['Shadow Black', 'Hyper Green'],
    sizes: ['S', 'M', 'L', 'XL'],
    gsm: 480,
    stock: 20,
    isFlashSale: false,
    discountPercent: 0,
    tags: ['MechaBot', 'Cargo'],
    rating: 4.9,
    reviewCount: 28,
    mascotSlot: 'bottom',
    mascotAsset: 'mecha_cargo',
    featured: true,
    createdAt: new Date().toISOString(),
  },
  {
    _id: 'mascot-preset-4',
    title: 'Rogue Clan Distressed Raw Pants',
    price: 82,
    originalPrice: 95,
    category: 'bottoms',
    collectionName: 'Rogue Clan Distressed',
    description: 'Artisanal enzyme-washed raw-edge distressed vintage streetwear bottoms.',
    images: ['https://res.cloudinary.com/dptpb60p7/image/upload/f_auto,q_auto/fashionwekk/masterpieces/rogue_clan_distressed.png'],
    colors: ['Graphite Grey', 'Comic Yellow'],
    sizes: ['S', 'M', 'L', 'XL'],
    gsm: 450,
    stock: 18,
    isFlashSale: false,
    discountPercent: 0,
    tags: ['RogueClan', 'Pants'],
    rating: 4.7,
    reviewCount: 19,
    mascotSlot: 'bottom',
    mascotAsset: 'rogue_pants',
    featured: true,
    createdAt: new Date().toISOString(),
  },
  {
    _id: 'mascot-preset-bottom-3',
    title: 'Chibi Harajuku Slime Cargo Shorts',
    price: 74,
    originalPrice: 90,
    category: 'bottoms',
    collectionName: 'Chibi Harajuku Splash',
    description: 'Oversized boxy tactical shorts in pastel lavender with melting slime yellow liquid drip pockets.',
    images: ['https://res.cloudinary.com/dptpb60p7/image/upload/f_auto,q_auto/fashionwekk/masterpieces/chibi_harajuku_splash.png'],
    colors: ['Lavender Mist', 'Slime Yellow'],
    sizes: ['S', 'M', 'L', 'XL'],
    gsm: 400,
    stock: 22,
    isFlashSale: true,
    discountPercent: 18,
    tags: ['ChibiSplash', 'Bottoms', 'Shorts'],
    rating: 4.8,
    reviewCount: 31,
    mascotSlot: 'bottom',
    mascotAsset: 'harajuku_shorts',
    featured: true,
    createdAt: new Date().toISOString(),
  },
  {
    _id: 'mascot-preset-bottom-4',
    title: 'Cyber Toon Multi-Pocket Cargo Pants',
    price: 95,
    originalPrice: 120,
    category: 'bottoms',
    collectionName: 'Cyber Toon Glitch',
    description: 'Multi-pocket tactical streetwear cargo pants with neon cyan magnetic buckles, hanging straps, and cyber scanline accents.',
    images: ['https://res.cloudinary.com/dptpb60p7/image/upload/f_auto,q_auto/v1793895258/fashionwekk/bottoms/bottom_cyber_cargo_pants.png'],
    colors: ['Jet Black', 'Electric Cyan'],
    sizes: ['S', 'M', 'L', 'XL'],
    gsm: 480,
    stock: 24,
    isFlashSale: true,
    discountPercent: 20,
    tags: ['CyberToon', 'Cargo', 'Techwear'],
    rating: 5.0,
    reviewCount: 41,
    mascotSlot: 'bottom',
    mascotAsset: 'cyber_cargo_pants',
    featured: true,
    createdAt: new Date().toISOString(),
  },
  {
    _id: 'mascot-preset-bottom-5',
    title: 'Rogue Clan Distressed Graffiti Denim',
    price: 115,
    originalPrice: 145,
    category: 'bottoms',
    collectionName: 'Rogue Clan Distressed',
    description: 'Heavyweight 14oz raw selvedge denim jeans with artisanal knee rips, hand-painted pop-art graffiti splashes, and raw frayed hems.',
    images: ['https://res.cloudinary.com/dptpb60p7/image/upload/f_auto,q_auto/v1793895260/fashionwekk/bottoms/bottom_distressed_graffiti_denim.png'],
    colors: ['Faded Charcoal', 'Graffiti Multi'],
    sizes: ['S', 'M', 'L', 'XL'],
    gsm: 520,
    stock: 16,
    isFlashSale: false,
    discountPercent: 0,
    tags: ['RogueClan', 'Denim', 'Graffiti'],
    rating: 4.9,
    reviewCount: 38,
    mascotSlot: 'bottom',
    mascotAsset: 'distressed_graffiti_denim',
    featured: true,
    createdAt: new Date().toISOString(),
  },
  {
    _id: 'mascot-preset-bottom-6',
    title: 'Mecha Bot Technical Parachute Track',
    price: 105,
    originalPrice: 130,
    category: 'bottoms',
    collectionName: 'Mecha Bot Evolution',
    description: 'Wide-leg technical parachute track pants in matte gunmetal grey with neon lime bungee cords and articulated knee darts.',
    images: ['https://res.cloudinary.com/dptpb60p7/image/upload/f_auto,q_auto/v1793895261/fashionwekk/bottoms/bottom_mecha_parachute_track.png'],
    colors: ['Gunmetal Grey', 'Hyper Green'],
    sizes: ['S', 'M', 'L', 'XL'],
    gsm: 440,
    stock: 20,
    isFlashSale: false,
    discountPercent: 0,
    tags: ['MechaBot', 'ParachuteTrack', 'Techwear'],
    rating: 4.8,
    reviewCount: 33,
    mascotSlot: 'bottom',
    mascotAsset: 'mecha_parachute_track',
    featured: true,
    createdAt: new Date().toISOString(),
  },
  {
    _id: 'mascot-preset-bottom-7',
    title: 'Harajuku Pleated Liquid Drip Shorts',
    price: 78,
    originalPrice: 95,
    category: 'bottoms',
    collectionName: 'Chibi Harajuku Splash',
    description: 'Oversized boxy tactical shorts in pastel lavender with melting slime yellow liquid drip cargo pockets and webbing belt.',
    images: ['https://res.cloudinary.com/dptpb60p7/image/upload/f_auto,q_auto/v1793895263/fashionwekk/bottoms/bottom_harajuku_pleated_shorts.png'],
    colors: ['Lavender Mist', 'Slime Yellow'],
    sizes: ['S', 'M', 'L', 'XL'],
    gsm: 400,
    stock: 28,
    isFlashSale: true,
    discountPercent: 18,
    tags: ['ChibiSplash', 'Shorts', 'Harajuku'],
    rating: 4.9,
    reviewCount: 46,
    mascotSlot: 'bottom',
    mascotAsset: 'harajuku_pleated_shorts',
    featured: true,
    createdAt: new Date().toISOString(),
  },
  {
    _id: 'mascot-preset-bottom-8',
    title: 'Street Ronin Samurai Hakama Joggers',
    price: 110,
    originalPrice: 135,
    category: 'bottoms',
    collectionName: 'Street Ronin Brush',
    description: 'Samurai-inspired pleated streetwear hakama jogger pants in heavyweight double-weave black cotton with calligraphic side taping.',
    images: ['https://res.cloudinary.com/dptpb60p7/image/upload/f_auto,q_auto/v1793895264/fashionwekk/bottoms/bottom_ronin_hakama_joggers.png'],
    colors: ['Jet Black', 'Crimson Ink'],
    sizes: ['S', 'M', 'L', 'XL'],
    gsm: 490,
    stock: 14,
    isFlashSale: false,
    discountPercent: 0,
    tags: ['StreetRonin', 'Hakama', 'Joggers'],
    rating: 5.0,
    reviewCount: 52,
    mascotSlot: 'bottom',
    mascotAsset: 'ronin_hakama_joggers',
    featured: true,
    createdAt: new Date().toISOString(),
  },
  {
    _id: 'mascot-preset-bottom-9',
    title: 'Pixel Quest 8-Bit Arcade Sweatpants',
    price: 88,
    originalPrice: 110,
    category: 'bottoms',
    collectionName: 'Pixel Quest 8-Bit',
    description: 'Heavy French terry 450 GSM boxy sweatpants in bone white with pixelated retro arcade side-stripe graphics.',
    images: ['https://res.cloudinary.com/dptpb60p7/image/upload/f_auto,q_auto/v1793895266/fashionwekk/bottoms/bottom_pixel_8bit_sweatpants.png'],
    colors: ['Bone White', 'Pixel Cyan'],
    sizes: ['S', 'M', 'L', 'XL'],
    gsm: 450,
    stock: 22,
    isFlashSale: true,
    discountPercent: 20,
    tags: ['PixelQuest', 'Sweatpants', 'Arcade'],
    rating: 4.8,
    reviewCount: 29,
    mascotSlot: 'bottom',
    mascotAsset: 'pixel_sweatpants',
    featured: true,
    createdAt: new Date().toISOString(),
  },

  // Headwear Collection
  {
    _id: 'mascot-preset-head-1',
    title: 'Cyber Visor Neon HUD Helmet',
    price: 68,
    originalPrice: 85,
    category: 'accessories',
    collectionName: 'Cyber Toon Glitch',
    description: 'Futuristic streetwear cyber visor sunglasses helmet with neon HUD displays.',
    images: ['https://res.cloudinary.com/dptpb60p7/image/upload/f_auto,q_auto/fashionwekk/headwear/headwear_cyber_visor_helmet.png'],
    colors: ['Matte Black', 'Neon Cyan'],
    sizes: ['One Size'],
    gsm: 320,
    stock: 20,
    isFlashSale: true,
    discountPercent: 20,
    tags: ['CyberToon', 'Headwear', 'Helmet'],
    rating: 5.0,
    reviewCount: 47,
    mascotSlot: 'head',
    mascotAsset: 'cyber_visor_helmet',
    featured: true,
    createdAt: new Date().toISOString(),
  },
  {
    _id: 'mascot-preset-head-2',
    title: 'Demon Oni Knitted Balaclava',
    price: 54,
    originalPrice: 70,
    category: 'accessories',
    collectionName: 'Demon Mask Pop Art',
    description: 'Distressed knitted balaclava mask with crimson red Demon Oni horn accents and ink splatters.',
    images: ['https://res.cloudinary.com/dptpb60p7/image/upload/f_auto,q_auto/fashionwekk/headwear/headwear_demon_oni_balaclava.png'],
    colors: ['Pitch Black', 'Crimson Red'],
    sizes: ['One Size'],
    gsm: 440,
    stock: 24,
    isFlashSale: false,
    discountPercent: 0,
    tags: ['DemonMask', 'Headwear', 'Balaclava'],
    rating: 4.9,
    reviewCount: 39,
    mascotSlot: 'head',
    mascotAsset: 'demon_oni_balaclava',
    featured: true,
    createdAt: new Date().toISOString(),
  },
  {
    _id: 'mascot-preset-head-3',
    title: 'Harajuku Slime Drip Bucket Hat',
    price: 42,
    originalPrice: 55,
    category: 'accessories',
    collectionName: 'Chibi Harajuku Splash',
    description: 'Wide-brim streetwear bucket hat in pastel yellow with melting 3D liquid cartoon splatters.',
    images: ['https://res.cloudinary.com/dptpb60p7/image/upload/f_auto,q_auto/fashionwekk/headwear/headwear_harajuku_bucket_hat.png'],
    colors: ['Pastel Yellow', 'Candy Pink'],
    sizes: ['One Size'],
    gsm: 360,
    stock: 30,
    isFlashSale: false,
    discountPercent: 0,
    tags: ['ChibiSplash', 'Headwear', 'BucketHat'],
    rating: 4.8,
    reviewCount: 52,
    mascotSlot: 'head',
    mascotAsset: 'harajuku_bucket_hat',
    featured: true,
    createdAt: new Date().toISOString(),
  },
  {
    _id: 'mascot-preset-head-4',
    title: 'Pixel Quest 8-Bit Heavy Beanie',
    price: 38,
    originalPrice: 48,
    category: 'accessories',
    collectionName: 'Pixel Quest 8-Bit',
    description: 'Heavyweight ribbed fold-over knit beanie with glowing 8-bit arcade pixel monster patch.',
    images: ['https://res.cloudinary.com/dptpb60p7/image/upload/f_auto,q_auto/fashionwekk/headwear/headwear_pixel_quest_beanie.png'],
    colors: ['Deep Charcoal', 'Pixel Cyan'],
    sizes: ['One Size'],
    gsm: 460,
    stock: 35,
    isFlashSale: true,
    discountPercent: 20,
    tags: ['PixelQuest', 'Headwear', 'Beanie'],
    rating: 4.9,
    reviewCount: 61,
    mascotSlot: 'head',
    mascotAsset: 'pixel_quest_beanie',
    featured: true,
    createdAt: new Date().toISOString(),
  },
  {
    _id: 'mascot-preset-head-5',
    title: 'Ronin Laser Cyber Kasa',
    price: 78,
    originalPrice: 98,
    category: 'accessories',
    collectionName: 'Street Ronin Brush',
    description: 'Modern cyberpunk samurai kasa hat in bamboo composite with red neon Kanji engravings.',
    images: ['https://res.cloudinary.com/dptpb60p7/image/upload/f_auto,q_auto/fashionwekk/headwear/headwear_ronin_straw_kasa.png'],
    colors: ['Matte Black', 'Laser Crimson'],
    sizes: ['One Size'],
    gsm: 380,
    stock: 12,
    isFlashSale: false,
    discountPercent: 0,
    tags: ['StreetRonin', 'Headwear', 'Kasa'],
    rating: 5.0,
    reviewCount: 33,
    mascotSlot: 'head',
    mascotAsset: 'ronin_straw_kasa',
    featured: true,
    createdAt: new Date().toISOString(),
  },
  {
    _id: 'mascot-preset-head-6',
    title: 'Flame Washed Climax 5-Panel Cap',
    price: 40,
    originalPrice: 50,
    category: 'accessories',
    collectionName: 'Solar Flare Washed',
    description: 'Enzyme-washed distressed 5-panel street cap in sunset coral with dripping flame embroidery.',
    images: ['https://res.cloudinary.com/dptpb60p7/image/upload/f_auto,q_auto/fashionwekk/headwear/headwear_flame_washed_cap.png'],
    colors: ['Sunset Coral', 'Vintage Charcoal'],
    sizes: ['One Size'],
    gsm: 340,
    stock: 28,
    isFlashSale: true,
    discountPercent: 20,
    tags: ['SolarFlare', 'Headwear', 'Cap'],
    rating: 4.7,
    reviewCount: 27,
    mascotSlot: 'head',
    mascotAsset: 'flame_washed_cap',
    featured: true,
    createdAt: new Date().toISOString(),
  },
  {
    _id: 'mascot-preset-5',
    title: 'Demon Mask Pop Art Horned Beanie',
    price: 48,
    originalPrice: 60,
    category: 'accessories',
    collectionName: 'Demon Mask Pop Art',
    description: 'Mythological horned comic pop-art headwear mask and ribbed beanie.',
    images: ['https://res.cloudinary.com/dptpb60p7/image/upload/f_auto,q_auto/fashionwekk/masterpieces/demon_mask_popart.png'],
    colors: ['Onyx Black', 'Crimson Red'],
    sizes: ['One Size'],
    gsm: 460,
    stock: 22,
    isFlashSale: true,
    discountPercent: 20,
    tags: ['DemonMask', 'Headwear', 'Beanie'],
    rating: 5.0,
    reviewCount: 51,
    mascotSlot: 'head',
    mascotAsset: 'demon_head',
    featured: true,
    createdAt: new Date().toISOString(),
  },
  {
    _id: 'mascot-preset-6',
    title: 'Synth Wave Sunset Retro Cap',
    price: 36,
    originalPrice: 45,
    category: 'accessories',
    collectionName: 'Synth Wave Sunset',
    description: 'Cyan and pop-coral palm drift retro synth-wave curved brim street cap.',
    images: ['https://res.cloudinary.com/dptpb60p7/image/upload/f_auto,q_auto/fashionwekk/masterpieces/synth_wave_sunset.png'],
    colors: ['Electric Cyan', 'Sunset Coral'],
    sizes: ['One Size'],
    gsm: 350,
    stock: 28,
    isFlashSale: false,
    discountPercent: 0,
    tags: ['SynthWave', 'Headwear', 'Cap'],
    rating: 4.8,
    reviewCount: 33,
    mascotSlot: 'head',
    mascotAsset: 'synth_cap',
    featured: true,
    createdAt: new Date().toISOString(),
  },

  // Accessories Collection
  {
    _id: 'mascot-preset-10',
    title: 'KhanhBro Limited Vinyl Toy Grail',
    price: 95,
    originalPrice: 120,
    category: 'collectibles',
    collectionName: 'KhanhBro Signature Drip',
    description: 'Limited edition designer vinyl toy with signature hoodie and spray can companion.',
    images: ['https://res.cloudinary.com/dptpb60p7/image/upload/f_auto,q_auto/fashionwekk/collectibles/collectible_khanhbro_vinyl_toy.png'],
    colors: ['Matte Black', 'Vibrant Orange'],
    sizes: ['One Size'],
    gsm: 0,
    stock: 10,
    isFlashSale: true,
    discountPercent: 20,
    tags: ['KhanhBro', 'VinylToy', 'Collectible'],
    rating: 5.0,
    reviewCount: 88,
    mascotSlot: 'accessory',
    mascotAsset: 'khanhbro_toy',
    featured: true,
    createdAt: new Date().toISOString(),
  },
  {
    _id: 'mascot-preset-7',
    title: 'Pixel Quest 8-Bit Floating Companion Orb',
    price: 65,
    originalPrice: 80,
    category: 'collectibles',
    collectionName: 'Pixel Quest 8-Bit',
    description: 'Embossed silicone 8-bit monster floating holographic companion orb.',
    images: ['https://res.cloudinary.com/dptpb60p7/image/upload/f_auto,q_auto/fashionwekk/collectibles/collectible_pixel_companion_orb.png'],
    colors: ['Neon Green', 'Pixel Cyan'],
    sizes: ['One Size'],
    gsm: 360,
    stock: 15,
    isFlashSale: true,
    discountPercent: 20,
    tags: ['PixelQuest', 'Accessory', 'Orb'],
    rating: 4.9,
    reviewCount: 47,
    mascotSlot: 'accessory',
    mascotAsset: 'pixel_companion',
    featured: true,
    createdAt: new Date().toISOString(),
  },
  {
    _id: 'mascot-preset-8',
    title: 'Street Ronin Brush Companion Token',
    price: 72,
    originalPrice: 90,
    category: 'collectibles',
    collectionName: 'Street Ronin Brush',
    description: 'Dynamic comic calligraphic ink-splatter companion blade token.',
    images: ['https://res.cloudinary.com/dptpb60p7/image/upload/f_auto,q_auto/fashionwekk/collectibles/collectible_ronin_blade_token.png'],
    colors: ['Jet Black', 'Deep Purple'],
    sizes: ['One Size'],
    gsm: 500,
    stock: 12,
    isFlashSale: false,
    discountPercent: 0,
    tags: ['StreetRonin', 'Accessory', 'BladeToken'],
    rating: 5.0,
    reviewCount: 60,
    mascotSlot: 'accessory',
    mascotAsset: 'ronin_blade',
    featured: true,
    createdAt: new Date().toISOString(),
  },
  {
    _id: 'mascot-preset-acc-4',
    title: 'Cyber Toon Holographic Skate Deck',
    price: 110,
    originalPrice: 135,
    category: 'collectibles',
    collectionName: 'Cyber Toon Glitch',
    description: '7-ply Canadian maple skateboard deck with holographic prismatic cyber cartoon art.',
    images: ['https://res.cloudinary.com/dptpb60p7/image/upload/f_auto,q_auto/fashionwekk/collectibles/collectible_skate_deck_cyber.png'],
    colors: ['Prismatic Silver', 'Neon Cyan'],
    sizes: ['One Size'],
    gsm: 0,
    stock: 14,
    isFlashSale: false,
    discountPercent: 0,
    tags: ['CyberToon', 'SkateDeck', 'Accessory'],
    rating: 4.9,
    reviewCount: 45,
    mascotSlot: 'accessory',
    mascotAsset: 'cyber_skate_deck',
    featured: true,
    createdAt: new Date().toISOString(),
  },
  {
    _id: 'mascot-preset-acc-5',
    title: 'Demon Mask Sculpted Resin Bust',
    price: 135,
    originalPrice: 165,
    category: 'collectibles',
    collectionName: 'Demon Mask Pop Art',
    description: 'Hand-cast artisan resin collectible art bust with comic pop-art ink splatters.',
    images: ['https://res.cloudinary.com/dptpb60p7/image/upload/f_auto,q_auto/fashionwekk/collectibles/collectible_demon_resin_bust.png'],
    colors: ['Crimson Red', 'Onyx Black'],
    sizes: ['One Size'],
    gsm: 0,
    stock: 8,
    isFlashSale: true,
    discountPercent: 18,
    tags: ['DemonMask', 'ResinBust', 'Collectible'],
    rating: 5.0,
    reviewCount: 72,
    mascotSlot: 'accessory',
    mascotAsset: 'demon_resin_bust',
    featured: true,
    createdAt: new Date().toISOString(),
  },
  {
    _id: 'mascot-preset-acc-6',
    title: 'Chrome Cuban Link Dripping Chain',
    price: 125,
    originalPrice: 155,
    category: 'accessories',
    collectionName: 'Cyber Toon Glitch',
    description: 'Heavy solid brass Cuban link chain with mirror chrome dip and dripping skull charm.',
    images: ['https://res.cloudinary.com/dptpb60p7/image/upload/f_auto,q_auto/fashionwekk/accessories/accessory_chrome_cuban_chain.png'],
    colors: ['Mirror Chrome', 'Anodized Black'],
    sizes: ['One Size'],
    gsm: 0,
    stock: 15,
    isFlashSale: false,
    discountPercent: 0,
    tags: ['CyberToon', 'CubanChain', 'ChromeDrip'],
    rating: 4.9,
    reviewCount: 54,
    mascotSlot: 'accessory',
    mascotAsset: 'chrome_cuban_chain',
    featured: true,
    createdAt: new Date().toISOString(),
  },
  {
    _id: 'mascot-preset-acc-7',
    title: 'Cordura Fidlock Tactical Chest Rig',
    price: 95,
    originalPrice: 120,
    category: 'accessories',
    collectionName: 'Mecha Bot Evolution',
    description: 'Military-grade tactical chest rig crossbody bag in Cordura black with Fidlock magnetic buckles.',
    images: ['https://res.cloudinary.com/dptpb60p7/image/upload/f_auto,q_auto/fashionwekk/accessories/accessory_tactical_chest_rig.png'],
    colors: ['Stealth Black', 'Gunmetal Grey'],
    sizes: ['One Size'],
    gsm: 0,
    stock: 22,
    isFlashSale: true,
    discountPercent: 20,
    tags: ['MechaBot', 'TacticalRig', 'Techwear'],
    rating: 4.8,
    reviewCount: 39,
    mascotSlot: 'accessory',
    mascotAsset: 'tactical_chest_rig',
    featured: true,
    createdAt: new Date().toISOString(),
  },
  {
    _id: 'mascot-preset-acc-8',
    title: 'Y2K Slime Neon Chunky Ring Set',
    price: 45,
    originalPrice: 55,
    category: 'accessories',
    collectionName: 'Harajuku Pastel Drip',
    description: 'Chunky translucent neon cyan and slime yellow Y2K resin acrylic rings with embedded 3D cartoon logos.',
    images: ['https://res.cloudinary.com/dptpb60p7/image/upload/f_auto,q_auto/fashionwekk/accessories/accessory_neon_acrylic_ring_set.png'],
    colors: ['Slime Neon', 'Cyan Glaze'],
    sizes: ['One Size'],
    gsm: 0,
    stock: 35,
    isFlashSale: false,
    discountPercent: 0,
    tags: ['Harajuku', 'ResinRings', 'Y2K'],
    rating: 4.9,
    reviewCount: 48,
    mascotSlot: 'accessory',
    mascotAsset: 'neon_acrylic_rings',
    featured: true,
    createdAt: new Date().toISOString(),
  },
  {
    _id: 'mascot-preset-acc-9',
    title: 'Demon Oni Warhol Skateboard Deck',
    price: 120,
    originalPrice: 145,
    category: 'accessories',
    collectionName: 'Demon Mask Pop Art',
    description: 'Limited edition 8-ply Canadian maple skateboard deck with high-gloss pop-art demon mask print.',
    images: ['https://res.cloudinary.com/dptpb60p7/image/upload/f_auto,q_auto/fashionwekk/accessories/accessory_demon_skate_deck.png'],
    colors: ['Crimson Red', 'Gloss White'],
    sizes: ['One Size'],
    gsm: 0,
    stock: 12,
    isFlashSale: false,
    discountPercent: 0,
    tags: ['DemonMask', 'SkateDeck', 'PopArt'],
    rating: 5.0,
    reviewCount: 65,
    mascotSlot: 'accessory',
    mascotAsset: 'demon_skate_deck',
    featured: true,
    createdAt: new Date().toISOString(),
  },
  {
    _id: 'mascot-preset-acc-10',
    title: 'Artisan Leather Graffiti Holster Bag',
    price: 88,
    originalPrice: 110,
    category: 'accessories',
    collectionName: 'Rogue Clan Distressed',
    description: 'Vintage distressed leather graffiti spray can holster bag with molten chrome spray can art piece.',
    images: ['https://res.cloudinary.com/dptpb60p7/image/upload/f_auto,q_auto/fashionwekk/accessories/accessory_spray_can_holster.png'],
    colors: ['Aged Saddle', 'Molten Chrome'],
    sizes: ['One Size'],
    gsm: 0,
    stock: 16,
    isFlashSale: true,
    discountPercent: 20,
    tags: ['RogueClan', 'LeatherHolster', 'StreetArt'],
    rating: 4.9,
    reviewCount: 31,
    mascotSlot: 'accessory',
    mascotAsset: 'spray_can_holster',
    featured: true,
    createdAt: new Date().toISOString(),
  },
  {
    _id: 'mascot-preset-acc-11',
    title: '8-Bit Arcade Pixel Monster Plush',
    price: 55,
    originalPrice: 70,
    category: 'accessories',
    collectionName: 'Pixel Quest 8-Bit',
    description: 'Collectible designer streetwear plush figure of 8-bit pixel monster with embroidered glowing eyes and mini hoodie.',
    images: ['https://res.cloudinary.com/dptpb60p7/image/upload/f_auto,q_auto/fashionwekk/accessories/accessory_pixel_companion_plush.png'],
    colors: ['Pixel Cyan', 'Arcade Purple'],
    sizes: ['One Size'],
    gsm: 0,
    stock: 28,
    isFlashSale: false,
    discountPercent: 0,
    tags: ['PixelQuest', 'DesignerPlush', 'ArtToy'],
    rating: 5.0,
    reviewCount: 82,
    mascotSlot: 'accessory',
    mascotAsset: 'pixel_companion_plush',
    featured: true,
    createdAt: new Date().toISOString(),
  },
];

export const MascotDressUpDrawer: React.FC = () => {
  const {
    isStudioOpen,
    closeStudio,
    equipped,
    equipProduct,
    unequipSlot,
    resetMascot,
    mood,
    setMood,
  } = useMascotStore();

  const [categoryFilter, setCategoryFilter] = useState<'all' | MascotSlot>('all');

  useBodyScrollLock(isStudioOpen);
  const { addItem, openCart } = useCartStore();
  const { playPop, playEquip } = useSoundFx();

  const drawerRef = useRef<HTMLDivElement>(null);
  const backdropRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isStudioOpen && drawerRef.current && backdropRef.current) {
      animateDrawerOpen(drawerRef.current, backdropRef.current);
    }
  }, [isStudioOpen]);

  if (!isStudioOpen) return null;

  const handleClose = () => {
    if (drawerRef.current && backdropRef.current) {
      animateDrawerClose(drawerRef.current, backdropRef.current, closeStudio);
    } else {
      closeStudio();
    }
  };

  const equippedCount = Object.values(equipped).filter(Boolean).length;

  const handleAddAllToCart = (e: React.MouseEvent<HTMLButtonElement>) => {
    animateSquashAndStretch(e.currentTarget);
    Object.values(equipped).forEach((item) => {
      if (item) {
        addItem({
          productId: item._id,
          title: item.title,
          price: item.price,
          quantity: 1,
          size: item.sizes[0] || 'M',
          color: item.colors[0] || 'Black',
          image: item.images[0] || '',
          gsm: item.gsm,
        });
      }
    });
    playPop();
    handleClose();
    openCart();
  };

  const handleEquipPreset = (preset: Product) => {
    equipProduct(preset);
    playEquip();
  };

  const slotCounts = {
    all: ATELIER_WARDROBE_PRESETS.length,
    top: ATELIER_WARDROBE_PRESETS.filter((p) => p.mascotSlot === 'top').length,
    bottom: ATELIER_WARDROBE_PRESETS.filter((p) => p.mascotSlot === 'bottom').length,
    head: ATELIER_WARDROBE_PRESETS.filter((p) => p.mascotSlot === 'head').length,
    accessory: ATELIER_WARDROBE_PRESETS.filter((p) => p.mascotSlot === 'accessory').length,
  };

  const filterTabs: Array<{ id: 'all' | MascotSlot; label: string; icon: string; count: number; accent: string }> = [
    { id: 'all', label: 'All Grails', icon: '⚡', count: slotCounts.all, accent: '#D4FF00' },
    { id: 'top', label: 'Tops', icon: '👕', count: slotCounts.top, accent: MASCOT_SLOT_CONFIG.top.accentColor },
    { id: 'bottom', label: 'Bottoms', icon: '👖', count: slotCounts.bottom, accent: MASCOT_SLOT_CONFIG.bottom.accentColor },
    { id: 'head', label: 'Headwear', icon: '🧢', count: slotCounts.head, accent: MASCOT_SLOT_CONFIG.head.accentColor },
    { id: 'accessory', label: 'Accessories', icon: '💎', count: slotCounts.accessory, accent: MASCOT_SLOT_CONFIG.accessory.accentColor },
  ];

  const filteredPresets = ATELIER_WARDROBE_PRESETS.filter((p) => {
    if (categoryFilter === 'all') return true;
    return p.mascotSlot === categoryFilter;
  });

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      <div
        ref={backdropRef}
        onClick={handleClose}
        className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity"
      />

      <div className="fixed inset-y-0 right-0 flex max-w-full pl-0 sm:pl-10">
        <div
          ref={drawerRef}
          className="flex w-full sm:w-screen sm:max-w-md flex-col bg-white/95 backdrop-blur-2xl border-l-2 border-slate-900/10 shadow-2xl text-slate-900 safe-area-bottom"
        >
          <div className="flex items-center justify-between border-b border-slate-200 px-6 py-4">
            <div className="flex items-center gap-2">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-slate-900 text-[#D4FF00] shadow-sm">
                <Shirt className="h-5 w-5" />
              </div>
              <div>
                <h3 className="font-display text-lg font-black text-slate-900 tracking-wide">
                  MASCOT FIT STUDIO
                </h3>
                <p className="text-xs text-slate-500 font-medium">
                  Interactive 3D Cartoon Dress-Up
                </p>
              </div>
            </div>
            <button
              onClick={handleClose}
              className="rounded-lg p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-900 transition-colors cursor-pointer"
              aria-label="Close studio"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          <div className="relative flex flex-1 flex-col items-center p-6 overflow-y-auto">
            <div className="relative flex flex-col items-center">
              <MascotAvatar size="lg" />

              <div className="mt-4 flex items-center gap-1.5 rounded-full bg-slate-100 p-1.5 border border-slate-200 shadow-sm">
                {(['hype', 'chill', 'cyber', 'battle'] as const).map((m) => (
                  <button
                    key={m}
                    onClick={() => {
                      setMood(m);
                      playEquip();
                    }}
                    className={`rounded-full px-3 py-1 text-xs font-semibold capitalize transition-all cursor-pointer ${
                      mood === m
                        ? 'bg-slate-900 text-[#D4FF00] shadow-sm font-bold'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    {m}
                  </button>
                ))}
              </div>
            </div>

            <div className="mt-6 w-full space-y-2">
              <div className="flex items-center justify-between px-1">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                  Equipped Fit Layers ({equippedCount}/4)
                </span>
                {equippedCount > 0 && (
                  <button
                    onClick={resetMascot}
                    className="flex items-center gap-1 text-xs text-slate-500 hover:text-[#FF5722] transition-colors font-medium cursor-pointer"
                  >
                    <RotateCcw className="h-3 w-3" />
                    Reset Fit
                  </button>
                )}
              </div>

              {(['top', 'bottom', 'head', 'accessory'] as const).map((slot) => {
                const item = equipped[slot];
                const meta = MASCOT_SLOT_CONFIG[slot];

                return (
                  <div
                    key={slot}
                    className="flex items-center justify-between rounded-2xl bg-slate-50 p-2.5 sm:p-3 border border-slate-200 transition-all"
                    style={{
                      borderLeftWidth: '4px',
                      borderLeftColor: item ? meta.accentColor : '#CBD5E1',
                    }}
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      {item ? (
                        <img
                          src={item.images[0]}
                          alt={item.title}
                          width="40"
                          height="40"
                          draggable={false}
                          className="h-10 w-10 rounded-xl object-cover border border-slate-200 bg-white flex-shrink-0 select-none pointer-events-none"
                        />
                      ) : (
                        <div className="h-10 w-10 rounded-xl bg-white border border-dashed border-slate-300 flex items-center justify-center text-xs text-slate-400 font-mono flex-shrink-0">
                          {meta.shortTag}
                        </div>
                      )}
                      <div className="min-w-0">
                        <div className="flex items-center gap-1.5">
                          <span
                            className="text-[9px] font-mono font-black uppercase px-1.5 py-0.2 rounded"
                            style={{
                              backgroundColor: `${meta.accentColor}25`,
                              color: meta.accentColor === '#D4FF00' ? '#556B00' : meta.accentColor,
                            }}
                          >
                            {meta.shortTag}
                          </span>
                          <p className="text-[11px] text-slate-500 font-medium truncate">{meta.label}</p>
                        </div>
                        <p className="text-xs sm:text-sm font-bold text-slate-900 truncate">
                          {item ? item.title : 'Bare / Default Fit'}
                        </p>
                      </div>
                    </div>

                    {item && (
                      <button
                        onClick={() => unequipSlot(slot)}
                        className="text-xs text-rose-500 hover:underline p-1 font-semibold flex-shrink-0 cursor-pointer"
                      >
                        Remove
                      </button>
                    )}
                  </div>
                );
              })}
            </div>

            <div className="mt-8 w-full border-t border-slate-200 pt-5">
              <div className="flex items-center justify-between mb-3 px-1">
                <div>
                  <h4 className="font-display text-sm font-black text-slate-900 tracking-wide uppercase">
                    Wardrobe & Accessories
                  </h4>
                  <p className="text-[11px] text-slate-500 font-medium">
                    {ATELIER_WARDROBE_PRESETS.length} Bespoke 3D Cartoon Pop-Art Grails
                  </p>
                </div>
                <span className="text-[10px] font-mono font-black bg-[#D4FF00] text-black px-2 py-0.5 rounded-md border border-black/20">
                  TAP TO EQUIP
                </span>
              </div>

              <div className="flex items-center gap-1.5 overflow-x-auto pb-2 scrollbar-none mb-3">
                {filterTabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setCategoryFilter(tab.id)}
                    className={`rounded-lg px-2.5 py-1 text-xs font-bold whitespace-nowrap transition-all cursor-pointer flex items-center gap-1 ${
                      categoryFilter === tab.id
                        ? 'bg-slate-900 text-[#D4FF00] shadow-xs'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    <span>{tab.icon}</span>
                    <span>{tab.label}</span>
                    <span className="text-[10px] opacity-70">({tab.count})</span>
                  </button>
                ))}
              </div>

              <div className="grid grid-cols-2 gap-2.5 max-h-80 overflow-y-auto pr-1">
                {filteredPresets.map((preset) => {
                  const isCurrentEquipped = Object.values(equipped).some(
                    (item) => item?._id === preset._id || item?.images?.[0] === preset.images[0]
                  );
                  const slotMeta = getMascotSlotBadge(preset.mascotSlot || 'top');

                  return (
                    <div
                      key={preset._id}
                      onClick={() => handleEquipPreset(preset)}
                      className={`relative flex flex-col p-2.5 rounded-2xl border-2 transition-all cursor-pointer select-none ${
                        isCurrentEquipped
                          ? 'border-[#D4FF00] bg-slate-900 text-white shadow-md'
                          : 'border-slate-200 bg-white hover:border-slate-400 text-slate-900'
                      }`}
                    >
                      <div className="relative aspect-square w-full rounded-xl overflow-hidden bg-slate-100 mb-2">
                        <img
                          src={preset.images[0]}
                          alt={preset.title}
                          width="150"
                          height="150"
                          draggable={false}
                          className="h-full w-full object-cover select-none pointer-events-none"
                        />
                        <span
                          className="absolute top-1 left-1 rounded px-1.5 py-0.2 text-[9px] font-mono font-bold uppercase shadow-xs"
                          style={{
                            backgroundColor: '#0F172Aee',
                            color: slotMeta.accentColor,
                            borderWidth: '1px',
                            borderColor: `${slotMeta.accentColor}80`,
                          }}
                        >
                          {slotMeta.shortTag}
                        </span>
                        {isCurrentEquipped && (
                          <span className="absolute top-1 right-1 rounded bg-[#D4FF00] text-black px-1.5 py-0.2 text-[9px] font-mono font-black uppercase">
                            ON
                          </span>
                        )}
                      </div>

                      <h5 className="font-display text-xs font-bold line-clamp-1">
                        {preset.title}
                      </h5>
                      <div className="mt-auto flex items-center justify-between pt-1">
                        <span className="text-[10px] font-mono text-slate-400">
                          {preset.gsm > 0 ? `${preset.gsm} GSM` : 'Art Piece'}
                        </span>
                        <span className={`text-[11px] font-black ${isCurrentEquipped ? 'text-[#D4FF00]' : 'text-[#FF5722]'}`}>
                          ${preset.price}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          <div className="border-t border-slate-200 p-5 bg-slate-50">
            <button
              disabled={equippedCount === 0}
              onClick={handleAddAllToCart}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-slate-900 hover:bg-[#FF5722] py-3.5 text-sm font-bold text-white shadow-md transition-colors disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
            >
              <ShoppingBag className="h-4 w-4" />
              Add Entire Outfit to Bag ({equippedCount} items)
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
