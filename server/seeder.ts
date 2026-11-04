import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { connectDB } from './config/db';
import Product from './models/Product';
import Coupon from './models/Coupon';
import Order from './models/Order';

dotenv.config();

const FASHION_IMAGE_PAIRS = {
  hoodies: [
    {
      front: 'https://images.unsplash.com/photo-1556905055-8f358a7a47b2?auto=format&fit=crop&w=800&q=80',
      back: 'https://images.unsplash.com/photo-1509967419530-da38b4704bc6?auto=format&fit=crop&w=800&q=80',
      detail: 'https://images.unsplash.com/photo-1579546929518-9e396f3cc809?auto=format&fit=crop&w=800&q=80',
    },
    {
      front: 'https://images.unsplash.com/photo-1578587018452-892bacefd3f2?auto=format&fit=crop&w=800&q=80',
      back: 'https://images.unsplash.com/photo-1512436991641-6745cdb1723f?auto=format&fit=crop&w=800&q=80',
      detail: 'https://images.unsplash.com/photo-1558769132-cb1aea458c5e?auto=format&fit=crop&w=800&q=80',
    },
    {
      front: 'https://images.unsplash.com/photo-1543163521-1bf539c55dd2?auto=format&fit=crop&w=800&q=80',
      back: 'https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?auto=format&fit=crop&w=800&q=80',
      detail: 'https://images.unsplash.com/photo-1582738411706-bfc8e691d1c2?auto=format&fit=crop&w=800&q=80',
    },
    {
      front: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=800&q=80',
      back: 'https://images.unsplash.com/photo-1529139574466-a303027c1d8b?auto=format&fit=crop&w=800&q=80',
      detail: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=800&q=80',
    },
    {
      front: 'https://images.unsplash.com/photo-1576995853123-5a10305d93c0?auto=format&fit=crop&w=800&q=80',
      back: 'https://images.unsplash.com/photo-1527718641255-324f8e2d0421?auto=format&fit=crop&w=800&q=80',
      detail: 'https://images.unsplash.com/photo-1579546929518-9e396f3cc809?auto=format&fit=crop&w=800&q=80',
    },
    {
      front: 'https://images.unsplash.com/photo-1503342394128-c104d54dba01?auto=format&fit=crop&w=800&q=80',
      back: 'https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?auto=format&fit=crop&w=800&q=80',
      detail: 'https://images.unsplash.com/photo-1558769132-cb1aea458c5e?auto=format&fit=crop&w=800&q=80',
    },
    {
      front: 'https://images.unsplash.com/photo-1516257984-b1b4d707412e?auto=format&fit=crop&w=800&q=80',
      back: 'https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?auto=format&fit=crop&w=800&q=80',
      detail: 'https://images.unsplash.com/photo-1582738411706-bfc8e691d1c2?auto=format&fit=crop&w=800&q=80',
    },
  ],
  tees: [
    {
      front: 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=800&q=80',
      back: 'https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?auto=format&fit=crop&w=800&q=80',
      detail: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=800&q=80',
    },
    {
      front: 'https://images.unsplash.com/photo-1527719327859-c6ce80353573?auto=format&fit=crop&w=800&q=80',
      back: 'https://images.unsplash.com/photo-1618354691373-d851c5c3a990?auto=format&fit=crop&w=800&q=80',
      detail: 'https://images.unsplash.com/photo-1579546929518-9e396f3cc809?auto=format&fit=crop&w=800&q=80',
    },
    {
      front: 'https://images.unsplash.com/photo-1562157873-818bc0726f68?auto=format&fit=crop&w=800&q=80',
      back: 'https://images.unsplash.com/photo-1503341455253-b2e723bb3dbb?auto=format&fit=crop&w=800&q=80',
      detail: 'https://images.unsplash.com/photo-1558769132-cb1aea458c5e?auto=format&fit=crop&w=800&q=80',
    },
    {
      front: 'https://images.unsplash.com/photo-1622445268045-8f258a69e7f4?auto=format&fit=crop&w=800&q=80',
      back: 'https://images.unsplash.com/photo-1618354691792-d1d42acfd860?auto=format&fit=crop&w=800&q=80',
      detail: 'https://images.unsplash.com/photo-1582738411706-bfc8e691d1c2?auto=format&fit=crop&w=800&q=80',
    },
    {
      front: 'https://images.unsplash.com/photo-1576566588028-4147f3842f27?auto=format&fit=crop&w=800&q=80',
      back: 'https://images.unsplash.com/photo-1529374255404-311a2a4f1fd9?auto=format&fit=crop&w=800&q=80',
      detail: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=800&q=80',
    },
    {
      front: 'https://images.unsplash.com/photo-1581655353564-df123a1eb820?auto=format&fit=crop&w=800&q=80',
      back: 'https://images.unsplash.com/photo-1618354691229-88d47f285158?auto=format&fit=crop&w=800&q=80',
      detail: 'https://images.unsplash.com/photo-1579546929518-9e396f3cc809?auto=format&fit=crop&w=800&q=80',
    },
  ],
  bottoms: [
    {
      front: 'https://images.unsplash.com/photo-1541099649105-f69ad21f3246?auto=format&fit=crop&w=800&q=80',
      back: 'https://images.unsplash.com/photo-1517445312882-bc9910d016b7?auto=format&fit=crop&w=800&q=80',
      detail: 'https://images.unsplash.com/photo-1558769132-cb1aea458c5e?auto=format&fit=crop&w=800&q=80',
    },
    {
      front: 'https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?auto=format&fit=crop&w=800&q=80',
      back: 'https://images.unsplash.com/photo-1584370848010-d7fe6bc767ec?auto=format&fit=crop&w=800&q=80',
      detail: 'https://images.unsplash.com/photo-1582738411706-bfc8e691d1c2?auto=format&fit=crop&w=800&q=80',
    },
    {
      front: 'https://images.unsplash.com/photo-1551854838-212c50b4c184?auto=format&fit=crop&w=800&q=80',
      back: 'https://images.unsplash.com/photo-1473966968600-fa801b869a1a?auto=format&fit=crop&w=800&q=80',
      detail: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=800&q=80',
    },
    {
      front: 'https://images.unsplash.com/photo-1506630448388-4e683c67ddb0?auto=format&fit=crop&w=800&q=80',
      back: 'https://images.unsplash.com/photo-1542272604-780c96856592?auto=format&fit=crop&w=800&q=80',
      detail: 'https://images.unsplash.com/photo-1579546929518-9e396f3cc809?auto=format&fit=crop&w=800&q=80',
    },
  ],
  outerwear: [
    {
      front: 'https://images.unsplash.com/photo-1548883354-7622d03aca27?auto=format&fit=crop&w=800&q=80',
      back: 'https://images.unsplash.com/photo-1544441893-675973e31985?auto=format&fit=crop&w=800&q=80',
      detail: 'https://images.unsplash.com/photo-1558769132-cb1aea458c5e?auto=format&fit=crop&w=800&q=80',
    },
    {
      front: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?auto=format&fit=crop&w=800&q=80',
      back: 'https://images.unsplash.com/photo-1520975954732-35dd22299614?auto=format&fit=crop&w=800&q=80',
      detail: 'https://images.unsplash.com/photo-1582738411706-bfc8e691d1c2?auto=format&fit=crop&w=800&q=80',
    },
    {
      front: 'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?auto=format&fit=crop&w=800&q=80',
      back: 'https://images.unsplash.com/photo-1544923246-77307dd654cb?auto=format&fit=crop&w=800&q=80',
      detail: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=800&q=80',
    },
  ],
  accessories: [
    {
      front: 'https://images.unsplash.com/photo-1576871337632-b9aef4c17ab9?auto=format&fit=crop&w=800&q=80',
      back: 'https://images.unsplash.com/photo-1588850561407-ed78c282e89b?auto=format&fit=crop&w=800&q=80',
      detail: 'https://images.unsplash.com/photo-1579546929518-9e396f3cc809?auto=format&fit=crop&w=800&q=80',
    },
    {
      front: 'https://images.unsplash.com/photo-1608256246200-53e635b5b65f?auto=format&fit=crop&w=800&q=80',
      back: 'https://images.unsplash.com/photo-1511556532299-8f662fc26c06?auto=format&fit=crop&w=800&q=80',
      detail: 'https://images.unsplash.com/photo-1558769132-cb1aea458c5e?auto=format&fit=crop&w=800&q=80',
    },
    {
      front: 'https://images.unsplash.com/photo-1556306535-0f09a537f0a3?auto=format&fit=crop&w=800&q=80',
      back: 'https://images.unsplash.com/photo-1521369909029-2afed882baee?auto=format&fit=crop&w=800&q=80',
      detail: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=800&q=80',
    },
  ],
  collectibles: [
    {
      front: 'https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?auto=format&fit=crop&w=800&q=80',
      back: 'https://images.unsplash.com/photo-1563245372-f21724e3856d?auto=format&fit=crop&w=800&q=80',
      detail: 'https://images.unsplash.com/photo-1563089145-599997674d42?auto=format&fit=crop&w=800&q=80',
    },
    {
      front: 'https://images.unsplash.com/photo-1566576912321-d58ddd7a6088?auto=format&fit=crop&w=800&q=80',
      back: 'https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?auto=format&fit=crop&w=800&q=80',
      detail: 'https://images.unsplash.com/photo-1582738411706-bfc8e691d1c2?auto=format&fit=crop&w=800&q=80',
    },
  ],
};

