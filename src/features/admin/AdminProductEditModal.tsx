import React, { useState } from 'react';
import { X, Save, Edit3 } from 'lucide-react';
import { Product } from '../../types';

interface AdminProductEditModalProps {
  product: Product | null;
  onClose: () => void;
  onSave: (updatedProduct: Product) => void;
}

export const AdminProductEditModal: React.FC<AdminProductEditModalProps> = ({
  product,
  onClose,
  onSave,
}) => {
  if (!product) return null;

  const [title, setTitle] = useState(product.title);
  const [price, setPrice] = useState(String(product.price));
  const [originalPrice, setOriginalPrice] = useState(String(product.originalPrice));
  const [stock, setStock] = useState(String(product.stock));
  const [gsm, setGsm] = useState(String(product.gsm));
  const [category, setCategory] = useState(product.category);
  const [isFlashSale, setIsFlashSale] = useState(Boolean(product.isFlashSale));
  const [discountPercent, setDiscountPercent] = useState(String(product.discountPercent || 0));
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const payload = {
        title,
        price: Number(price),
        originalPrice: Number(originalPrice),
        stock: Number(stock),
        gsm: Number(gsm),
        category,
        isFlashSale,
        discountPercent: isFlashSale ? Number(discountPercent) : 0,
      };

      const res = await fetch(`/api/products/${product._id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!data.success) {
        throw new Error(data.message || 'Update failed');
      }

      onSave(data.data);
      onClose();
    } catch (err: any) {
      setError(err.message || 'Error updating product');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-sm">
      <div className="relative w-full max-w-lg rounded-3xl bg-white p-5 sm:p-6 border-2 border-slate-900/15 shadow-[8px_8px_0px_#0F172A] text-slate-900 max-h-[92dvh] overflow-y-auto">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 rounded-xl bg-slate-100 p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-200 transition-colors"
        >
          <X className="h-5 w-5" />
        </button>

        <div className="flex items-center gap-2 mb-4">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#FF5722] text-white shadow-sm">
            <Edit3 className="h-5 w-5" />
          </div>
          <div>
            <h3 className="font-display text-lg font-black text-slate-900">Edit Cartoon Streetwear Drop</h3>
            <p className="text-xs text-slate-500 font-mono font-medium">ID: {product._id}</p>
          </div>
        </div>

        {error && (
          <div className="mb-4 rounded-xl bg-rose-50 p-2.5 text-xs text-rose-600 border border-rose-200 font-semibold">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-xs font-bold text-slate-700">Drop Title *</label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="mt-1 w-full rounded-xl bg-slate-50 px-3.5 py-2 text-xs text-slate-900 border border-slate-200 focus:border-[#FF5722] focus:outline-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-bold text-slate-700">Retail Price ($) *</label>
              <input
                type="number"
                required
                min="0"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                className="mt-1 w-full rounded-xl bg-slate-50 px-3.5 py-2 text-xs text-slate-900 border border-slate-200 focus:border-[#FF5722] focus:outline-none"
              />
            </div>
            <div>
              <label className="text-xs font-bold text-slate-700">Original Price ($)</label>
              <input
                type="number"
                min="0"
                value={originalPrice}
                onChange={(e) => setOriginalPrice(e.target.value)}
                className="mt-1 w-full rounded-xl bg-slate-50 px-3.5 py-2 text-xs text-slate-900 border border-slate-200 focus:border-[#FF5722] focus:outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="text-xs font-bold text-slate-700">Stock (Units)</label>
              <input
                type="number"
                min="0"
                value={stock}
                onChange={(e) => setStock(e.target.value)}
                className="mt-1 w-full rounded-xl bg-slate-50 px-3.5 py-2 text-xs text-slate-900 border border-slate-200 focus:border-[#FF5722] focus:outline-none"
              />
            </div>
            <div>
              <label className="text-xs font-bold text-slate-700">Weight (GSM)</label>
              <input
                type="number"
                min="100"
                max="800"
                value={gsm}
                onChange={(e) => setGsm(e.target.value)}
                className="mt-1 w-full rounded-xl bg-slate-50 px-3.5 py-2 text-xs text-slate-900 border border-slate-200 focus:border-[#FF5722] focus:outline-none"
              />
            </div>
            <div>
              <label className="text-xs font-bold text-slate-700">Category</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as any)}
                aria-label="Category"
                className="mt-1 w-full rounded-xl bg-slate-50 px-3 py-2 text-xs text-slate-900 border border-slate-200 focus:border-[#FF5722] focus:outline-none cursor-pointer"
              >
                <option value="hoodies">Hoodies</option>
                <option value="tees">Tees</option>
                <option value="bottoms">Bottoms</option>
                <option value="outerwear">Outerwear</option>
                <option value="accessories">Accessories</option>
                <option value="collectibles">Collectibles</option>
              </select>
            </div>
          </div>

          <div className="flex items-center gap-4 rounded-2xl bg-slate-50 p-3 border border-slate-200">
            <label className="flex items-center gap-2 text-xs text-slate-800 font-bold cursor-pointer">
              <input
                type="checkbox"
                checked={isFlashSale}
                onChange={(e) => setIsFlashSale(e.target.checked)}
                className="rounded accent-[#FF5722]"
              />
              <span>Enable Flash Sale Drop</span>
            </label>

            {isFlashSale && (
              <div className="flex items-center gap-2">
                <span className="text-xs text-slate-500 font-medium">Discount (%):</span>
                <input
                  type="number"
                  min="5"
                  max="90"
                  value={discountPercent}
                  onChange={(e) => setDiscountPercent(e.target.value)}
                  className="w-16 rounded-lg bg-white px-2 py-1 text-xs text-slate-900 border border-slate-200"
                />
              </div>
            )}
          </div>

          <div className="flex justify-end gap-2 pt-2 border-t border-slate-200">
            <button
              type="button"
              onClick={onClose}
              className="rounded-xl bg-slate-100 hover:bg-slate-200 px-4 py-2 text-xs font-bold text-slate-700"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex items-center gap-1.5 rounded-xl bg-slate-900 hover:bg-[#FF5722] px-5 py-2 text-xs font-bold text-white shadow-sm disabled:opacity-50 transition-colors"
            >
              <Save className="h-4 w-4" />
              {loading ? 'Saving...' : 'Save Drop Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
