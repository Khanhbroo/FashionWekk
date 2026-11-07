import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import cloudinaryCatalog from '../data/cloudinary_catalog.json';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const catalog = cloudinaryCatalog as Record<string, string>;

export const CLOUDINARY_MASTERPIECES: Record<string, string> = {
  'KhanhBro Signature Drip': catalog['fashionwekk/masterpieces/khanhbro_hero_signature_drip'],
  'Cyber Toon Glitch': catalog['fashionwekk/masterpieces/cyber_toon_glitch_hero'],
  'Mecha Bot Evolution': catalog['fashionwekk/masterpieces/mecha_bot_evolution'],
  'Street Ronin Brush': catalog['fashionwekk/masterpieces/street_ronin_brush'],
  'Chibi Harajuku Splash': catalog['fashionwekk/masterpieces/chibi_harajuku_splash'],
  'Pixel Quest 8-Bit': catalog['fashionwekk/masterpieces/pixel_quest_8bit'],
  'Solar Flare Washed': catalog['fashionwekk/masterpieces/solar_flare_washed'],
  'Synth Wave Sunset': catalog['fashionwekk/masterpieces/synth_wave_sunset'],
  'Demon Mask Pop Art': catalog['fashionwekk/masterpieces/demon_mask_popart'],
  'Rogue Clan Distressed': catalog['fashionwekk/masterpieces/rogue_clan_distressed'],
  'KhanhBro Classic Drip': catalog['fashionwekk/masterpieces/gemini_pro_sample_hoodie'],
};

export function getBackView(url: string): string {
  if (!url) return '';
  return url.replace('/f_auto,q_auto/', '/c_fill,w_800,h_1000,g_auto/f_auto,q_auto/');
}

export function getDetailView(url: string): string {
  if (!url) return '';
  return url.replace('/f_auto,q_auto/', '/c_crop,w_600,h_600,g_center/f_auto,q_auto/');
}

const IMAGE_SETS_SS26 = {
  tees: [
    catalog['fashionwekk/mascot/mascot_cyber_glitch_tee'],
    catalog['fashionwekk/masterpieces/chibi_harajuku_splash'],
    catalog['fashionwekk/masterpieces/pixel_quest_8bit'],
    catalog['fashionwekk/masterpieces/solar_flare_washed'],
    catalog['fashionwekk/masterpieces/synth_wave_sunset'],
    catalog['fashionwekk/tops/top_cyber_toon_acid_hoodie'],
  ],
  bottoms: [
    catalog['fashionwekk/bottoms/bottom_harajuku_pleated_shorts'],
    catalog['fashionwekk/bottoms/bottom_pixel_8bit_sweatpants'],
    catalog['fashionwekk/bottoms/bottom_mecha_parachute_track'],
    catalog['fashionwekk/mascot/mascot_mecha_cargo'],
    catalog['fashionwekk/masterpieces/rogue_clan_distressed'],
    catalog['fashionwekk/masterpieces/chibi_harajuku_splash'],
  ],
  outerwear: [
    catalog['fashionwekk/tops/top_liquid_drip_crop_windbreaker'],
    catalog['fashionwekk/tops/top_pixel_retro_bomber'],
    catalog['fashionwekk/masterpieces/cyber_toon_glitch_hero'],
    catalog['fashionwekk/masterpieces/mecha_bot_evolution'],
  ],
  accessories: [
    catalog['fashionwekk/headwear/headwear_flame_washed_cap'],
    catalog['fashionwekk/headwear/headwear_harajuku_bucket_hat'],
    catalog['fashionwekk/headwear/headwear_pixel_quest_beanie'],
    catalog['fashionwekk/accessories/accessory_neon_acrylic_ring_set'],
    catalog['fashionwekk/accessories/accessory_chrome_cuban_chain'],
    catalog['fashionwekk/accessories/accessory_pixel_companion_plush'],
  ],
};

