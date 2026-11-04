import React from 'react';
import { Product } from '../../types';
import { Star, Plus, Eye } from 'lucide-react';
import { useMascotStore } from '../../stores/mascotStore';
import { useCartStore } from '../../stores/cartStore';
import { useSoundFx } from '../../hooks/useSoundFx';
import { animateSquashAndStretch, animateFlyToCart } from '../../utils/animations';

interface ProductTableViewProps {
  products: Product[];
  onOpenModal: (product: Product) => void;
  onSelectCollection?: (collection: string) => void;
}

export const ProductTableView: React.FC<ProductTableViewProps> = ({
  products,
  onOpenModal,
  onSelectCollection,
}) => {
  const { equipProduct, equipped } = useMascotStore();
  const { addItem } = useCartStore();
  const { playPop, playEquip } = useSoundFx();

  return (
    <div className="my-6">
      {/* Mobile Stacked Card List (visible below md breakpoint) */}
      <div className="md:hidden space-y-3">
        {products.map((product) => {
          const isEquipped = Object.values(equipped).some((item) => item?._id === product._id);
          const isLowStock = product.stock > 0 && product.stock <= 10;
          const isOutOfStock = product.stock === 0;

          return (
            <div
              key={product._id}
              onClick={() => onOpenModal(product)}
              className="rounded-2xl bg-white p-3.5 border-2 border-slate-900/10 shadow-[3px_3px_0px_#0F172A] active:scale-[0.99] transition-transform cursor-pointer"
            >
              <div className="flex gap-3">
                <div className="relative h-20 w-20 flex-shrink-0 overflow-hidden rounded-xl bg-slate-100 border border-slate-200">
                  <img
                    src={product.images[0]}
                    alt={product.title}
                    draggable={false}
                    className="h-full w-full object-cover select-none pointer-events-none"
                    loading="lazy"
                  />
                  {product.isFlashSale && (
                    <span className="absolute top-1 left-1 rounded bg-[#FF2E93] px-1 py-0.2 text-[9px] font-black text-white">
                      FLASH
                    </span>
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-1 text-[11px]">
                    {product.collectionName && onSelectCollection ? (
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          if (product.collectionName) onSelectCollection(product.collectionName);
                        }}
                        className="font-bold uppercase tracking-wider text-[#0096C7] truncate hover:underline"
                      >
                        {product.collectionName}
                      </button>
                    ) : (
                      <span className="font-bold uppercase tracking-wider text-[#0096C7] truncate">
                        {product.collectionName || product.category}
                      </span>
                    )}
                    <span className="font-mono text-amber-500 font-bold flex items-center gap-0.5 flex-shrink-0">
                      <Star className="h-3 w-3 fill-current" />
                      {product.rating}
                    </span>
                  </div>

                  <h4 className="font-display text-sm font-bold text-slate-900 line-clamp-1 mt-0.5">
                    {product.title}
                  </h4>

                  <div className="flex items-center gap-2 text-[11px] text-slate-500 mt-1">
                    <span className="font-mono font-bold text-amber-600 bg-amber-50 px-1.5 py-0.5 rounded">
                      {product.gsm} GSM
                    </span>
                    <span>•</span>
                    {isOutOfStock ? (
                      <span className="text-rose-600 font-bold">Sold Out</span>
                    ) : isLowStock ? (
                      <span className="text-amber-600 font-bold">Only {product.stock} left</span>
                    ) : (
                      <span className="text-emerald-600 font-bold">{product.stock} in stock</span>
                    )}
                  </div>

                  <div className="mt-2.5 flex items-center justify-between">
                    <div className="flex items-baseline gap-1.5">
                      <span className="font-display text-base font-black text-[#FF5722]">
                        ${product.price}
                      </span>
                      {product.originalPrice > product.price && (
                        <span className="text-xs text-slate-400 line-through">
                          ${product.originalPrice}
                        </span>
                      )}
                    </div>

                    <div className="flex items-center gap-1.5" onClick={(e) => e.stopPropagation()}>
                      <button
                        onClick={(e) => {
                          animateSquashAndStretch(e.currentTarget);
                          equipProduct(product);
                          playEquip();
                        }}
                        className={`rounded-xl px-2.5 py-1.5 text-[11px] font-bold transition-all font-mono uppercase cursor-pointer ${
                          isEquipped
                            ? 'bg-[#FF5722] text-white'
                            : 'bg-slate-100 text-slate-700 hover:bg-[#D4FF00] hover:text-black border border-slate-200'
                        }`}
                      >
                        {isEquipped ? 'Equipped' : 'Fit'}
                      </button>

                      <button
                        disabled={isOutOfStock}
                        onClick={(e) => {
                          animateSquashAndStretch(e.currentTarget, 1.2);
                          animateFlyToCart(e.currentTarget);
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
                        }}
                        className="rounded-xl bg-slate-900 hover:bg-[#FF5722] px-3 py-1.5 text-xs font-bold text-white transition-colors disabled:opacity-30"
                      >
                        <Plus className="h-3 w-3 inline mr-0.5" /> Bag
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Desktop Responsive Table with Sticky Header */}
      <div
        tabIndex={0}
        role="region"
        aria-label="Streetwear drops specification table"
        className="hidden md:block overflow-x-auto rounded-3xl bg-white border-2 border-slate-900/10 shadow-[4px_4px_0px_#0F172A] focus:outline-none focus:ring-2 focus:ring-[#FF5722]/30"
      >
        <table className="w-full text-left text-xs text-slate-800 border-collapse">
          <thead className="bg-slate-100 uppercase text-xs font-mono text-slate-700 border-b border-slate-200 tracking-wider sticky top-0 z-10">
            <tr>
              <th className="p-4">Streetwear Piece</th>
              <th className="p-4">Collection</th>
              <th className="p-4">Category</th>
              <th className="p-4">Weight</th>
              <th className="p-4">Stock Status</th>
              <th className="p-4">Rating</th>
              <th className="p-4">Drop Price</th>
              <th className="p-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {products.map((product) => {
              const isEquipped = Object.values(equipped).some((item) => item?._id === product._id);
              const isLowStock = product.stock > 0 && product.stock <= 10;
              const isOutOfStock = product.stock === 0;

              return (
                <tr
                  key={product._id}
                  className="hover:bg-slate-50 transition-colors group cursor-pointer"
                  onClick={() => onOpenModal(product)}
                >
                  <td className="p-4 flex items-center gap-3">
                    <div className="relative h-12 w-12 flex-shrink-0 overflow-hidden rounded-xl bg-slate-100 border border-slate-200">
                      <img
                        src={product.images[0]}
                        alt={product.title}
                        draggable={false}
                        className="h-full w-full object-cover select-none pointer-events-none"
                        loading="lazy"
                      />
                      {product.isFlashSale && (
                        <span className="absolute top-0 right-0 h-2.5 w-2.5 rounded-full bg-[#FF2E93] ring-2 ring-white" />
                      )}
                    </div>
                    <div className="max-w-xs">
                      <span className="font-semibold text-slate-900 group-hover:text-[#FF5722] transition-colors line-clamp-1">
                        {product.title}
                      </span>
                      <div className="mt-0.5 flex items-center gap-1.5 text-xs text-slate-500">
                        <span>Size: {product.sizes.join(', ')}</span>
                        <span>•</span>
                        <span className="text-slate-400">{product.colors.join(' / ')}</span>
                      </div>
                    </div>
                  </td>

                  <td className="p-4">
                    {onSelectCollection && product.collectionName ? (
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          if (product.collectionName) {
                            onSelectCollection(product.collectionName);
                          }
                        }}
                        className="rounded-lg bg-slate-100 hover:bg-[#0096C7]/15 hover:text-[#0096C7] px-2.5 py-1 text-xs font-semibold text-slate-700 border border-slate-200 transition-colors cursor-pointer"
                        title={`Open ${product.collectionName} Collection Showcase`}
                      >
                        {product.collectionName}
                      </button>
                    ) : (
                      <span className="rounded-lg bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-700 border border-slate-200">
                        {product.collectionName || 'Season Drop'}
                      </span>
                    )}
                  </td>

                  <td className="p-4 uppercase text-[#0096C7] font-bold tracking-wider text-xs">
                    {product.category}
                  </td>

                  <td className="p-4 font-mono font-bold text-amber-600">
                    {product.gsm} GSM
                  </td>

                  <td className="p-4">
                    {isOutOfStock ? (
                      <span className="rounded-full bg-rose-50 px-2.5 py-0.5 text-xs font-bold text-rose-600 border border-rose-200">
                        Sold Out (0)
                      </span>
                    ) : isLowStock ? (
                      <span className="rounded-full bg-amber-50 px-2.5 py-0.5 text-xs font-bold text-amber-600 border border-amber-200">
                        Only {product.stock} Left
                      </span>
                    ) : (
                      <span className="rounded-full bg-emerald-50 px-2.5 py-0.5 text-xs font-bold text-emerald-600 border border-emerald-200">
                        {product.stock} in Stock
                      </span>
                    )}
                  </td>

                  <td className="p-4">
                    <span className="flex items-center gap-1 font-mono text-amber-500 font-semibold">
                      <Star className="h-3.5 w-3.5 fill-current" />
                      {product.rating}
                    </span>
                  </td>

                  <td className="p-4">
                    <div className="flex items-baseline gap-1.5">
                      <span className="font-display text-sm font-black text-[#FF5722]">
                        ${product.price}
                      </span>
                      {product.originalPrice > product.price && (
                        <span className="text-xs text-slate-400 line-through">
                          ${product.originalPrice}
                        </span>
                      )}
                    </div>
                  </td>

                  <td className="p-4 text-right" onClick={(e) => e.stopPropagation()}>
                    <div className="flex items-center justify-end gap-1.5">
                      <button
                        onClick={(e) => {
                          animateSquashAndStretch(e.currentTarget);
                          equipProduct(product);
                          playEquip();
                        }}
                        title={isEquipped ? 'Equipped on Mascot!' : 'Equip on Mascot'}
                        className={`flex items-center gap-1 rounded-xl px-2.5 py-1.5 text-[11px] font-bold transition-all cursor-pointer font-mono uppercase ${
                          isEquipped
                            ? 'bg-[#FF5722] text-white shadow-md'
                            : 'bg-slate-100 text-slate-700 hover:bg-[#D4FF00] hover:text-black border border-slate-200'
                        }`}
                      >
                        <span className="hidden sm:inline">{isEquipped ? 'Equipped' : 'Try Fit'}</span>
                        <span className="sm:hidden">{isEquipped ? 'Fit' : 'Try'}</span>
                      </button>

                      <button
                        disabled={isOutOfStock}
                        onClick={(e) => {
                          animateSquashAndStretch(e.currentTarget, 1.2);
                          animateFlyToCart(e.currentTarget);
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
                        }}
                        title="Add to Bag"
                        className="flex items-center gap-1 rounded-xl bg-slate-900 hover:bg-[#FF5722] px-3 py-1.5 text-xs font-bold text-white transition-colors disabled:opacity-30 disabled:pointer-events-none shadow-sm cursor-pointer"
                      >
                        <Plus className="h-3 w-3" />
                        <span>Bag</span>
                      </button>

                      <button
                        onClick={() => onOpenModal(product)}
                        title="View Details"
                        className="rounded-xl bg-slate-100 hover:bg-slate-200 p-1.5 text-slate-600 hover:text-slate-900 transition-colors border border-slate-200 cursor-pointer"
                      >
                        <Eye className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};
