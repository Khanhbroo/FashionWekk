import React from 'react';
import { Product } from '../../types';
import { ProductCard } from './ProductCard';
import { ProductTableView } from './ProductTableView';
import { PackageOpen } from 'lucide-react';

interface ProductListProps {
  products: Product[];
  loading: boolean;
  viewMode?: 'grid' | 'table';
  onOpenModal: (product: Product) => void;
  onSelectCollection?: (collection: string) => void;
  onResetFilters: () => void;
}

export const ProductList: React.FC<ProductListProps> = ({
  products,
  loading,
  viewMode = 'grid',
  onOpenModal,
  onSelectCollection,
  onResetFilters,
}) => {
  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 py-6">
        {[...Array(8)].map((_, i) => (
          <div
            key={i}
            className="flex flex-col rounded-3xl bg-white p-4 border-2 border-slate-900/10 shadow-[4px_4px_0px_#0F172A] animate-pulse"
          >
            <div className="aspect-[4/5] w-full rounded-2xl bg-slate-200 mb-4" />
            <div className="h-4 w-3/4 rounded bg-slate-200 mb-2" />
            <div className="h-3 w-1/2 rounded bg-slate-200 mb-4" />
            <div className="mt-auto flex justify-between items-center pt-2">
              <div className="h-5 w-16 rounded bg-slate-200" />
              <div className="h-7 w-20 rounded bg-slate-200" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="my-16 flex flex-col items-center justify-center text-center p-8 rounded-3xl bg-white border-2 border-slate-900/10 shadow-[4px_4px_0px_#0F172A]">
        <PackageOpen className="h-14 w-14 text-slate-400 mb-3" />
        <h3 className="font-display text-lg font-bold text-slate-900">No Drops Match Your Criteria</h3>
        <p className="mt-1 text-xs text-slate-500 max-w-sm">
          Try adjusting your search keywords, clear filters, or explore all cartoon streetwear collections.
        </p>
        <button
          onClick={onResetFilters}
          className="mt-5 rounded-xl bg-[#FF5722] hover:bg-[#FF6E40] px-5 py-2.5 text-xs font-bold text-white shadow-md hover:opacity-90 transition-all"
        >
          Reset All Filters
        </button>
      </div>
    );
  }

  if (viewMode === 'table') {
    return (
      <ProductTableView
        products={products}
        onOpenModal={onOpenModal}
        onSelectCollection={onSelectCollection}
      />
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 py-6">
      {products.map((product) => (
        <ProductCard
          key={product._id}
          product={product}
          onOpenModal={onOpenModal}
          onSelectCollection={onSelectCollection}
        />
      ))}
    </div>
  );
};