const IMAGE_SETS_FW26 = {
  hoodies: [
    catalog['fashionwekk/mascot/mascot_liquid_drip_hoodie'],
    catalog['fashionwekk/tops/top_cyber_toon_acid_hoodie'],
    catalog['fashionwekk/tops/top_ronin_brush_kimono_hoodie'],
    catalog['fashionwekk/masterpieces/khanhbro_hero_signature_drip'],
    catalog['fashionwekk/masterpieces/demon_mask_popart'],
    catalog['fashionwekk/masterpieces/street_ronin_brush'],
  ],
  bottoms: [
    catalog['fashionwekk/bottoms/bottom_cyber_cargo_pants'],
    catalog['fashionwekk/bottoms/bottom_distressed_graffiti_denim'],
    catalog['fashionwekk/bottoms/bottom_ronin_hakama_joggers'],
    catalog['fashionwekk/mascot/mascot_mecha_cargo'],
    catalog['fashionwekk/masterpieces/rogue_clan_distressed'],
  ],
  outerwear: [
    catalog['fashionwekk/tops/top_mecha_varsity_jacket'],
    catalog['fashionwekk/tops/top_solar_flare_puffer'],
    catalog['fashionwekk/masterpieces/mecha_bot_evolution'],
    catalog['fashionwekk/masterpieces/cyber_toon_glitch_hero'],
  ],
  accessories: [
    catalog['fashionwekk/headwear/headwear_cyber_visor_helmet'],
    catalog['fashionwekk/headwear/headwear_demon_oni_balaclava'],
    catalog['fashionwekk/headwear/headwear_ronin_straw_kasa'],
    catalog['fashionwekk/accessories/accessory_tactical_chest_rig'],
    catalog['fashionwekk/accessories/accessory_demon_skate_deck'],
    catalog['fashionwekk/accessories/accessory_spray_can_holster'],
  ],
};

const IMAGE_SETS_COLLECTIBLES = [
  catalog['fashionwekk/collectibles/collectible_khanhbro_vinyl_toy'],
  catalog['fashionwekk/accessories/accessory_demon_skate_deck'],
  catalog['fashionwekk/collectibles/collectible_demon_resin_bust'],
  catalog['fashionwekk/accessories/accessory_pixel_companion_plush'],
  catalog['fashionwekk/accessories/accessory_spray_can_holster'],
];

export const COLLECTIONS = [
  { id: 'chibi-splash', name: 'Chibi Harajuku Splash', tag: 'ChibiDrip', gsm: 260, season: 'SS26' as const },
  { id: 'pixel-quest', name: 'Pixel Quest 8-Bit', tag: 'PixelArt', gsm: 250, season: 'SS26' as const },
  { id: 'solar-flare', name: 'Solar Flare Washed', tag: 'SolarFlare', gsm: 270, season: 'SS26' as const },
  { id: 'synth-sunset', name: 'Synth Wave Sunset', tag: 'SynthWave', gsm: 240, season: 'SS26' as const },
  { id: 'cyber-toon', name: 'Cyber Toon Glitch', tag: 'PopGlitch', gsm: 460, season: 'FW26' as const },
  { id: 'mecha-bot', name: 'Mecha Bot Evolution', tag: 'MechaBot', gsm: 480, season: 'FW26' as const },
  { id: 'street-ronin', name: 'Street Ronin Brush', tag: 'RoninBrush', gsm: 500, season: 'FW26' as const },
  { id: 'demon-mask', name: 'Demon Mask Pop Art', tag: 'DemonPop', gsm: 470, season: 'FW26' as const },
  { id: 'rogue-clan', name: 'Rogue Clan Distressed', tag: 'RogueClan', gsm: 450, season: 'FW26' as const },
  { id: 'khanhbro-drip', name: 'KhanhBro Signature Drip', tag: 'KhanhBro', gsm: 490, season: 'FW26' as const },
];

const COLORS_POOL = [
  ['Onyx Black', 'Sunset Coral'],
  ['Washed Charcoal', 'Electric Cyan'],
  ['Deep Lavender', 'Shadow Black'],
  ['Bone White', 'Pop Magenta'],
  ['Neon Purple', 'Hyper Green'],
  ['Graphite Grey', 'Comic Yellow'],
];