export const COLLECTIONS = [
  { id: 'cyber-toon', name: 'Cyber Toon Glitch', tag: 'PopGlitch', gsm: 460 },
  { id: 'mecha-bot', name: 'Mecha Bot Evolution', tag: 'MechaBot', gsm: 480 },
  { id: 'rogue-clan', name: 'Rogue Clan Distressed', tag: 'RogueClan', gsm: 450 },
  { id: 'chibi-splash', name: 'Chibi Harajuku Splash', tag: 'ChibiDrip', gsm: 380 },
  { id: 'street-ronin', name: 'Street Ronin Brush', tag: 'RoninBrush', gsm: 500 },
  { id: 'pixel-quest', name: 'Pixel Quest 8-Bit', tag: 'PixelArt', gsm: 360 },
  { id: 'solar-flare', name: 'Solar Flare Washed', tag: 'SolarFlare', gsm: 420 },
  { id: 'synth-sunset', name: 'Synth Wave Sunset', tag: 'SynthWave', gsm: 350 },
  { id: 'demon-mask', name: 'Demon Mask Pop Art', tag: 'DemonPop', gsm: 460 },
  { id: 'khanhbro-drip', name: 'KhanhBro Signature Drip', tag: 'KhanhBro', gsm: 480 },
];

export const COLLECTION_HERO_ASSETS: Record<string, string> = {
  'KhanhBro Signature Drip': '/assets/images/khanhbro_hoodie_sample.jpg',
  'Cyber Toon Glitch': '/assets/images/cyber_toon_glitch.jpg',
  'Mecha Bot Evolution': '/assets/images/mecha_bot_evolution.jpg',
  'Street Ronin Brush': '/assets/images/street_ronin_brush.jpg',
  'Chibi Harajuku Splash': '/assets/images/chibi_harajuku_splash.jpg',
  'Pixel Quest 8-Bit': '/assets/images/pixel_quest_8bit.jpg',
  'Solar Flare Washed': '/assets/images/solar_flare_washed.jpg',
  'Synth Wave Sunset': '/assets/images/synth_wave_sunset.jpg',
  'Demon Mask Pop Art': '/assets/images/demon_mask_popart.jpg',
  'Rogue Clan Distressed': '/assets/images/rogue_clan_distressed.jpg',
};

