import React, { useEffect, useRef, useState } from 'react';
import { X, ShoppingBag, RotateCcw, Check, Shirt, Disc } from 'lucide-react';
import { useMascotStore } from '../../stores/mascotStore';
import { useCartStore } from '../../stores/cartStore';
import { useSoundFx } from '../../hooks/useSoundFx';
import { MascotAvatar } from './MascotAvatar';
import { animateDrawerOpen, animateDrawerClose, animateSquashAndStretch, useBodyScrollLock } from '../../utils/animations';
import { Product } from '../../types';

const ATELIER_WARDROBE_PRESETS: Product[] = [
  {
    _id: 'mascot-preset-1',
    title: 'KhanhBro 3D Liquid Drip Hoodie',
    price: 125,
    originalPrice: 155,
    category: 'hoodies',
    collectionName: 'KhanhBro Signature Drip',
    description: 'Flagship 480 GSM French terry hoodie with 3D liquid cartoon splatters.',
    images: ['/assets/images/khanhbro_hoodie_sample.jpg'],
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
    images: ['/assets/images/cyber_toon_glitch.jpg'],
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
    _id: 'mascot-preset-3',
    title: 'Mecha Bot Evolution Tactical Cargo',
    price: 88,
    originalPrice: 110,
    category: 'bottoms',
    collectionName: 'Mecha Bot Evolution',
    description: 'Tactical cargo apparel with cybernetic robot line-art accents.',
    images: ['/assets/images/mecha_bot_evolution.jpg'],
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
    images: ['/assets/images/rogue_clan_distressed.jpg'],
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
    _id: 'mascot-preset-5',
    title: 'Demon Mask Pop Art Horned Beanie',
    price: 38,
    originalPrice: 48,
    category: 'accessories',
    collectionName: 'Demon Mask Pop Art',
    description: 'Mythological horned comic pop-art headwear mask and beanie.',
    images: ['/assets/images/demon_mask_popart.jpg'],
    colors: ['Onyx Black', 'Crimson Red'],
    sizes: ['One Size'],
    gsm: 460,
    stock: 22,
    isFlashSale: true,
    discountPercent: 15,
    tags: ['DemonMask', 'Headwear'],
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
    description: 'Cyan and pop-coral palm drift retro synth-wave headwear.',
    images: ['/assets/images/synth_wave_sunset.jpg'],
    colors: ['Electric Cyan', 'Sunset Coral'],
    sizes: ['One Size'],
    gsm: 350,
    stock: 28,
    isFlashSale: false,
    discountPercent: 0,
    tags: ['SynthWave', 'Cap'],
    rating: 4.8,
    reviewCount: 33,
    mascotSlot: 'head',
    mascotAsset: 'synth_cap',
    featured: true,
    createdAt: new Date().toISOString(),
  },
  {
    _id: 'mascot-preset-7',
    title: 'Pixel Quest 8-Bit Holo Medallion',
    price: 65,
    originalPrice: 80,
    category: 'collectibles',
    collectionName: 'Pixel Quest 8-Bit',
    description: 'Embossed silicone 8-bit monster floating holographic companion orb.',
    images: ['/assets/images/pixel_quest_8bit.jpg'],
    colors: ['Neon Green', 'Pixel Cyan'],
    sizes: ['One Size'],
    gsm: 360,
    stock: 15,
    isFlashSale: true,
    discountPercent: 20,
    tags: ['PixelQuest', 'Accessory'],
    rating: 4.9,
    reviewCount: 47,
    mascotSlot: 'accessory',
    mascotAsset: 'pixel_companion',
    featured: true,
    createdAt: new Date().toISOString(),
  },
  {
    _id: 'mascot-preset-8',
    title: 'Street Ronin Brush Tactical Blade Token',
    price: 72,
    originalPrice: 90,
    category: 'collectibles',
    collectionName: 'Street Ronin Brush',
    description: 'Dynamic comic calligraphic ink-splatter companion blade token.',
    images: ['/assets/images/street_ronin_brush.jpg'],
    colors: ['Jet Black', 'Deep Purple'],
    sizes: ['One Size'],
    gsm: 500,
    stock: 12,
    isFlashSale: false,
    discountPercent: 0,
    tags: ['StreetRonin', 'Accessory'],
    rating: 5.0,
    reviewCount: 60,
    mascotSlot: 'accessory',
    mascotAsset: 'ronin_blade',
    featured: true,
    createdAt: new Date().toISOString(),
  },
  {
    _id: 'mascot-preset-9',
    title: 'Chibi Harajuku Splash Kawaii Orb',
    price: 58,
    originalPrice: 70,
    category: 'collectibles',
    collectionName: 'Chibi Harajuku Splash',
    description: 'Kawaii pop-graffiti liquid splatter floating companion orb.',
    images: ['/assets/images/chibi_harajuku_splash.jpg'],
    colors: ['Pop Yellow', 'Vivid Coral'],
    sizes: ['One Size'],
    gsm: 380,
    stock: 20,
    isFlashSale: false,
    discountPercent: 0,
    tags: ['ChibiSplash', 'Accessory'],
    rating: 4.8,
    reviewCount: 39,
    mascotSlot: 'accessory',
    mascotAsset: 'chibi_orb',
    featured: true,
    createdAt: new Date().toISOString(),
  },
  {
    _id: 'mascot-preset-10',
    title: 'Solar Flare Washed Climax Vest',
    price: 92,
    originalPrice: 115,
    category: 'outerwear',
    collectionName: 'Solar Flare Washed',
    description: 'Washed charcoal comic climax energy burst streetwear vest.',
    images: ['/assets/images/solar_flare_washed.jpg'],
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

  const [categoryFilter, setCategoryFilter] = useState<'all' | 'accessories' | 'head' | 'top' | 'bottom'>('all');

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

  const filteredPresets = ATELIER_WARDROBE_PRESETS.filter((p) => {
    if (categoryFilter === 'all') return true;
    if (categoryFilter === 'accessories') return p.mascotSlot === 'accessory';
    if (categoryFilter === 'head') return p.mascotSlot === 'head';
    if (categoryFilter === 'top') return p.mascotSlot === 'top';
    if (categoryFilter === 'bottom') return p.mascotSlot === 'bottom';
    return true;
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
              className="rounded-lg p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-900 transition-colors"
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
                    className={`rounded-full px-3 py-1 text-xs font-semibold capitalize transition-all ${
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
                    className="flex items-center gap-1 text-xs text-slate-500 hover:text-[#FF5722] transition-colors font-medium"
                  >
                    <RotateCcw className="h-3 w-3" />
                    Reset Fit
                  </button>
                )}
              </div>

              {(['top', 'bottom', 'head', 'accessory'] as const).map((slot) => {
                const item = equipped[slot];
                const slotLabels = {
                  top: 'Top Wear (Hoodie / Tee)',
                  bottom: 'Bottom Wear (Cargo / Denim)',
                  head: 'Headwear (Beanie / Cap)',
                  accessory: 'Accessory & Hologram Orb',
                };

                return (
                  <div
                    key={slot}
                    className="flex items-center justify-between rounded-2xl bg-slate-50 p-2.5 sm:p-3 border border-slate-200"
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
                          Ø
                        </div>
                      )}
                      <div className="min-w-0">
                        <p className="text-[11px] text-slate-500 font-medium truncate">{slotLabels[slot]}</p>
                        <p className="text-xs sm:text-sm font-bold text-slate-900 truncate">
                          {item ? item.title : 'Bare / Default Fit'}
                        </p>
                      </div>
                    </div>

                    {item && (
                      <button
                        onClick={() => unequipSlot(slot)}
                        className="text-xs text-rose-500 hover:underline p-1 font-semibold flex-shrink-0"
                      >
                        Remove
                      </button>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Atelier Wardrobe & Accessories Rack */}
            <div className="mt-8 w-full border-t border-slate-200 pt-5">
              <div className="flex items-center justify-between mb-3 px-1">
                <div>
                  <h4 className="font-display text-sm font-black text-slate-900 tracking-wide uppercase">
                    Wardrobe & Accessories
                  </h4>
                  <p className="text-[11px] text-slate-500 font-medium">
                    10 Bespoke 3D Cartoon Pop-Art Grails
                  </p>
                </div>
                <span className="text-[10px] font-mono font-black bg-[#D4FF00] text-black px-2 py-0.5 rounded-md border border-black/20">
                  TAP TO EQUIP
                </span>
              </div>

              {/* Filter Tabs */}
              <div className="flex items-center gap-1.5 overflow-x-auto pb-2 scrollbar-none mb-3">
                {[
                  { id: 'all', label: 'All Grails' },
                  { id: 'accessories', label: 'Accessories' },
                  { id: 'head', label: 'Headwear' },
                  { id: 'top', label: 'Tops' },
                  { id: 'bottom', label: 'Bottoms' },
                ].map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setCategoryFilter(tab.id as any)}
                    className={`rounded-lg px-2.5 py-1 text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                      categoryFilter === tab.id
                        ? 'bg-slate-900 text-[#D4FF00] shadow-xs'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>

              {/* Grid of items */}
              <div className="grid grid-cols-2 gap-2.5 max-h-72 overflow-y-auto pr-1">
                {filteredPresets.map((preset) => {
                  const isCurrentEquipped = Object.values(equipped).some(
                    (item) => item?._id === preset._id || item?.images?.[0] === preset.images[0]
                  );

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
                        <span className="absolute top-1 left-1 rounded bg-slate-900/80 backdrop-blur-xs px-1.5 py-0.2 text-[9px] font-mono font-bold text-white uppercase">
                          {preset.mascotSlot}
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
                          {preset.gsm} GSM
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
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-slate-900 hover:bg-[#FF5722] py-3.5 text-sm font-bold text-white shadow-md transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
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