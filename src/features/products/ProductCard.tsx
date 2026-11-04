import React, { useState, useRef } from 'react';
import { Plus, Star, Check } from 'lucide-react';
import { Product } from '../../types';
import { useMascotStore } from '../../stores/mascotStore';
import { useCartStore } from '../../stores/cartStore';
import { useSoundFx } from '../../hooks/useSoundFx';
import { animateSquashAndStretch, animateFlyToCart } from '../../utils/animations';

interface ProductCardProps {
  product: Product;
  onOpenModal: (product: Product) => void;
  onSelectCollection?: (collection: string) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  onOpenModal,
  onSelectCollection,
}) => {
  const { equipProduct, equipped } = useMascotStore();
  const { addItem } = useCartStore();
  const { playPop, playEquip } = useSoundFx();

  const [isRecentlyAdded, setIsRecentlyAdded] = useState(false);
  const bagBtnRef = useRef<HTMLButtonElement>(null);
  const equipBtnRef = useRef<HTMLButtonElement>(null);

  const isEquipped = Object.values(equipped).some((item) => item?._id === product._id);

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
    <div className="product-reveal-item contain-drops group flex h-full flex-col overflow-hidden rounded-3xl bg-white border-2 border-slate-900/10 hover:border-slate-900/30 shadow-[4px_4px_0px_#0F172A] transition-colors">
      <div
        onClick={() => onOpenModal(product)}
        className="relative aspect-[4/5] w-full cursor-pointer overflow-hidden bg-slate-100 select-none"
      >
        <img
          src={product.images[0]}
          alt={product.title}
          width="400"
          height="500"
          draggable={false}
          className="h-full w-full object-cover select-none pointer-events-none"
          loading="lazy"
          decoding="async"
        />
        {product.images[1] && (
          <img
            src={product.images[1]}
            alt={`${product.title} back view`}
            width="400"
            height="500"
            draggable={false}
            className="absolute inset-0 h-full w-full object-cover opacity-0 transition-opacity duration-300 group-hover:opacity-100 select-none pointer-events-none"
            loading="lazy"
            decoding="async"
          />
        )}

        <div className="absolute left-3 top-3 flex flex-wrap gap-1.5 z-10">
          {product.isFlashSale && (
            <span className="rounded-lg bg-[#FF2E93] px-2.5 py-0.5 text-[11px] font-black uppercase tracking-wider text-white shadow-md font-mono">
              -{product.discountPercent}% FLASH
            </span>
          )}
          <span className="rounded-lg bg-slate-900/85 backdrop-blur-md px-2.5 py-0.5 text-xs font-mono font-semibold text-white border border-white/20 shadow-xs">
            {product.gsm} GSM
          </span>
        </div>

        <button
          ref={equipBtnRef}
          onClick={handleEquip}
          title={isEquipped ? 'Equipped on Mascot!' : 'Equip on Mascot Avatar'}
          className={`absolute right-3 top-3 z-10 flex items-center gap-1.5 rounded-full px-3 py-1 text-[11px] font-black uppercase tracking-wider shadow-md transition-all font-mono cursor-pointer ${
            isEquipped
              ? 'bg-[#FF5722] text-white shadow-[0_0_12px_#FF5722]'
              : 'bg-slate-900/80 backdrop-blur-md text-white hover:bg-[#D4FF00] hover:text-black border border-white/20'
          }`}
        >
          <span className="h-1.5 w-1.5 rounded-full bg-current" />
          {isEquipped ? 'Fitted' : 'Try Fit'}
        </button>

        <div className="pointer-events-none absolute bottom-2 right-2 rounded-xl bg-white/90 backdrop-blur-sm px-2 py-0.5 text-[10px] font-mono font-bold text-slate-700 opacity-0 group-hover:opacity-100 border border-slate-200">
          View Detail →
        </div>
      </div>

      <div className="flex flex-1 flex-col justify-between p-4 bg-white">
        <div>
          <div className="flex items-center justify-between text-xs text-slate-500">
            {onSelectCollection && product.collectionName ? (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  if (product.collectionName) {
                    onSelectCollection(product.collectionName);
                  }
                }}
                className="uppercase tracking-wider font-bold text-[#0096C7] hover:text-[#FF5722] hover:underline cursor-pointer transition-colors"
                title={`Explore ${product.collectionName} Collection`}
              >
                {product.collectionName}
              </button>
            ) : (
              <span className="uppercase tracking-wider font-bold text-[#0096C7]">
                {product.collectionName || product.category}
              </span>
            )}
            <span className="flex items-center gap-1 font-mono text-amber-500 font-semibold">
              <Star className="h-3 w-3 fill-current" />
              {product.rating} ({product.reviewCount})
            </span>
          </div>

          <h3
            onClick={() => onOpenModal(product)}
            className="mt-1.5 font-display text-sm font-bold text-slate-900 line-clamp-1 cursor-pointer hover:text-[#FF5722] transition-colors"
          >
            {product.title}
          </h3>

          <p className="mt-1 text-xs text-slate-500 line-clamp-2 leading-relaxed">
            {product.description}
          </p>
        </div>

        <div className="mt-4 flex items-center justify-between pt-3 border-t border-slate-100">
          <div className="flex items-baseline gap-2">
            <span className="font-display text-lg font-black text-[#FF5722]">
              ${product.price}
            </span>
            {product.originalPrice > product.price && (
              <span className="text-xs text-slate-400 line-through">
                ${product.originalPrice}
              </span>
            )}
          </div>

          <button
            ref={bagBtnRef}
            onClick={handleAddToCart}
            className={`flex items-center gap-1.5 rounded-xl px-3.5 py-1.5 text-xs font-bold transition-all shadow-sm ${
              isRecentlyAdded
                ? 'bg-emerald-600 text-white scale-105 shadow-md shadow-emerald-600/30'
                : 'bg-slate-900 text-white hover:bg-[#FF5722]'
            }`}
          >
            {isRecentlyAdded ? (
              <>
                <Check className="h-3.5 w-3.5 stroke-[3] animate-bounce" /> Added!
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