const COLORS_POOL = [
  ['Onyx Black', 'Sunset Coral'],
  ['Washed Charcoal', 'Electric Cyan'],
  ['Deep Lavender', 'Shadow Black'],
  ['Bone White', 'Pop Magenta'],
  ['Neon Purple', 'Hyper Green'],
  ['Graphite Grey', 'Comic Yellow'],
];

const seedDatabase = async () => {
  try {
    console.log('Connecting to database...');
    await connectDB();

    console.log('Clearing old collections...');
    await Product.deleteMany({});
    await Coupon.deleteMany({});
    await Order.deleteMany({});

    console.log('Seeding coupons...');
    const coupons = [
      {
        code: 'TOON10',
        discountPercent: 10,
        minOrderValue: 0,
        description: 'Instant 10% OFF on all cartoon streetwear drops',
        isActive: true,
      },
      {
        code: 'FREESHIP',
        discountPercent: 0,
        isFreeShipping: true,
        minOrderValue: 75,
        description: 'Free Worldwide Express Shipping on orders over $75',
        isActive: true,
      },
      {
        code: 'CYBER20',
        discountPercent: 20,
        minOrderValue: 120,
        description: '20% Mega Pop Discount on orders over $120',
        isActive: true,
      },
      {
        code: 'NEOTOKYO30',
        discountPercent: 30,
        minOrderValue: 200,
        description: '30% VIP Collector pass for elite streetwear hauls',
        isActive: true,
      },
      {
        code: 'LUCKYSPIN',
        discountPercent: 15,
        minOrderValue: 50,
        description: 'Mystery Wheel Lucky Spin 15% Pop Discount',
        isActive: true,
      },
    ];
    await Coupon.insertMany(coupons);

    console.log('Seeding products...');
    const productsToInsert = [];

    const categoryBreakdown = [
      { category: 'hoodies', count: 26, basePrice: 85, slot: 'top' },
      { category: 'tees', count: 26, basePrice: 42, slot: 'top' },
      { category: 'bottoms', count: 20, basePrice: 78, slot: 'bottom' },
      { category: 'outerwear', count: 14, basePrice: 135, slot: 'top' },
      { category: 'accessories', count: 10, basePrice: 32, slot: 'head' },
      { category: 'collectibles', count: 4, basePrice: 65, slot: 'accessory' },
    ];

    let overallIndex = 1;
    const now = Date.now();

    for (const group of categoryBreakdown) {
      const imgSet = FASHION_IMAGE_PAIRS[group.category as keyof typeof FASHION_IMAGE_PAIRS];

      for (let i = 0; i < group.count; i++) {
        const collection = COLLECTIONS[(overallIndex - 1) % COLLECTIONS.length];
        const colorSet = COLORS_POOL[(overallIndex - 1) % COLORS_POOL.length];
        const isFlashSale = overallIndex % 4 === 0;
        const discountPercent = isFlashSale ? 25 : 0;
        const price = Math.round(group.basePrice + (overallIndex % 7) * 4);
        const originalPrice = isFlashSale ? Math.round(price * 1.33) : price;

        const photoObj = imgSet[i % imgSet.length];
        const heroAsset = COLLECTION_HERO_ASSETS[collection.name];
        const frontImage = heroAsset || photoObj.front;
        const title = `${collection.name} ${group.category.charAt(0).toUpperCase() + group.category.slice(1, -1)} #${overallIndex}`;
        const itemCreatedAt = new Date(now - (100 - overallIndex) * 3600000);

        productsToInsert.push({
          title,
          price,
          originalPrice,
          category: group.category,
          collectionName: collection.name,
          description: `Limited edition ${group.category} from the ${collection.name} capsule. Engineered with heavyweight ${collection.gsm} GSM combed French terry/cotton. Double-needle stitch construction, distressed pop wash, and high-density cartoon graphic prints.`,
          images: [frontImage, photoObj.back, photoObj.detail],
          colors: colorSet,
          sizes:
            group.category === 'accessories' || group.category === 'collectibles'
              ? ['One Size']
              : ['S', 'M', 'L', 'XL', 'XXL'],
          gsm: collection.gsm,
          stock: Math.floor(15 + Math.random() * 45),
          isFlashSale,
          discountPercent,
          tags: [collection.tag, 'Streetwear', 'FashionWekk', 'KhanhBro', 'ToonDrip', 'Cartoon', group.category],
          rating: Number((4.6 + (overallIndex % 5) * 0.08).toFixed(1)),
          reviewCount: Math.floor(18 + Math.random() * 95),
          mascotSlot: group.slot,
          mascotAsset: `asset_${group.category}_${(overallIndex % 5) + 1}`,
          featured: overallIndex <= 12,
          createdAt: itemCreatedAt,
          updatedAt: itemCreatedAt,
        });

        overallIndex++;
      }
    }

    const inserted = await Product.insertMany(productsToInsert);
    console.log(`Seeded ${inserted.length} products`);

    console.log('Seeding sample order...');
    await Order.create({
      orderNumber: 'FW-884920',
      customerName: 'Doan Quoc Khanh',
      customerEmail: 'khanhbroo@fashionwekk.com',
      customerPhone: '+84 987 654 321',
      shippingAddress: '77 Nguyen Hue Boulevard, District 1, Ho Chi Minh City',
      items: [
        {
          productId: inserted[0]._id.toString(),
          title: inserted[0].title,
          price: inserted[0].price,
          quantity: 1,
          size: 'L',
          color: inserted[0].colors[0],
          image: inserted[0].images[0],
        },
        {
          productId: inserted[5]._id.toString(),
          title: inserted[5].title,
          price: inserted[5].price,
          quantity: 2,
          size: 'M',
          color: inserted[5].colors[0],
          image: inserted[5].images[0],
        },
      ],
      subtotal: inserted[0].price + inserted[5].price * 2,
      discountAmount: 15,
      shippingFee: 0,
      totalAmount: inserted[0].price + inserted[5].price * 2 - 15,
      couponApplied: 'TOON10',
      status: 'processing',
      paymentMethod: 'cod',
    });

    console.log('Seeding complete.');
    process.exit(0);
  } catch (error: any) {
    console.error('Seeder failed:', error);
    process.exit(1);
  }
};

seedDatabase();