export function buildFallbackProducts() {
  const products = [];
  const now = Date.now();
  let overallIndex = 1;

  const ssCollections = COLLECTIONS.filter((c) => c.season === 'SS26');
  const ssBreakdown = [
    { category: 'tees' as const, count: 20, basePrice: 42, slot: 'top' as const, prefix: 'Oversize Pop Art Graphic Tee' },
    { category: 'bottoms' as const, count: 15, basePrice: 68, slot: 'bottom' as const, prefix: 'Tactical Parachute Street Shorts' },
    { category: 'outerwear' as const, count: 10, basePrice: 95, slot: 'top' as const, prefix: 'Packable UV Shield Windbreaker' },
    { category: 'accessories' as const, count: 5, basePrice: 32, slot: 'head' as const, prefix: 'Distressed 5-Panel Street Cap' },
  ];

  for (const group of ssBreakdown) {
    const categoryPool = IMAGE_SETS_SS26[group.category];
    for (let i = 0; i < group.count; i++) {
      const collection = ssCollections[(overallIndex - 1) % ssCollections.length];
      const colorSet = COLORS_POOL[(overallIndex - 1) % COLORS_POOL.length];
      const isFlashSale = overallIndex % 5 === 0;
      const discountPercent = isFlashSale ? 20 : 0;
      const price = Math.round(group.basePrice + (overallIndex % 6) * 5);
      const originalPrice = isFlashSale ? Math.round(price * 1.25) : price;
      const categoryFallback = categoryPool[i % categoryPool.length];
      const heroMasterpiece = CLOUDINARY_MASTERPIECES[collection.name];
      const frontImage = heroMasterpiece || categoryFallback;
      const isAccessoryItem = group.category === 'accessories' && i >= 3;
      const currentSlot = isAccessoryItem ? ('accessory' as const) : group.slot;
      const currentPrefix = isAccessoryItem ? 'Chunky Y2K Neon Jewelry Set' : group.prefix;
      const title = `${collection.name} ${currentPrefix} #${overallIndex}`;
      const itemCreatedAt = new Date(now - (105 - overallIndex) * 3600000).toISOString();

      products.push({
        _id: `prod_ss_${overallIndex}`,
        title,
        price,
        originalPrice,
        category: group.category,
        season: 'SS26',
        collectionName: collection.name,
        description: `Spring/Summer 2026 edition from the ${collection.name} capsule. Crafted with breathable ${collection.gsm} GSM combed organic cotton. Built for warm-weather city movement with sweat-wicking treatment, reinforced seam binding, and signature 3D cartoon liquid pop-art graphics curated by KhanhBro.`,
        images: [frontImage, getBackView(frontImage), getDetailView(frontImage)],
        colors: colorSet,
        sizes: group.category === 'accessories' ? ['One Size'] : ['S', 'M', 'L', 'XL', 'XXL'],
        gsm: collection.gsm,
        stock: 35,
        isFlashSale,
        discountPercent,
        tags: [collection.tag, 'SS26', 'SpringSummer', 'Streetwear', 'FashionWekk', 'KhanhBro', group.category],
        rating: Number((4.7 + (overallIndex % 4) * 0.08).toFixed(1)),
        reviewCount: 38,
        mascotSlot: currentSlot,
        mascotAsset: `asset_ss_${group.category}_${(overallIndex % 5) + 1}`,
        featured: overallIndex <= 8,
        createdAt: itemCreatedAt,
        updatedAt: itemCreatedAt,
      });

      overallIndex++;
    }
  }

  const fwCollections = COLLECTIONS.filter((c) => c.season === 'FW26');
  const fwBreakdown = [
    { category: 'hoodies' as const, count: 20, basePrice: 92, slot: 'top' as const, prefix: 'Heavyweight Boxy Drip Hoodie' },
    { category: 'bottoms' as const, count: 15, basePrice: 84, slot: 'bottom' as const, prefix: 'Heavy French Terry Cargo Pants' },
    { category: 'outerwear' as const, count: 10, basePrice: 145, slot: 'top' as const, prefix: 'Quilted Boxy Puffer Down Jacket' },
    { category: 'accessories' as const, count: 5, basePrice: 35, slot: 'head' as const, prefix: 'Heavy Ribbed Knit Beanie' },
  ];

  for (const group of fwBreakdown) {
    const categoryPool = IMAGE_SETS_FW26[group.category];
    for (let i = 0; i < group.count; i++) {
      const collection = fwCollections[(overallIndex - 1) % fwCollections.length];
      const colorSet = COLORS_POOL[(overallIndex - 1) % COLORS_POOL.length];
      const isFlashSale = overallIndex % 4 === 0;
      const discountPercent = isFlashSale ? 25 : 0;
      const price = Math.round(group.basePrice + (overallIndex % 7) * 6);
      const originalPrice = isFlashSale ? Math.round(price * 1.33) : price;
      const categoryFallback = categoryPool[i % categoryPool.length];
      const heroMasterpiece = CLOUDINARY_MASTERPIECES[collection.name];
      const frontImage = heroMasterpiece || categoryFallback;
      const isAccessoryItem = group.category === 'accessories' && i >= 3;
      const currentSlot = isAccessoryItem ? ('accessory' as const) : group.slot;
      const currentPrefix = isAccessoryItem ? 'Tactical Fidlock Chest Rig Bag' : group.prefix;
      const title = `${collection.name} ${currentPrefix} #${overallIndex}`;
      const itemCreatedAt = new Date(now - (105 - overallIndex) * 3600000).toISOString();

      products.push({
        _id: `prod_fw_${overallIndex}`,
        title,
        price,
        originalPrice,
        category: group.category,
        season: 'FW26',
        collectionName: collection.name,
        description: `Fall/Winter 2026 heavyweight capsule from the ${collection.name} collection. Built with armor-grade ${collection.gsm} GSM double-brushed French terry and water-repellent shell. Features custom embroidered wax seal patches, thick ribbed cuffs, drop-shoulder tailoring, and signature KhanhBro pop-art graphics.`,
        images: [frontImage, getBackView(frontImage), getDetailView(frontImage)],
        colors: colorSet,
        sizes: group.category === 'accessories' ? ['One Size'] : ['S', 'M', 'L', 'XL', 'XXL'],
        gsm: collection.gsm,
        stock: 28,
        isFlashSale,
        discountPercent,
        tags: [collection.tag, 'FW26', 'FallWinter', 'Heavyweight', 'Streetwear', 'FashionWekk', 'KhanhBro', group.category],
        rating: Number((4.8 + (overallIndex % 3) * 0.08).toFixed(1)),
        reviewCount: 45,
        mascotSlot: currentSlot,
        mascotAsset: `asset_fw_${group.category}_${(overallIndex % 5) + 1}`,
        featured: overallIndex <= 16,
        createdAt: itemCreatedAt,
        updatedAt: itemCreatedAt,
      });

      overallIndex++;
    }
  }

  const collectibleTitles = [
    'KhanhBro 3D Liquid Drip Mascot Art Toy 28cm (Limited 100 Pcs)',
    'Cyber Toon Glitch 8-Ply Canadian Maple Skate Deck',
    'Demon Mask Pop Art Hand-Painted Resin Bust Statue',
    'Mecha Bot Evolution Collector Vinyl Figure Metallic Edition',
  ];

  for (let c = 0; c < collectibleTitles.length; c++) {
    const frontImage = IMAGE_SETS_COLLECTIBLES[c % IMAGE_SETS_COLLECTIBLES.length];
    products.push({
      _id: `prod_collectible_${c + 1}`,
      title: collectibleTitles[c],
      price: 120 + c * 45,
      originalPrice: 150 + c * 55,
      category: 'collectibles',
      season: 'All-Season',
      collectionName: 'KhanhBro Signature Drip',
      description: 'Numbered atelier art collector drop directed by KhanhBro. Stamped with authentic gold wax emblem, custom collector wooden presentation crate, and holographic verification certificate.',
      images: [frontImage, getBackView(frontImage), getDetailView(frontImage)],
      colors: ['Collector Edition Monochrome', 'Neon Gold Splash'],
      sizes: ['One Size'],
      gsm: 0,
      stock: 15,
      isFlashSale: false,
      discountPercent: 0,
      tags: ['Collectible', 'ArtToy', 'SkateDeck', 'VIP', 'KhanhBro', 'FashionWekk'],
      rating: 5.0,
      reviewCount: 42,
      mascotSlot: 'accessory',
      mascotAsset: `asset_collectible_${c + 1}`,
      featured: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });
  }

  return products;
}

const outputPath = path.join(__dirname, '..', 'data', 'fallback_products.json');
const products = buildFallbackProducts();
fs.writeFileSync(outputPath, JSON.stringify(products, null, 2));
console.log(`Generated ${products.length} fallback products at ${outputPath}`);
