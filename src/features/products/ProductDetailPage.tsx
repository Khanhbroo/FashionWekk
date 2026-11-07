import React, { useState, useRef, useEffect } from 'react';
import {
  ArrowLeft,
  Star,
  ShoppingBag,
  Truck,
  RotateCcw,
  Ruler,
  Check,
  Plus,
  Minus,
  Share2,
  Heart,
  ChevronRight,
  ChevronUp,
  ChevronDown,
  Shirt,
  Sparkles,
} from 'lucide-react';
import { Product } from '../../types';
import { useMascotStore } from '../../stores/mascotStore';
import { useCartStore } from '../../stores/cartStore';
import { useSoundFx } from '../../hooks/useSoundFx';
import {
  animateSquashAndStretch,
  animateFlyToCart,
  animateSplatterBurst,
} from '../../utils/animations';
import { FreeshipProgress } from '../cart/FreeshipProgress';
import { SizeChartModal } from './SizeChartModal';
import { ProductCard } from './ProductCard';
import { getMascotSlotForCategory, getMascotSlotBadge } from '../mascot/mascotLabels';
import { getOptimizedImageUrl } from '../../utils/imageOptimizer';

interface ProductDetailPageProps {
  product: Product;
  allProducts: Product[];
  onBack: () => void;
  onSelectProduct: (product: Product) => void;
  onSelectCollection: (collection: string) => void;
}

