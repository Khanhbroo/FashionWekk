import React, { useState, useRef } from 'react';
import { Plus, Star, Check } from 'lucide-react';
import { Product } from '../../types';
import { useMascotStore } from '../../stores/mascotStore';
import { useCartStore } from '../../stores/cartStore';
import { useSoundFx } from '../../hooks/useSoundFx';
import { animateSquashAndStretch, animateFlyToCart } from '../../utils/animations';
import { getMascotSlotForCategory, getMascotSlotBadge } from '../mascot/mascotLabels';
import { getOptimizedImageUrl } from '../../utils/imageOptimizer';

interface ProductCardProps {
  product: Product;
  index?: number;
  onOpenModal: (product: Product) => void;
  onSelectCollection?: (collection: string) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  index,
  onOpenModal,
  onSelectCollection,
}) => {
  const { equipProduct, equipped } = useMascotStore();
  const { addItem } = useCartStore();
  const { playPop, playEquip } = useSoundFx();

  const [isRecentlyAdded, setIsRecentlyAdded] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  const bagBtnRef = useRef<HTMLButtonElement>(null);
  const equipBtnRef = useRef<HTMLButtonElement>(null);

  const slotKey = getMascotSlotForCategory(product.category, product.mascotSlot);
  const slotMeta = getMascotSlotBadge(slotKey);
  const isEquipped = Object.values(equipped).some((item) => item?._id === product._id);

  const isAboveFold = index !== undefined && index < 4;
  const isHighPriority = index !== undefined && index < 2;

  const optimizedFrontImage = getOptimizedImageUrl(product.images[0], {
    width: 500,
    quality: 'auto:good',
  });
  const optimizedBackImage = product.images[1]
    ? getOptimizedImageUrl(product.images[1], { width: 500, quality: 'auto:good' })
    : null;

  const handleEquip = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (equipBtnRef.current) {
      animateSquashAndStretch(equipBtnRef.current, 1.2);
    }
    equipProduct(product);
    playEquip();
  };

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (bagBtnRef.current) {
      animateSquashAndStretch(bagBtnRef.current, 1.25);
      animateFlyToCart(bagBtnRef.current);
    }
    setIsRecentlyAdded(true);
    addItem(
      {
        productId: product._id,
        title: product.title,
        price: product.price,
        quantity: 1,
        size: product.sizes[0] || 'M',
        color: product.colors[0] || 'Black',
        image: product.images[0] || '',
        gsm: product.gsm,
      },
      false
    );
    playPop();

    setTimeout(() => {
      setIsRecentlyAdded(false);
    }, 1500);
  };

  return (
    <div
      onMouseEnter={() => setIsHovered(true)}
      className="product-reveal-item contain-drops group flex h-full flex-col overflow-hidden bg-white dark:bg-[#0E121B] border-2 border-[#0A0A0C] dark:border-white/20 shadow-[4px_4px_0px_#0A0A0C] dark:shadow-[4px_4px_0px_rgba(212,255,0,0.4)] hover:shadow-[6px_6px_0px_#0A0A0C] dark:hover:shadow-[6px_6px_0px_rgba(212,255,0,0.6)] hover:-translate-y-1 transition-all"
    >
      {/* Top Polaroid Meta Bar */}
      <div className="flex items-center justify-between px-3 py-1.5 border-b border-[#0A0A0C]/15 dark:border-white/10 bg-white dark:bg-[#121622] text-[10px] font-mono font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
        <span>FW // ATELIER</span>
        <span>{product.gsm ? `${product.gsm} GSM` : 'SS26'}</span>
      </div>

      <div
        onClick={() => onOpenModal(product)}
        className="relative aspect-[4/5] w-full cursor-pointer overflow-hidden bg-slate-100 dark:bg-slate-900 select-none border-b border-[#0A0A0C]/15 dark:border-white/10"
      >
        {/* Placeholder skeleton while front image is streaming */}
        {!isLoaded && (
          <div className="absolute inset-0 flex items-center justify-center bg-slate-200 dark:bg-slate-800 animate-pulse z-0">
            <span className="font-mono text-[9px] font-bold tracking-widest text-slate-400 uppercase">
              FW // ATELIER
            </span>
          </div>
        )}

        <img
          src={optimizedFrontImage}
          alt={product.title}
          width="400"
          height="500"
          draggable={false}
          className={`h-full w-full object-cover select-none pointer-events-none transition-transform duration-300 group-hover:scale-105 ${
            isLoaded ? 'opacity-100' : 'opacity-0'
          }`}
          loading={isAboveFold ? 'eager' : 'lazy'}
          fetchPriority={isHighPriority ? 'high' : 'auto'}
          decoding="async"
          onLoad={() => setIsLoaded(true)}
        />

        {/* Back view image only rendered into DOM when card is hovered */}
        {isHovered && optimizedBackImage && (
          <img
            src={optimizedBackImage}
            alt={`${product.title} back view`}
            width="400"
            height="500"
            draggable={false}
            className="absolute inset-0 h-full w-full object-cover opacity-0 transition-opacity duration-300 group-hover:opacity-100 select-none pointer-events-none"
            loading="lazy"
            decoding="async"
          />
        )}

        <div className="absolute left-2.5 top-2.5 flex flex-wrap gap-1 z-10">
          {product.isFlashSale && (
            <span className="bg-[#D4FF00] text-black px-2 py-0.5 text-[10px] font-mono font-black uppercase border border-black/30 shadow-xs">
              -{product.discountPercent}% FLASH
            </span>
          )}
          {product.season && product.season !== 'All-Season' && (
            <span className="bg-slate-900 text-white px-2 py-0.5 text-[10px] font-mono font-bold uppercase">
              {product.season}
            </span>
          )}
          {slotKey !== 'none' && (
            <span
              className="bg-white/95 text-[#0A0A0C] border border-[#0A0A0C] px-2 py-0.5 text-[9px] font-mono font-black uppercase tracking-wider shadow-xs backdrop-blur-xs flex items-center gap-1"
              style={{ borderLeftColor: slotMeta.accentColor, borderLeftWidth: '3px' }}
            >
              <span>{slotMeta.label}</span>
            </span>
          )}
        </div>

        <button
          ref={equipBtnRef}
          onClick={handleEquip}
          title={isEquipped ? 'Equipped on Mascot!' : `Equip as ${slotMeta.label} on Mascot Avatar`}
          className={`absolute right-2.5 top-2.5 z-10 flex items-center gap-1 px-2.5 py-0.5 text-[10px] font-black uppercase tracking-wider font-mono cursor-pointer transition-colors border ${
            isEquipped
              ? 'bg-[#FF5722] text-white border-[#FF5722] shadow-xs'
              : 'bg-white/95 text-black hover:bg-[#D4FF00] border-[#0A0A0C]'
          }`}
        >
          <span className="h-1.5 w-1.5 rounded-full bg-current" />
          {isEquipped ? `${slotMeta.shortTag} ON` : `FIT ${slotMeta.shortTag}`}
        </button>
      </div>

      <div className="flex flex-1 flex-col justify-between p-3.5 bg-white dark:bg-[#0E121B] transition-colors">
        <div>
          <div className="flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400 font-mono">
            {onSelectCollection && product.collectionName ? (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  if (product.collectionName) {
                    onSelectCollection(product.collectionName);
                  }
                }}
                className="uppercase tracking-wider font-bold text-slate-600 dark:text-slate-300 hover:text-black dark:hover:text-[#D4FF00] hover:underline cursor-pointer transition-colors"
                title={`Explore ${product.collectionName} Collection`}
              >
                {product.collectionName}
              </button>
            ) : (
              <span className="uppercase tracking-wider font-bold text-slate-600 dark:text-slate-300">
                {product.collectionName || product.category}
              </span>
            )}
            <span className="flex items-center gap-1 font-bold text-slate-800 dark:text-slate-200">
              <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
              {product.rating}
            </span>
          </div>

          <h3
            onClick={() => onOpenModal(product)}
            className="mt-1 font-display text-sm font-black italic uppercase tracking-tight text-[#0A0A0C] dark:text-white line-clamp-1 cursor-pointer hover:text-[#0096C7] dark:hover:text-[#D4FF00] transition-colors"
          >
            {product.title}
          </h3>

          <p className="mt-1 text-xs text-slate-500 dark:text-slate-400 line-clamp-2 leading-relaxed">
            {product.description}
          </p>
        </div>

        <div className="mt-3 flex items-center justify-between pt-2.5 border-t border-slate-100 dark:border-slate-800">
          <div className="flex items-baseline gap-1.5">
            <span className="font-display text-base font-black text-[#0A0A0C] dark:text-white">
              ${product.price}.00
            </span>
            {product.originalPrice > product.price && (
              <span className="text-xs text-slate-400 dark:text-slate-500 line-through font-mono">
                ${product.originalPrice}.00
              </span>
            )}
          </div>

          <button
            ref={bagBtnRef}
            onClick={handleAddToCart}
            className={`flex items-center gap-1 px-3 py-1 text-xs font-mono font-black uppercase transition-all cursor-pointer border border-[#0A0A0C] dark:border-white/20 ${
              isRecentlyAdded
                ? 'bg-emerald-600 text-white'
                : 'bg-[#0A0A0C] hover:bg-[#D4FF00] hover:text-black dark:bg-[#D4FF00] dark:text-black dark:hover:bg-white text-white'
            }`}
          >
            {isRecentlyAdded ? (
              <>
                <Check className="h-3.5 w-3.5 stroke-[3]" /> Added!
              </>
            ) : (
              <>
                <Plus className="h-3.5 w-3.5" /> Bag
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
