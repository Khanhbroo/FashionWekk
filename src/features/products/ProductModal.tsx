import React, { useState, useEffect, useRef } from 'react';
import {
  X,
  ShoppingBag,
  Truck,
  Star,
  Plus,
  Minus,
  Ruler,
  Check,
  Shirt,
} from 'lucide-react';
import { Product } from '../../types';
import { useMascotStore } from '../../stores/mascotStore';
import { useCartStore } from '../../stores/cartStore';
import { useSoundFx } from '../../hooks/useSoundFx';
import { SizeChartModal } from './SizeChartModal';
import { getMascotSlotForCategory, getMascotSlotBadge } from '../mascot/mascotLabels';
import {
  animateModalOpen,
  animateModalClose,
  animateSquashAndStretch,
  animateFlyToCart,
  animateSplatterBurst,
  useBodyScrollLock,
} from '../../utils/animations';

interface ProductModalProps {
  product: Product | null;
  onClose: () => void;
}

export const ProductModal: React.FC<ProductModalProps> = ({ product, onClose }) => {
  useBodyScrollLock(Boolean(product));

  if (!product) return null;

  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedSize, setSelectedSize] = useState(product.sizes[0] || 'M');
  const [selectedColor, setSelectedColor] = useState(product.colors[0] || 'Black');
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState<'desc' | 'specs' | 'reviews'>('desc');
  const [isSizeChartOpen, setIsSizeChartOpen] = useState(false);

  const modalRef = useRef<HTMLDivElement>(null);
  const backdropRef = useRef<HTMLDivElement>(null);
  const addBtnRef = useRef<HTMLButtonElement>(null);
  const imageContainerRef = useRef<HTMLDivElement>(null);

  const { equipProduct, equipped } = useMascotStore();
  const { addItem, openCart } = useCartStore();
  const { playPop, playEquip } = useSoundFx();

  const isEquipped = Object.values(equipped).some((item) => item?._id === product._id);
  const isOutOfStock = product.stock === 0;

  const slotKey = getMascotSlotForCategory(product.category, product.mascotSlot);
  const slotMeta = getMascotSlotBadge(slotKey);

  useEffect(() => {
    if (modalRef.current && backdropRef.current) {
      animateModalOpen(modalRef.current, backdropRef.current);
    }
  }, [product]);

  const handleClose = () => {
    if (modalRef.current && backdropRef.current) {
      animateModalClose(modalRef.current, backdropRef.current, onClose);
    } else {
      onClose();
    }
  };

  const handleImageClick = (e: React.MouseEvent<HTMLDivElement>) => {
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

  const handleAddToCart = () => {
    if (isOutOfStock) return;
    if (addBtnRef.current) {
      animateFlyToCart(addBtnRef.current);
      animateSquashAndStretch(addBtnRef.current, 1.25);
    }
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
      true
    );
    playPop();
    handleClose();
    openCart();
  };

  return (
    <>
      <div
        ref={backdropRef}
        onClick={handleClose}
        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm"
      >
        <div
          ref={modalRef}
          onClick={(e) => e.stopPropagation()}
          className="relative flex max-h-[92dvh] w-full max-w-4xl flex-col md:flex-row overflow-y-auto md:overflow-hidden bg-white border-2 border-[#0A0A0C] shadow-[10px_10px_0px_#0A0A0C] text-[#0A0A0C]"
        >
          <button
            onClick={handleClose}
            className="absolute right-4 top-4 z-20 bg-white hover:bg-[#D4FF00] p-2 text-black border border-[#0A0A0C] transition-colors cursor-pointer"
          >
            <X className="h-5 w-5" />
          </button>

          <div className="flex flex-col md:w-1/2 bg-slate-50 p-5 border-b md:border-b-0 md:border-r border-slate-200">
            <div
              ref={imageContainerRef}
              onClick={handleImageClick}
              className="relative aspect-square w-full overflow-hidden rounded-2xl bg-white border-2 border-slate-900/10 shadow-sm cursor-crosshair group select-none"
            >
              <img
                src={product.images[selectedImage] || product.images[0]}
                alt={product.title}
                draggable={false}
                className="h-full w-full object-cover select-none pointer-events-none"
              />
              {product.isFlashSale && (
                <div className="absolute left-3 top-3 rounded-lg bg-[#FF2E93] px-2.5 py-1 text-xs font-black text-white shadow-md">
                  -{product.discountPercent}% FLASH DROP
                </div>
              )}
              <div className="absolute bottom-2 right-2 rounded-lg bg-black/60 backdrop-blur-sm px-2 py-0.5 text-[9px] font-mono text-white pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity">
                Click for Toon Splatter
              </div>
            </div>

            {product.images.length > 1 && (
              <div className="mt-3 flex gap-2">
                {product.images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={(e) => {
                      animateSquashAndStretch(e.currentTarget, 1.15);
                      setSelectedImage(idx);
                    }}
                    className={`relative h-16 w-16 overflow-hidden rounded-xl border-2 transition-all ${
                      selectedImage === idx
                        ? 'border-[#FF5722] shadow-[0_0_8px_#FF5722] opacity-100 scale-105'
                        : 'border-slate-200 opacity-60 hover:opacity-100'
                    }`}
                  >
                    <img
                      src={img}
                      alt="Thumbnail"
                      draggable={false}
                      className="h-full w-full object-cover select-none pointer-events-none"
                    />
                    <span className="absolute bottom-0 inset-x-0 bg-slate-900/80 text-[9px] font-mono text-center text-white py-0.2">
                      {idx === 0 ? 'Front' : idx === 1 ? 'Back' : 'Texture'}
                    </span>
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="flex flex-1 flex-col justify-between p-6 overflow-y-auto">
            <div>
              <div className="flex items-center justify-between text-xs text-slate-500">
                <span className="font-bold uppercase tracking-wider text-[#0096C7]">
                  {product.collectionName || product.category}
                </span>
                <span className="flex items-center gap-1 text-amber-500 font-mono font-bold">
                  <Star className="h-3.5 w-3.5 fill-current" /> {product.rating} (
                  {product.reviewCount} verified reviews)
                </span>
              </div>

              <h2 className="mt-1.5 font-display text-xl sm:text-2xl font-black italic uppercase tracking-tight text-[#0A0A0C]">
                {product.title}
              </h2>

              <div className="mt-3 flex items-baseline gap-3 flex-wrap">
                <span className="font-display text-2xl font-black text-[#0A0A0C]">
                  ${product.price}.00 USD
                </span>
                {product.originalPrice > product.price && (
                  <span className="text-sm text-slate-400 line-through font-mono">
                    ${product.originalPrice}.00 USD
                  </span>
                )}
                {product.gsm > 0 && (
                  <span className="bg-[#D4FF00] px-2.5 py-0.5 text-xs font-mono font-black uppercase text-black border border-black/30 shadow-xs">
                    {product.gsm} GSM Heavyweight
                  </span>
                )}
                {slotKey !== 'none' && (
                  <span
                    className="px-2.5 py-0.5 text-xs font-mono font-black uppercase text-[#0A0A0C] border border-[#0A0A0C] shadow-xs flex items-center gap-1.5"
                    style={{ borderLeftColor: slotMeta.accentColor, borderLeftWidth: '4px', backgroundColor: `${slotMeta.accentColor}18` }}
                  >
                    <span>Mascot Slot:</span>
                    <span className="font-bold">{slotMeta.label}</span>
                  </span>
                )}
              </div>

              <div className="mt-4 flex gap-4 border-b border-slate-200 text-xs font-bold">
                <button
                  onClick={() => setActiveTab('desc')}
                  className={`pb-2 transition-colors ${
                    activeTab === 'desc'
                      ? 'border-b-2 border-[#FF5722] text-[#FF5722]'
                      : 'text-slate-500 hover:text-slate-900'
                  }`}
                >
                  Description
                </button>
                <button
                  onClick={() => setActiveTab('specs')}
                  className={`pb-2 transition-colors ${
                    activeTab === 'specs'
                      ? 'border-b-2 border-[#FF5722] text-[#FF5722]'
                      : 'text-slate-500 hover:text-slate-900'
                  }`}
                >
                  Fabric & Specs
                </button>
                <button
                  onClick={() => setActiveTab('reviews')}
                  className={`pb-2 transition-colors ${
                    activeTab === 'reviews'
                      ? 'border-b-2 border-[#FF5722] text-[#FF5722]'
                      : 'text-slate-500 hover:text-slate-900'
                  }`}
                >
                  Reviews ({product.reviewCount})
                </button>
              </div>

              <div className="mt-3 min-h-[60px] text-xs text-slate-600 leading-relaxed font-medium">
                {activeTab === 'desc' && <p>{product.description}</p>}
                {activeTab === 'specs' && (
                  <ul className="space-y-1.5 text-slate-700">
                    <li><strong>Fabric Composition:</strong> 100% Combed Pure Cotton / Dense French Terry</li>
                    <li><strong>Fabric Weight:</strong> {product.gsm} GSM high-density knit construction</li>
                    <li><strong>Stitching:</strong> Double-needle reinforced hems & tape-bound collar</li>
                    <li><strong>Wash Care:</strong> Machine wash cold inside-out, hang dry to preserve pop artwork</li>
                  </ul>
                )}
                {activeTab === 'reviews' && (
                  <div className="space-y-2">
                    <div className="rounded-xl bg-slate-50 p-2.5 border border-slate-200">
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-bold text-slate-900">Alex R. (Streetwear Collector)</span>
                        <span className="text-amber-500 font-mono">★★★★★</span>
                      </div>
                      <p className="mt-1 text-slate-600 text-xs">
                        Insane {product.gsm} GSM weight! Boxy oversized cut fits perfectly over hoodies, vibrant cartoon splash prints don't crack after wash.
                      </p>
                    </div>
                    <div className="rounded-xl bg-slate-50 p-2.5 border border-slate-200">
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-bold text-slate-900">Kai Chen (Hypebeast Reviewer)</span>
                        <span className="text-amber-500 font-mono">★★★★★</span>
                      </div>
                      <p className="mt-1 text-slate-600 text-xs">
                        Top-tier quality. KhanhBro nailed the cartoon pop-art aesthetic. Highly recommended!
                      </p>
                    </div>
                  </div>
                )}
              </div>

              <div className="mt-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold uppercase text-slate-500">Select Size:</span>
                  <button
                    onClick={() => setIsSizeChartOpen(true)}
                    className="flex items-center gap-1 text-xs font-bold text-[#0096C7] hover:underline"
                  >
                    <Ruler className="h-3 w-3" /> Size Guide
                  </button>
                </div>
                <div className="mt-1.5 flex gap-2">
                  {product.sizes.map((size) => (
                    <button
                      key={size}
                      onClick={() => setSelectedSize(size)}
                      className={`min-w-10 rounded-lg px-3 py-1.5 text-xs font-bold transition-all ${
                        selectedSize === size
                          ? 'bg-[#FF5722] text-white shadow-md'
                          : 'bg-slate-100 text-slate-700 hover:bg-slate-200 border border-slate-200'
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>

              <div className="mt-4">
                <span className="text-xs font-semibold uppercase text-slate-500">Available Colorway:</span>
                <div className="mt-1.5 flex gap-2">
                  {product.colors.map((color) => (
                    <button
                      key={color}
                      onClick={() => setSelectedColor(color)}
                      className={`rounded-lg px-3 py-1 text-xs font-medium border transition-all ${
                        selectedColor === color
                          ? 'border-[#FF5722] bg-[#FF5722]/10 text-[#FF5722] font-bold'
                          : 'border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100'
                      }`}
                    >
                      {color}
                    </button>
                  ))}
                </div>
              </div>

              <div className="mt-4 flex items-center justify-between rounded-xl bg-slate-50 p-3 border border-slate-200">
                <span className="text-xs font-semibold text-slate-600">Quantity:</span>
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => handleQuantityChange(-1)}
                    disabled={quantity <= 1 || isOutOfStock}
                    className="rounded-lg bg-white p-1.5 text-slate-700 border border-slate-200 hover:bg-slate-100 disabled:opacity-30 disabled:pointer-events-none transition-colors"
                  >
                    <Minus className="h-3.5 w-3.5" />
                  </button>
                  <span className="font-mono text-sm font-bold text-slate-900 min-w-6 text-center">
                    {quantity}
                  </span>
                  <button
                    onClick={() => handleQuantityChange(1)}
                    disabled={quantity >= product.stock || isOutOfStock}
                    className="rounded-lg bg-white p-1.5 text-slate-700 border border-slate-200 hover:bg-slate-100 disabled:opacity-30 disabled:pointer-events-none transition-colors"
                  >
                    <Plus className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
            </div>

            <div className="mt-6 space-y-2.5 pt-4 border-t border-slate-200">
              <div className="flex gap-2">
                <button
                  onClick={(e) => {
                    animateSquashAndStretch(e.currentTarget);
                    equipProduct(product);
                    playEquip();
                  }}
                  className={`flex flex-1 items-center justify-center gap-1.5 rounded-xl py-3 text-xs font-bold transition-all cursor-pointer ${
                    isEquipped
                      ? 'bg-[#FF5722] text-white shadow-md'
                      : 'bg-slate-100 text-slate-700 hover:bg-[#D4FF00] hover:text-black border border-slate-200'
                  }`}
                >
                  <Shirt className="h-4 w-4" />
                  {isEquipped ? `${slotMeta.label} Fitted on Mascot` : `Equip on Mascot (${slotMeta.label})`}
                </button>

                <button
                  ref={addBtnRef}
                  disabled={isOutOfStock}
                  onClick={handleAddToCart}
                  className="flex flex-1 items-center justify-center gap-1.5 py-3 text-xs font-black tracking-widest uppercase transition-all disabled:opacity-40 disabled:pointer-events-none hover:scale-[1.02] cursor-pointer lime-gradient-btn"
                >
                  <ShoppingBag className="h-4 w-4" />
                  {isOutOfStock ? 'Sold Out' : `Add to Bag (${quantity})`}
                </button>
              </div>

              <div className="flex items-center justify-between text-xs text-slate-500 pt-1 font-medium">
                <span className="flex items-center gap-1">
                  <Truck className="h-3.5 w-3.5 text-[#0096C7]" /> Express 24h Global Dispatch
                </span>
                <span className="flex items-center gap-1">
                  <Check className="h-3.5 w-3.5 text-emerald-600 stroke-[3]" /> 100% Authentic Atelier Drip
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <SizeChartModal
        isOpen={isSizeChartOpen}
        onClose={() => setIsSizeChartOpen(false)}
        category={product.category}
      />
    </>
  );
};