export const ProductDetailPage: React.FC<ProductDetailPageProps> = ({
  product,
  allProducts,
  onBack,
  onSelectProduct,
  onSelectCollection,
}) => {
  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedSize, setSelectedSize] = useState(product.sizes[0] || 'M');
  const [selectedColor, setSelectedColor] = useState(product.colors[0] || 'Black');
  const [quantity, setQuantity] = useState(1);
  const [isSizeChartOpen, setIsSizeChartOpen] = useState(false);
  const [isRecentlyAdded, setIsRecentlyAdded] = useState(false);
  const [isWishlisted, setIsWishlisted] = useState(false);

  const [openAccordion, setOpenAccordion] = useState<{
    materials: boolean;
    description: boolean;
    shipping: boolean;
  }>({
    materials: true,
    description: true,
    shipping: false,
  });

  const heroImageContainerRef = useRef<HTMLDivElement>(null);
  const addBtnRef = useRef<HTMLButtonElement>(null);

  const { equipProduct, equipped } = useMascotStore();
  const { addItem, getSubtotal } = useCartStore();
  const { playPop, playEquip } = useSoundFx();

  const isEquipped = Object.values(equipped).some((item) => item?._id === product._id);
  const isOutOfStock = product.stock === 0;

  const slotKey = getMascotSlotForCategory(product.category, product.mascotSlot);
  const slotMeta = getMascotSlotBadge(slotKey);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setSelectedImage(0);
    setSelectedSize(product.sizes[0] || 'M');
    setSelectedColor(product.colors[0] || 'Black');
    setQuantity(1);
  }, [product._id]);

  const handleHeroImageClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    animateSplatterBurst(e.currentTarget, x, y);
  };

  const handleQuantityChange = (delta: number, e?: React.MouseEvent<HTMLButtonElement>) => {
    if (e) animateSquashAndStretch(e.currentTarget, 1.2);
    const next = quantity + delta;
    if (next >= 1 && next <= Math.max(1, product.stock)) {
      setQuantity(next);
      playPop();
    }
  };

  const handleAddToCart = (openDrawer = false) => {
    if (isOutOfStock) return;
    if (addBtnRef.current) {
      animateSquashAndStretch(addBtnRef.current, 1.25);
      animateFlyToCart(addBtnRef.current);
    }
    setIsRecentlyAdded(true);
    addItem(
      {
        productId: product._id,
        title: product.title,
        price: product.price,
        quantity,
        size: selectedSize,
        color: selectedColor,
        image: product.images[selectedImage] || product.images[0] || '',
        gsm: product.gsm,
      },
      openDrawer
    );
    playPop();

    setTimeout(() => {
      setIsRecentlyAdded(false);
    }, 1800);
  };

  const handleEquipOnMascot = () => {
    equipProduct(product);
    playEquip();
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: product.title,
          text: `Check out ${product.title} on FashionWekk Atelier`,
          url: window.location.href,
        });
      } catch {
        // Share dismissed
      }
    } else {
      navigator.clipboard.writeText(window.location.href);
      playPop();
      alert('Link copied to clipboard!');
    }
  };

  const relatedProducts = allProducts
    .filter(
      (p) =>
        p._id !== product._id &&
        (p.collectionName === product.collectionName || p.category === product.category)
    )
    .slice(0, 4);

  return (
    <div className="mx-auto max-w-7xl px-3 sm:px-6 lg:px-8 py-6 pb-28 sm:pb-8 w-full select-none">
      {/* Editorial Navigation Breadcrumb */}
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#0A0A0C]/15 pb-4 mb-6">
        <nav className="flex items-center gap-1.5 text-xs font-mono font-bold uppercase tracking-wider text-slate-600">
          <button
            onClick={onBack}
            className="hover:text-black transition-colors flex items-center gap-1 cursor-pointer"
          >
            <ArrowLeft className="h-3.5 w-3.5" /> Drops
          </button>
          <span className="text-slate-300">/</span>
          <button
            onClick={() => onSelectCollection(product.collectionName || 'all')}
            className="text-slate-700 hover:text-black cursor-pointer"
          >
            {product.collectionName || 'Collection'}
          </button>
          <span className="text-slate-300">/</span>
          <span className="text-[#0A0A0C] truncate max-w-[200px] sm:max-w-xs font-black">
            {product.title}
          </span>
        </nav>

        <div className="flex items-center gap-2">
          <button
            onClick={handleShare}
            className="flex items-center gap-1 bg-white px-3 py-1.5 text-xs font-mono font-bold uppercase tracking-wider text-[#0A0A0C] border border-[#0A0A0C] shadow-xs hover:bg-[#D4FF00] transition-colors cursor-pointer"
          >
            <Share2 className="h-3.5 w-3.5" /> Share
          </button>
          <button
            onClick={() => {
              setIsWishlisted(!isWishlisted);
              playPop();
            }}
            className={`px-3 py-1.5 text-xs border border-[#0A0A0C] transition-colors cursor-pointer shadow-xs ${
              isWishlisted
                ? 'bg-rose-50 text-rose-600'
                : 'bg-white text-slate-700 hover:text-rose-600'
            }`}
          >
            <Heart className={`h-3.5 w-3.5 ${isWishlisted ? 'fill-current' : ''}`} />
          </button>
        </div>
      </div>

      {/* Main Split Editorial Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
        {/* Left Column: Editorial Lookbook Polaroid Cards */}
        <div className="lg:col-span-7 flex flex-col gap-4">
          <div className="w-full bg-white dark:bg-[#0E121B] p-3 sm:p-5 border-2 border-[#0A0A0C] dark:border-white/20 shadow-[8px_8px_0px_#0A0A0C] dark:shadow-[8px_8px_0px_rgba(212,255,0,0.4)] transition-colors">
            {/* Micro Metadata Header matching Dribbble */}
            <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-100 dark:border-slate-800 text-[11px] font-mono font-bold uppercase tracking-widest text-[#0A0A0C] dark:text-white">
              <span className="flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full bg-[#D4FF00]" />
                FASHIONWEKK // ATELIER
              </span>
              <span>SUMMER 2026</span>
            </div>

            {/* Main Interactive Stage with Splatter */}
            <div
              ref={heroImageContainerRef}
              onClick={handleHeroImageClick}
              className="relative aspect-[4/5] w-full overflow-hidden bg-slate-100 dark:bg-slate-900 border border-[#0A0A0C]/20 dark:border-white/15 cursor-crosshair group select-none"
              title="Click to trigger cartoon splatter"
            >
              <img
                src={getOptimizedImageUrl(product.images[selectedImage] || product.images[0], {
                  width: 900,
                  quality: 'auto:good',
                })}
                alt={product.title}
                width="700"
                height="875"
                fetchPriority="high"
                decoding="async"
                draggable={false}
                className="h-full w-full object-cover select-none pointer-events-none transition-transform duration-500 group-hover:scale-105"
              />

              <div className="absolute left-3 top-3 flex flex-wrap gap-1.5 z-10 pointer-events-none">
                {product.isFlashSale && (
                  <span className="bg-[#D4FF00] text-black px-2.5 py-0.5 text-xs font-mono font-black uppercase border border-black/30 shadow-xs">
                    -{product.discountPercent}% FLASH DROP
                  </span>
                )}
                <span className="bg-[#0A0A0C] text-white px-2.5 py-0.5 text-xs font-mono font-bold uppercase shadow-xs border border-white/20">
                  {product.gsm} GSM TERRY
                </span>
                <span className="bg-white/90 dark:bg-black/90 text-black dark:text-white px-2.5 py-0.5 text-xs font-mono font-black uppercase border border-black/20 dark:border-white/20 shadow-xs">
                  100 PIECES VAULT
                </span>
              </div>

              <div className="absolute bottom-3 right-3 rounded bg-white/90 dark:bg-black/90 backdrop-blur-sm px-2.5 py-1 text-[10px] font-mono font-bold text-slate-800 dark:text-slate-200 border border-slate-300 dark:border-slate-700 pointer-events-none opacity-80 group-hover:opacity-100 transition-opacity">
                Click for Toon Splatter
              </div>
            </div>

            {/* Thumbnail Angle Strip */}
            {product.images.length > 1 && (
              <div className="mt-4 flex items-center gap-3 overflow-x-auto pb-1 scrollbar-none">
                {product.images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={(e) => {
                      animateSquashAndStretch(e.currentTarget, 1.15);
                      setSelectedImage(idx);
                    }}
                    className={`relative h-20 w-20 flex-shrink-0 overflow-hidden border-2 transition-all cursor-pointer ${
                      selectedImage === idx
                        ? 'border-[#0A0A0C] dark:border-[#D4FF00] shadow-[3px_3px_0px_#0A0A0C] scale-105'
                        : 'border-slate-300 dark:border-slate-700 hover:border-black opacity-70 hover:opacity-100 bg-white dark:bg-slate-900'
                    }`}
                  >
                    <img
                      src={getOptimizedImageUrl(img, {
                        width: 160,
                        height: 160,
                        crop: 'fill',
                        quality: 'auto:good',
                      })}
                      alt="Thumbnail angle"
                      width="80"
                      height="80"
                      loading="lazy"
                      decoding="async"
                      draggable={false}
                      className="h-full w-full object-cover select-none pointer-events-none"
                    />
                    <span className="absolute bottom-0 inset-x-0 bg-[#0A0A0C]/85 text-[9px] font-mono text-center text-white py-0.5 font-bold uppercase">
                      {idx === 0 ? 'Front' : idx === 1 ? 'Back' : 'Macro'}
                    </span>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Atelier Mascot Banner */}
          <div className="bg-white dark:bg-[#0E121B] p-4 border-2 border-[#0A0A0C] dark:border-white/20 shadow-[4px_4px_0px_#0A0A0C] dark:shadow-[4px_4px_0px_rgba(212,255,0,0.3)] flex flex-col sm:flex-row items-center justify-between gap-3 transition-colors">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center bg-[#0A0A0C] text-[#D4FF00] font-mono font-black text-xs border border-white/20 shadow-xs">
                KB
              </div>
              <div>
                <h4 className="font-mono text-xs font-black uppercase text-[#0A0A0C] dark:text-white">
                  KHANHBRO ATELIER 3D FIT
                </h4>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">
                  Equip this collector piece onto your 3D Mascot Avatar.
                </p>
              </div>
            </div>

            <button
              onClick={handleEquipOnMascot}
              className={`flex items-center gap-1.5 px-4 py-2 text-xs font-mono font-bold uppercase tracking-wider transition-all cursor-pointer border border-[#0A0A0C] dark:border-white/20 ${
                isEquipped
                  ? 'bg-[#FF5722] text-white shadow-xs'
                  : 'bg-white dark:bg-[#141A26] hover:bg-[#D4FF00] hover:text-black text-slate-900 dark:text-white'
              }`}
            >
              <Shirt className="h-3.5 w-3.5" />
              {isEquipped ? `${slotMeta.label} Fitted on Mascot` : `Try ${slotMeta.label} on Avatar`}
            </button>
          </div>
        </div>

        {/* Right Column: Editorial Product Purchase Module */}
        <div className="lg:col-span-5 flex flex-col justify-between bg-white dark:bg-[#0E121B] p-5 sm:p-7 border-2 border-[#0A0A0C] dark:border-white/20 shadow-[8px_8px_0px_#0A0A0C] dark:shadow-[8px_8px_0px_rgba(212,255,0,0.4)] transition-colors">
          <div>
            {/* Collection tag & Rating */}
            <div className="flex items-center justify-between text-xs font-mono mb-2">
              <button
                onClick={() => onSelectCollection(product.collectionName || 'all')}
                className="font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 hover:text-black dark:hover:text-white hover:underline cursor-pointer flex items-center gap-1"
              >
                <span>{product.collectionName || 'Curated Collection'}</span>
                <ChevronRight className="h-3.5 w-3.5" />
              </button>

              <div className="flex items-center gap-1 font-bold text-[#0A0A0C] dark:text-white">
                <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                <span>{product.rating}</span>
                <span className="text-slate-400 font-normal">({product.reviewCount})</span>
              </div>
            </div>

            {/* Pricing Strip */}
            <div className="flex items-baseline gap-2 font-mono flex-wrap">
              <span className="font-display text-2xl sm:text-3xl font-black text-[#0A0A0C] dark:text-white">
                ${product.price}.00 USD
              </span>
              {product.originalPrice > product.price && (
                <span className="text-sm text-slate-400 dark:text-slate-500 line-through">
                  ${product.originalPrice}.00 USD
                </span>
              )}
              {slotKey !== 'none' && (
                <span
                  className="px-2.5 py-0.5 text-xs font-mono font-black uppercase text-[#0A0A0C] border border-[#0A0A0C] dark:border-white/30 shadow-xs flex items-center gap-1.5"
                  style={{ borderLeftColor: slotMeta.accentColor, borderLeftWidth: '4px', backgroundColor: `${slotMeta.accentColor}18` }}
                >
                  <span className="text-slate-600 dark:text-slate-300">Mascot Slot:</span>
                  <span className="font-bold text-[#0A0A0C] dark:text-white">{slotMeta.label}</span>
                </span>
              )}
            </div>

            {/* Ultra-Bold Italic Oblique Product Headline matching Dribbble */}
            <h1 className="mt-2 font-display text-2xl sm:text-4xl font-black italic tracking-tight uppercase leading-[0.95] text-[#0A0A0C] dark:text-white">
              {product.title}
            </h1>

            <p className="mt-3 text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed font-medium">
              {product.description}
            </p>

            <div className="mt-4">
              <FreeshipProgress subtotal={getSubtotal()} />
            </div>

            {/* Selectors */}
            <div className="mt-6 space-y-4 pt-4 border-t border-[#0A0A0C]/15 dark:border-white/10">
              {/* Size Selector */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-mono font-bold uppercase tracking-wider text-[#0A0A0C] dark:text-white">
                    Select Size: <strong>{selectedSize}</strong>
                  </span>
                  <button
                    onClick={() => setIsSizeChartOpen(true)}
                    className="flex items-center gap-1 text-[11px] font-mono font-bold uppercase text-slate-600 dark:text-slate-400 hover:text-black dark:hover:text-white underline cursor-pointer"
                  >
                    <Ruler className="h-3 w-3" /> Size Guide
                  </button>
                </div>

                <div className="flex gap-2 flex-wrap">
                  {product.sizes.map((size) => (
                    <button
                      key={size}
                      onClick={(e) => {
                        animateSquashAndStretch(e.currentTarget, 1.15);
                        setSelectedSize(size);
                      }}
                      className={`min-w-10 py-1.5 px-3 text-xs font-mono font-bold uppercase border transition-colors cursor-pointer ${
                        selectedSize === size
                          ? 'bg-[#0A0A0C] text-white border-[#0A0A0C] dark:bg-[#D4FF00] dark:text-black dark:border-[#D4FF00]'
                          : 'bg-white dark:bg-[#141A26] text-slate-800 dark:text-slate-200 border-slate-300 dark:border-white/20 hover:border-black'
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>

              {/* Colorway Selector */}
              <div>
                <span className="text-xs font-mono font-bold uppercase tracking-wider text-[#0A0A0C] dark:text-white block mb-2">
                  Colorway: <strong>{selectedColor}</strong>
                </span>
                <div className="flex gap-2 flex-wrap">
                  {product.colors.map((color) => (
                    <button
                      key={color}
                      onClick={(e) => {
                        animateSquashAndStretch(e.currentTarget, 1.15);
                        setSelectedColor(color);
                      }}
                      className={`px-3 py-1 text-xs font-mono font-bold uppercase border transition-colors cursor-pointer ${
                        selectedColor === color
                          ? 'bg-[#0A0A0C] text-white border-[#0A0A0C] dark:bg-[#D4FF00] dark:text-black dark:border-[#D4FF00]'
                          : 'bg-white dark:bg-[#141A26] text-slate-800 dark:text-slate-200 border-slate-300 dark:border-white/20 hover:border-black'
                      }`}
                    >
                      {color}
                    </button>
                  ))}
                </div>
              </div>

              {/* Quantity Selector & Add-To-Cart Row */}
              <div className="grid grid-cols-12 gap-2 pt-2">
                <div className="col-span-4 flex items-center justify-between border border-[#0A0A0C] dark:border-white/20 dark:bg-[#141A26] px-3 py-3 text-xs font-mono font-bold">
                  <button
                    type="button"
                    onClick={(e) => handleQuantityChange(-1, e)}
                    disabled={quantity <= 1 || isOutOfStock}
                    className="text-slate-500 dark:text-slate-400 hover:text-black dark:hover:text-white disabled:opacity-30 cursor-pointer"
                  >
                    <Minus className="h-3.5 w-3.5" />
                  </button>
                  <span className="text-[#0A0A0C] dark:text-white">{quantity}</span>
                  <button
                    type="button"
                    onClick={(e) => handleQuantityChange(1, e)}
                    disabled={quantity >= product.stock || isOutOfStock}
                    className="text-slate-500 dark:text-slate-400 hover:text-black dark:hover:text-white disabled:opacity-30 cursor-pointer"
                  >
                    <Plus className="h-3.5 w-3.5" />
                  </button>
                </div>

                <div className="col-span-8">
                  <button
                    ref={addBtnRef}
                    disabled={isOutOfStock}
                    onClick={() => handleAddToCart(false)}
                    className={`w-full h-full flex items-center justify-center gap-2 py-3.5 px-4 text-xs sm:text-sm font-black tracking-widest uppercase transition-all shadow-md cursor-pointer ${
                      isRecentlyAdded
                        ? 'bg-emerald-600 text-white'
                        : 'lime-gradient-btn'
                    }`}
                  >
                    {isRecentlyAdded ? (
                      <>
                        <Check className="h-4 w-4 stroke-[3]" /> Added to Bag!
                      </>
                    ) : (
                      <>
                        <ShoppingBag className="h-4 w-4" />
                        {isOutOfStock ? 'Sold Out' : 'ADD TO CART'}
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Accordion Sections: Materials & Details, Description matching Dribbble */}
          <div className="mt-8 pt-4 border-t border-[#0A0A0C]/15 dark:border-white/10 space-y-3">
            {/* Accordion 1: Materials & Details */}
            <div className="border-b border-slate-200 dark:border-slate-800 pb-3">
              <button
                onClick={() =>
                  setOpenAccordion((prev) => ({
                    ...prev,
                    materials: !prev.materials,
                  }))
                }
                className="w-full flex items-center justify-between text-left text-xs font-mono font-bold uppercase tracking-wider text-[#0A0A0C] dark:text-white cursor-pointer"
              >
                <span>Materials & Details</span>
                {openAccordion.materials ? (
                  <ChevronUp className="h-3.5 w-3.5" />
                ) : (
                  <ChevronDown className="h-3.5 w-3.5" />
                )}
              </button>

              {openAccordion.materials && (
                <div className="mt-2 space-y-1.5 text-xs font-mono text-slate-600 dark:text-slate-400 animate-in fade-in duration-150">
                  <div className="flex justify-between">
                    <span>Fabric:</span>
                    <span className="font-bold text-slate-900 dark:text-slate-200">
                      Medium Stretch {product.gsm} GSM Terry
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Fit Type:</span>
                    <span className="font-bold text-slate-900 dark:text-slate-200">Boxy Streetwear Oversized</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Sheer:</span>
                    <span className="font-bold text-slate-900 dark:text-slate-200">No (Opaque Heavyweight)</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Composition:</span>
                    <span className="font-bold text-slate-900 dark:text-slate-200">100% Combed Cotton, Silicone Drip</span>
                  </div>
                </div>
              )}
            </div>

            {/* Accordion 2: Description */}
            <div className="border-b border-slate-200 dark:border-slate-800 pb-3">
              <button
                onClick={() =>
                  setOpenAccordion((prev) => ({
                    ...prev,
                    description: !prev.description,
                  }))
                }
                className="w-full flex items-center justify-between text-left text-xs font-mono font-bold uppercase tracking-wider text-[#0A0A0C] dark:text-white cursor-pointer"
              >
                <span>Description & Atelier Specs</span>
                {openAccordion.description ? (
                  <ChevronUp className="h-3.5 w-3.5" />
                ) : (
                  <ChevronDown className="h-3.5 w-3.5" />
                )}
              </button>

              {openAccordion.description && (
                <div className="mt-2 space-y-1.5 text-xs font-mono text-slate-600 dark:text-slate-400 animate-in fade-in duration-150">
                  <div className="flex justify-between">
                    <span>Edition:</span>
                    <span className="font-bold text-slate-900 dark:text-slate-200">Capsule // Limited 100 Pieces</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Direction:</span>
                    <span className="font-bold text-slate-900 dark:text-slate-200">Personally directed by KhanhBro</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Care:</span>
                    <span className="font-bold text-slate-900 dark:text-slate-200">Cold wash inside out, Hang dry</span>
                  </div>
                </div>
              )}
            </div>

            {/* Dispatch notice */}
            <div className="pt-2 flex items-center justify-between text-[11px] font-mono text-slate-500 dark:text-slate-400">
              <span className="flex items-center gap-1">
                <Truck className="h-3.5 w-3.5 text-black dark:text-[#D4FF00]" /> Worldwide Express Air
              </span>
              <span className="flex items-center gap-1">
                <RotateCcw className="h-3.5 w-3.5 text-black dark:text-[#D4FF00]" /> 30-Day Free Exchanges
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Related Products Carousel */}
      {relatedProducts.length > 0 && (
        <div className="mt-16 pt-8 border-t border-[#0A0A0C]/15">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="font-display text-xl sm:text-2xl font-black italic uppercase tracking-tight text-[#0A0A0C]">
                More From This Capsule
              </h3>
              <p className="text-xs font-mono text-slate-500">
                Collector pieces from {product.collectionName || 'Atelier'}
              </p>
            </div>
            <button
              onClick={() => onSelectCollection(product.collectionName || 'all')}
              className="text-xs font-mono font-black uppercase text-[#0A0A0C] hover:underline"
            >
              View All →
            </button>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {relatedProducts.map((relProduct, idx) => (
              <ProductCard
                key={relProduct._id}
                product={relProduct}
                index={idx}
                onOpenModal={onSelectProduct}
                onSelectCollection={onSelectCollection}
              />
            ))}
          </div>
        </div>
      )}

      <SizeChartModal
        isOpen={isSizeChartOpen}
        onClose={() => setIsSizeChartOpen(false)}
        category={product.category}
      />
    </div>
  );
};
