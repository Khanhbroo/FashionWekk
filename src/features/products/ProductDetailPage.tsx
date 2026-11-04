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
  Layers,
  Info,
  Shirt,
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
  const [activeTab, setActiveTab] = useState<'specs' | 'fit' | 'care' | 'reviews'>('specs');
  const [isSizeChartOpen, setIsSizeChartOpen] = useState(false);
  const [isRecentlyAdded, setIsRecentlyAdded] = useState(false);
  const [isWishlisted, setIsWishlisted] = useState(false);

  const heroImageContainerRef = useRef<HTMLDivElement>(null);
  const addBtnRef = useRef<HTMLButtonElement>(null);

  const { equipProduct, equipped, openStudio } = useMascotStore();
  const { addItem, openCart, getSubtotal } = useCartStore();
  const { playPop, playEquip, playWin } = useSoundFx();

  const isEquipped = Object.values(equipped).some((item) => item?._id === product._id);
  const isOutOfStock = product.stock === 0;

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
    }, 1600);
  };

  const handleEquipOnMascot = (e: React.MouseEvent<HTMLButtonElement>) => {
    animateSquashAndStretch(e.currentTarget, 1.2);
    equipProduct(product);
    playEquip();
    openStudio();
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: product.title,
        text: `Check out ${product.title} from FashionWekk by KhanhBro!`,
        url: window.location.href,
      }).catch(() => {});
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert('Product link copied to clipboard!');
    }
  };

  const relatedDrops = allProducts
    .filter((p) => p._id !== product._id && (p.collectionName === product.collectionName || p.category === product.category))
    .slice(0, 4);

  return (
    <div className="mx-auto max-w-7xl px-3 sm:px-6 lg:px-8 py-6 pb-28 sm:pb-8 w-full">
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-200/80 pb-4 mb-8">
        <nav className="flex items-center gap-1.5 text-xs text-slate-500 font-medium">
          <button
            onClick={onBack}
            className="hover:text-slate-900 transition-colors flex items-center gap-1"
          >
            <ArrowLeft className="h-3.5 w-3.5" /> Drops
          </button>
          <ChevronRight className="h-3 w-3 text-slate-400" />
          <button
            onClick={() => onSelectCollection(product.collectionName || 'all')}
            className="text-[#0096C7] font-bold hover:underline"
          >
            {product.collectionName || 'Collection'}
          </button>
          <ChevronRight className="h-3 w-3 text-slate-400" />
          <span className="text-slate-800 font-semibold truncate max-w-[200px] sm:max-w-xs">
            {product.title}
          </span>
        </nav>

        <div className="flex items-center gap-2">
          <button
            onClick={handleShare}
            className="flex items-center gap-1 rounded-xl bg-white px-3 py-1.5 text-xs font-bold text-slate-700 hover:text-slate-900 border border-slate-200 shadow-xs transition-colors"
          >
            <Share2 className="h-3.5 w-3.5" /> Share Drop
          </button>
          <button
            onClick={() => {
              setIsWishlisted(!isWishlisted);
              playPop();
            }}
            className={`rounded-xl px-3 py-1.5 text-xs font-bold border transition-colors shadow-xs ${
              isWishlisted
                ? 'bg-rose-50 text-rose-600 border-rose-200'
                : 'bg-white text-slate-700 hover:text-rose-600 border-slate-200'
            }`}
          >
            <Heart className={`h-3.5 w-3.5 ${isWishlisted ? 'fill-current' : ''}`} />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
        <div className="lg:col-span-7 flex flex-col gap-4">
          <div className="relative aspect-[4/5] sm:aspect-square w-full overflow-hidden rounded-3xl bg-white border-2 border-slate-900/15 shadow-[6px_6px_0px_#0F172A]">
            <div
              ref={heroImageContainerRef}
              onClick={handleHeroImageClick}
              className="relative h-full w-full cursor-crosshair overflow-hidden group bg-slate-100 select-none"
            >
              <img
                src={product.images[selectedImage] || product.images[0]}
                alt={product.title}
                width="650"
                height="650"
                fetchPriority="high"
                decoding="async"
                draggable={false}
                className="h-full w-full object-cover select-none pointer-events-none"
              />

              <div className="absolute left-4 top-4 flex flex-wrap gap-2 z-10 pointer-events-none">
                {product.isFlashSale && (
                  <span className="rounded-xl bg-[#FF2E93] px-3 py-1 text-xs font-black uppercase font-mono tracking-wider text-white shadow-md">
                    -{product.discountPercent}% FLASH DROP
                  </span>
                )}
                <span className="rounded-xl bg-slate-900/90 backdrop-blur-md px-3 py-1 text-xs font-mono font-bold text-white border border-white/20 shadow-xs">
                  {product.gsm} GSM HEAVYWEIGHT
                </span>
                <span className="rounded-xl bg-[#D4FF00] px-3 py-1 text-xs font-black text-black border border-black/20 shadow-xs font-mono uppercase">
                  LIMITED GRAIL
                </span>
              </div>

              <div className="absolute bottom-4 right-4 rounded-xl bg-white/90 backdrop-blur-md px-3 py-1 text-xs font-mono font-bold text-slate-800 border border-slate-200 shadow-sm pointer-events-none opacity-80 group-hover:opacity-100 transition-opacity">
                Click for Toon Splatter
              </div>
            </div>
          </div>

          {product.images.length > 1 && (
            <div className="flex items-center gap-3 overflow-x-auto pb-2 scrollbar-none">
              {product.images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={(e) => {
                    animateSquashAndStretch(e.currentTarget, 1.15);
                    setSelectedImage(idx);
                  }}
                  className={`relative h-20 w-20 flex-shrink-0 overflow-hidden rounded-2xl border-2 transition-all ${
                    selectedImage === idx
                      ? 'border-[#FF5722] shadow-[0_0_12px_#FF5722] scale-105'
                      : 'border-slate-200 hover:border-slate-400 opacity-70 hover:opacity-100 bg-white'
                  }`}
                >
                  <img
                    src={img}
                    alt="Angle view"
                    width="80"
                    height="80"
                    loading="lazy"
                    decoding="async"
                    draggable={false}
                    className="h-full w-full object-cover select-none pointer-events-none"
                  />
                  <span className="absolute bottom-0 inset-x-0 bg-slate-900/80 text-[10px] font-mono text-center text-white py-0.5 font-bold">
                    {idx === 0 ? 'Front' : idx === 1 ? 'Back' : 'Macro'}
                  </span>
                </button>
              ))}
            </div>
          )}

          <div className="rounded-3xl bg-slate-50 p-5 border-2 border-slate-900/10 shadow-[4px_4px_0px_#0F172A] flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-900 text-[#D4FF00] font-mono font-black text-sm border border-slate-900 shadow-md">
                KB
              </div>
              <div>
                <h4 className="font-display text-sm font-black text-slate-900">
                  KHANHBRO ATELIER SIGNATURE
                </h4>
                <p className="text-xs text-slate-500 font-medium">
                  Engineered with drop-shoulder boxy silhouette & double-needle collar tape.
                </p>
              </div>
            </div>

            <button
              onClick={handleEquipOnMascot}
              className={`flex items-center gap-1.5 rounded-xl px-4 py-2.5 text-xs font-bold transition-all shadow-sm cursor-pointer ${
                isEquipped
                  ? 'bg-[#FF5722] text-white shadow-md'
                  : 'bg-white hover:bg-slate-100 text-slate-800 border border-slate-200'
              }`}
            >
              <Shirt className="h-4 w-4 text-slate-700" />
              {isEquipped ? 'Equipped on Mascot' : 'Try on Mascot Avatar'}
            </button>
          </div>
        </div>

        <div className="lg:col-span-5 flex flex-col gap-6">
          <div>
            <div className="flex items-center justify-between text-xs mb-2">
              <button
                onClick={() => onSelectCollection(product.collectionName || 'all')}
                className="font-bold uppercase tracking-wider text-[#0096C7] hover:underline flex items-center gap-1"
              >
                <span>{product.collectionName || 'Curated Collection'}</span>
                <ChevronRight className="h-3.5 w-3.5" />
              </button>

              <div className="flex items-center gap-1 text-amber-500 font-mono font-bold">
                <Star className="h-4 w-4 fill-current" />
                <span>{product.rating}</span>
                <span className="text-slate-400 font-normal">({product.reviewCount} reviews)</span>
              </div>
            </div>

            <h1 className="font-display text-2xl sm:text-3xl font-black text-slate-900 tracking-tight leading-tight">
              {product.title}
            </h1>

            <div className="mt-3 flex items-baseline gap-3">
              <span className="font-display text-3xl font-black text-[#FF5722]">
                ${product.price.toFixed(2)}
              </span>
              {product.originalPrice > product.price && (
                <span className="text-sm text-slate-400 line-through font-mono">
                  ${product.originalPrice.toFixed(2)}
                </span>
              )}
              {product.isFlashSale && (
                <span className="rounded-lg bg-rose-50 px-2.5 py-0.5 text-xs font-mono font-bold text-rose-600 border border-rose-200">
                  Save ${(product.originalPrice - product.price).toFixed(2)}
                </span>
              )}
            </div>

            <p className="mt-3 text-xs sm:text-sm text-slate-600 leading-relaxed font-medium">
              {product.description}
            </p>
          </div>

          <FreeshipProgress subtotal={getSubtotal()} />

          <div className="space-y-4 pt-2 border-t border-slate-200/80">
            <div>
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-700">
                  Select Size: <strong className="text-slate-900 font-mono">{selectedSize}</strong>
                </span>
                <button
                  onClick={() => setIsSizeChartOpen(true)}
                  className="flex items-center gap-1 text-xs font-bold text-[#0096C7] hover:underline"
                >
                  <Ruler className="h-3.5 w-3.5" /> Size Chart & Fitting Guide
                </button>
              </div>

              <div className="mt-2 flex gap-2 flex-wrap">
                {product.sizes.map((size) => (
                  <button
                    key={size}
                    onClick={(e) => {
                      animateSquashAndStretch(e.currentTarget, 1.15);
                      setSelectedSize(size);
                    }}
                    className={`min-w-12 py-2 px-3 rounded-xl text-xs font-bold transition-all ${
                      selectedSize === size
                        ? 'bg-[#FF5722] text-white shadow-md shadow-[#FF5722]/30 scale-105'
                        : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200 shadow-xs'
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-slate-700">
                Available Colorways: <strong className="text-slate-900">{selectedColor}</strong>
              </span>
              <div className="mt-2 flex gap-2 flex-wrap">
                {product.colors.map((color) => (
                  <button
                    key={color}
                    onClick={(e) => {
                      animateSquashAndStretch(e.currentTarget, 1.15);
                      setSelectedColor(color);
                    }}
                    className={`rounded-xl px-3.5 py-1.5 text-xs font-bold border transition-all ${
                      selectedColor === color
                        ? 'border-[#FF5722] bg-[#FF5722]/10 text-[#FF5722] shadow-xs'
                        : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-100 shadow-xs'
                    }`}
                  >
                    {color}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex items-center justify-between rounded-2xl bg-slate-50 p-3.5 border border-slate-200">
              <span className="text-xs font-bold text-slate-700">Quantity</span>
              <div className="flex items-center gap-3">
                <button
                  onClick={(e) => handleQuantityChange(-1, e)}
                  disabled={quantity <= 1 || isOutOfStock}
                  className="rounded-xl bg-white p-2 text-slate-700 border border-slate-200 hover:bg-slate-100 disabled:opacity-30 disabled:pointer-events-none transition-colors shadow-xs"
                >
                  <Minus className="h-3.5 w-3.5" />
                </button>
                <span className="font-mono text-base font-black text-slate-900 min-w-8 text-center">
                  {quantity}
                </span>
                <button
                  onClick={(e) => handleQuantityChange(1, e)}
                  disabled={quantity >= product.stock || isOutOfStock}
                  className="rounded-xl bg-white p-2 text-slate-700 border border-slate-200 hover:bg-slate-100 disabled:opacity-30 disabled:pointer-events-none transition-colors shadow-xs"
                >
                  <Plus className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>

            <div className="flex flex-col gap-2.5 pt-2">
              <div className="flex gap-2">
                <button
                  ref={addBtnRef}
                  disabled={isOutOfStock}
                  onClick={() => handleAddToCart(false)}
                  className={`flex flex-1 items-center justify-center gap-2 rounded-2xl py-4 text-sm font-black transition-all shadow-md ${
                    isRecentlyAdded
                      ? 'bg-emerald-600 text-white shadow-emerald-600/30'
                      : 'bg-slate-900 hover:bg-[#FF5722] text-white'
                  }`}
                >
                  {isRecentlyAdded ? (
                    <>
                      <Check className="h-4 w-4 stroke-[3]" /> Added to Bag!
                    </>
                  ) : (
                    <>
                      <ShoppingBag className="h-4 w-4" />
                      {isOutOfStock ? 'Sold Out' : `Add to Bag (${quantity})`}
                    </>
                  )}
                </button>

                <button
                  disabled={isOutOfStock}
                  onClick={() => handleAddToCart(true)}
                  className="flex items-center justify-center gap-1.5 rounded-2xl bg-[#FF5722] hover:bg-[#FF6E40] px-6 py-4 text-sm font-black text-white shadow-md shadow-[#FF5722]/25 transition-all"
                >
                  Buy Now
                </button>
              </div>

              <div className="flex items-center justify-between text-[11px] text-slate-500 font-medium px-1 pt-1">
                <span className="flex items-center gap-1">
                  <Truck className="h-3.5 w-3.5 text-[#0096C7]" /> Express 24h Global Dispatch
                </span>
                <span className="flex items-center gap-1">
                  <Check className="h-3.5 w-3.5 text-emerald-600 stroke-[3]" /> Authenticity Guaranteed
                </span>
                <span className="flex items-center gap-1">
                  <RotateCcw className="h-3.5 w-3.5 text-emerald-600" /> 30-Day Hassle-Free Returns
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-16 rounded-3xl bg-white border-2 border-slate-900/10 shadow-[4px_4px_0px_#0F172A] p-6 sm:p-8">
        <div className="flex gap-4 sm:gap-8 border-b border-slate-200 pb-3 text-xs sm:text-sm font-bold overflow-x-auto scrollbar-none">
          <button
            onClick={() => setActiveTab('specs')}
            className={`pb-2 transition-colors whitespace-nowrap ${
              activeTab === 'specs'
                ? 'border-b-2 border-[#FF5722] text-[#FF5722]'
                : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            Fabric & Tailoring Architecture
          </button>
          <button
            onClick={() => setActiveTab('fit')}
            className={`pb-2 transition-colors whitespace-nowrap ${
              activeTab === 'fit'
                ? 'border-b-2 border-[#FF5722] text-[#FF5722]'
                : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            Boxy Fit Proportions
          </button>
          <button
            onClick={() => setActiveTab('care')}
            className={`pb-2 transition-colors whitespace-nowrap ${
              activeTab === 'care'
                ? 'border-b-2 border-[#FF5722] text-[#FF5722]'
                : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            Wash & Care Protocol
          </button>
          <button
            onClick={() => setActiveTab('reviews')}
            className={`pb-2 transition-colors whitespace-nowrap ${
              activeTab === 'reviews'
                ? 'border-b-2 border-[#FF5722] text-[#FF5722]'
                : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            Collector Reviews ({product.reviewCount})
          </button>
        </div>

        <div className="mt-6 text-xs sm:text-sm text-slate-700 leading-relaxed">
          {activeTab === 'specs' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-3">
                <h4 className="font-display font-black text-slate-900 uppercase tracking-wide">
                  Textile Engineering
                </h4>
                <ul className="space-y-2 text-slate-600">
                  <li><strong>Yarn Selection:</strong> 100% Long-Staple Combed Cotton / Dense French Terry</li>
                  <li><strong>Fabric Density:</strong> Heavyweight {product.gsm} GSM with high-tensile yarn twists</li>
                  <li><strong>Knit Construction:</strong> Interlock weave engineered to prevent diagonal torquing</li>
                  <li><strong>Seam Reinforcement:</strong> Double-needle bound collar tape with flatlock hems</li>
                </ul>
              </div>

              <div className="space-y-3">
                <h4 className="font-display font-black text-slate-900 uppercase tracking-wide">
                  Artwork & Print Chemistry
                </h4>
                <ul className="space-y-2 text-slate-600">
                  <li><strong>Print Medium:</strong> Multi-layer direct plastisol ink with crack-resistant flexible binders</li>
                  <li><strong>Color Fastness:</strong> Reactive garment dyeing process tested against 50+ wash cycles</li>
                  <li><strong>Atelier Signature:</strong> Cartoon splash graphics directed by KhanhBro</li>
                </ul>
              </div>
            </div>
          )}

          {activeTab === 'fit' && (
            <div className="space-y-4">
              <p className="font-medium text-slate-700">
                Engineered for an intentional boxy drop-shoulder aesthetic. Wide chest dimensions with slightly cropped hem to drape gracefully over tactical cargo or layered pieces.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="rounded-2xl bg-slate-50 p-4 border border-slate-200">
                  <span className="font-bold text-slate-900 block">Fitted Streetwear Look</span>
                  <span className="text-xs text-slate-500">Order 1 size down for standard drape</span>
                </div>
                <div className="rounded-2xl bg-amber-50 p-4 border border-amber-200">
                  <span className="font-bold text-slate-900 block">Signature Boxy Fit (Recommended)</span>
                  <span className="text-xs text-amber-800">Order true to size for signature drop shoulder</span>
                </div>
                <div className="rounded-2xl bg-slate-50 p-4 border border-slate-200">
                  <span className="font-bold text-slate-900 block">Exaggerated Oversized</span>
                  <span className="text-xs text-slate-500">Order 1 size up for extreme skate/hypebeast cut</span>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'care' && (
            <div className="space-y-3 max-w-2xl">
              <h4 className="font-display font-black text-slate-900 uppercase tracking-wide">
                Longevity & Print Preservation
              </h4>
              <p className="text-slate-600">
                Due to the heavyweight {product.gsm} GSM pure cotton construction and multi-layered cartoon splash prints, follow these instructions to keep your collector garment pristine:
              </p>
              <ul className="list-disc pl-5 space-y-1 text-slate-600">
                <li>Turn garment inside out prior to washing</li>
                <li>Machine wash cold (under 30°C / 86°F) on gentle cycle</li>
                <li>Hang dry away from direct sunlight; do not tumble dry</li>
                <li>Iron inside-out on low heat; avoid direct contact with graphic prints</li>
              </ul>
            </div>
          )}

          {activeTab === 'reviews' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-200">
                <div>
                  <span className="font-display text-2xl font-black text-slate-900">{product.rating} / 5.0</span>
                  <p className="text-xs text-slate-500">Based on {product.reviewCount} verified collector orders</p>
                </div>
                <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-bold text-emerald-600 border border-emerald-200">
                  100% Fit Accuracy Rating
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="rounded-2xl bg-slate-50 p-4 border border-slate-200 space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-900">Marcus Vance (LA Streetwear Guild)</span>
                    <span className="font-mono text-amber-500">★★★★★</span>
                  </div>
                  <p className="text-xs text-slate-600">
                    The {product.gsm} GSM fabric feels like armor! Perfect boxy drape and the cartoon graphic colors are even more intense in person. KhanhBro knocked it out of the park.
                  </p>
                </div>

                <div className="rounded-2xl bg-slate-50 p-4 border border-slate-200 space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-900">Sora Takahashi (Tokyo Pop Curator)</span>
                    <span className="font-mono text-amber-500">★★★★★</span>
                  </div>
                  <p className="text-xs text-slate-600">
                    Incredible quality. Double-needle collar has zero bacon-necking after wash. Definitely getting more drops from the {product.collectionName} series!
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {relatedDrops.length > 0 && (
        <div className="mt-16">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="font-display text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                MORE FROM <span className="text-[#FF5722]">{product.collectionName || 'CURATED CAPSULE'}</span>
              </h3>
              <p className="text-xs text-slate-500 font-medium">
                Collector drops engineered with matching cartoon pop-art graphics and heavyweight cotton
              </p>
            </div>
            <button
              onClick={() => onSelectCollection(product.collectionName || 'all')}
              className="text-xs font-bold text-[#0096C7] hover:underline flex items-center gap-1"
            >
              View Full Collection →
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {relatedDrops.map((drop) => (
              <ProductCard
                key={drop._id}
                product={drop}
                onOpenModal={(p) => onSelectProduct(p)}
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

      {/* Sticky Mobile Action Bar */}
      <div className="sm:hidden fixed bottom-14 left-0 right-0 z-30 bg-white/95 backdrop-blur-md border-t border-slate-200/90 p-3 shadow-[0_-4px_16px_rgba(0,0,0,0.08)] flex items-center justify-between gap-3">
        <div className="flex items-center gap-2.5 min-w-0">
          <img
            src={product.images[selectedImage] || product.images[0]}
            alt={product.title}
            className="h-10 w-10 rounded-lg object-cover border border-slate-200 flex-shrink-0"
          />
          <div className="truncate">
            <span className="font-display text-sm font-black text-[#FF5722] block">
              ${product.price.toFixed(2)}
            </span>
            <span className="text-[10px] text-slate-500 truncate block">
              {selectedSize} • {selectedColor}
            </span>
          </div>
        </div>

        <button
          disabled={isOutOfStock}
          onClick={() => handleAddToCart(false)}
          className={`flex items-center justify-center gap-1.5 rounded-xl px-5 py-2.5 text-xs font-black text-white shadow-md transition-all flex-shrink-0 cursor-pointer ${
            isRecentlyAdded
              ? 'bg-emerald-600 shadow-emerald-600/30'
              : 'bg-slate-900 hover:bg-[#FF5722]'
          }`}
        >
          {isRecentlyAdded ? (
            <>
              <Check className="h-3.5 w-3.5 stroke-[3]" /> Added!
            </>
          ) : (
            <>
              <ShoppingBag className="h-3.5 w-3.5" />
              {isOutOfStock ? 'Sold Out' : `Bag (${quantity})`}
            </>
          )}
        </button>
      </div>
    </div>
  );
};
