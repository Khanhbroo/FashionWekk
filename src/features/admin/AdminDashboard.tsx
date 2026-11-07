import React, { useState, useEffect } from 'react';
import {
  ArrowLeft,
  DollarSign,
  Package,
  ShoppingBag,
  TrendingUp,
  Plus,
  Trash2,
  RefreshCw,
  Search,
  SlidersHorizontal,
  Edit,
  ChevronLeft,
  ChevronRight,
  Eye,
  CheckCircle2,
  Clock,
  AlertTriangle,
  XCircle,
  Tag,
  Calendar,
  Percent,
  Copy,
  Check,
  ToggleLeft,
  ToggleRight,
  Shield,
  Gift,
} from 'lucide-react';
import { Product, OrderData, CouponData } from '../../types';
import { AdminProductEditModal } from './AdminProductEditModal';

interface AdminDashboardProps {
  onBackToStore: () => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ onBackToStore }) => {
  const [activeTab, setActiveTab] = useState<'analytics' | 'products' | 'orders' | 'coupons'>('analytics');
  const [analytics, setAnalytics] = useState<any>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [orders, setOrders] = useState<OrderData[]>([]);
  const [coupons, setCoupons] = useState<CouponData[]>([]);
  const [loading, setLoading] = useState(false);

  const [productSearch, setProductSearch] = useState('');
  const [productCategory, setProductCategory] = useState('all');
  const [productPage, setProductPage] = useState(1);
  const productsPerPage = 10;
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  const [orderSearch, setOrderSearch] = useState('');
  const [orderStatus, setOrderStatus] = useState('all');
  const [selectedOrderDetails, setSelectedOrderDetails] = useState<OrderData | null>(null);

  const [newTitle, setNewTitle] = useState('');
  const [newPrice, setNewPrice] = useState('75');
  const [newCategory, setNewCategory] = useState<'hoodies' | 'tees' | 'bottoms' | 'outerwear' | 'accessories' | 'collectibles'>('hoodies');
  const [newGsm, setNewGsm] = useState('450');

  // Coupon Creation State
  const defaultExpiry = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
  const [couponCode, setCouponCode] = useState('');
  const [discountType, setDiscountType] = useState<'percent' | 'fixed' | 'freeship'>('percent');
  const [discountValue, setDiscountValue] = useState('20');
  const [minOrderValue, setMinOrderValue] = useState('0');
  const [expiryDate, setExpiryDate] = useState(defaultExpiry);
  const [usageLimit, setUsageLimit] = useState('0');
  const [couponDescription, setCouponDescription] = useState('');
  const [couponIsActive, setCouponIsActive] = useState(true);
  const [couponFormError, setCouponFormError] = useState('');
  const [couponFormSuccess, setCouponFormSuccess] = useState('');
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [resAnalytics, resProducts, resOrders, resCoupons] = await Promise.all([
        fetch('/api/orders/analytics/overview').then((r) => r.json()),
        fetch('/api/products?limit=100').then((r) => r.json()),
        fetch('/api/orders?limit=100').then((r) => r.json()),
        fetch('/api/coupons').then((r) => r.json()),
      ]);

      if (resAnalytics.success) setAnalytics(resAnalytics.data);
      if (resProducts.success) setProducts(resProducts.data);
      if (resOrders.success) setOrders(resOrders.data);
      if (resCoupons.success) setCoupons(resCoupons.data);
    } catch (e) {
      console.error('Failed to load admin data', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleCreateProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle) return;

    try {
      const payload = {
        title: newTitle,
        price: Number(newPrice),
        originalPrice: Number(newPrice),
        category: newCategory,
        gsm: Number(newGsm),
        collectionName: 'KhanhBro Signature Drip',
        description: `Premium cartoon streetwear drop with ${newGsm} GSM construction and dynamic pop-art graphics.`,
        images: [
          'https://res.cloudinary.com/dptpb60p7/image/upload/f_auto,q_auto/fashionwekk/masterpieces/khanhbro_hero_signature_drip.png',
          'https://res.cloudinary.com/dptpb60p7/image/upload/c_fill,w_800,h_1000,g_auto/f_auto,q_auto/fashionwekk/masterpieces/khanhbro_hero_signature_drip.png',
          'https://res.cloudinary.com/dptpb60p7/image/upload/c_crop,w_600,h_600,g_center/f_auto,q_auto/fashionwekk/masterpieces/khanhbro_hero_signature_drip.png',
        ],
        colors: ['Onyx Black', 'Sunset Coral'],
        sizes: ['S', 'M', 'L', 'XL'],
        tags: ['New Drop', 'FashionWekk', 'Cartoon'],
        stock: 25,
        featured: false,
      };

      const res = await fetch('/api/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (data.success) {
        setProducts([data.data, ...products]);
        setNewTitle('');
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteProduct = async (id: string) => {
    if (!confirm('Are you sure you want to permanently delete this drop from MongoDB Atlas?')) return;
    try {
      await fetch(`/api/products/${id}`, { method: 'DELETE' });
      setProducts(products.filter((p) => p._id !== id));
    } catch (err) {
      console.error(err);
    }
  };

  const handleUpdateOrderStatus = async (orderId: string, status: string) => {
    try {
      await fetch(`/api/orders/${orderId}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      });
      setOrders(orders.map((o) => (o._id === orderId ? { ...o, status: status as any } : o)));
    } catch (err) {
      console.error(err);
    }
  };

  const handleCreateCoupon = async (e: React.FormEvent) => {
    e.preventDefault();
    setCouponFormError('');
    setCouponFormSuccess('');

    if (!couponCode.trim()) {
      setCouponFormError('Coupon code is required');
      return;
    }

    try {
      const payload = {
        code: couponCode.trim().toUpperCase(),
        discountPercent: discountType === 'percent' ? Number(discountValue) : 0,
        fixedDiscount: discountType === 'fixed' ? Number(discountValue) : 0,
        isFreeShipping: discountType === 'freeship',
        minOrderValue: Number(minOrderValue) || 0,
        expiryDate: new Date(expiryDate).toISOString(),
        usageLimit: Number(usageLimit) || 0,
        description: couponDescription.trim(),
        isActive: couponIsActive,
      };

      const res = await fetch('/api/coupons', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!data.success) {
        setCouponFormError(data.message || 'Failed to create coupon');
        return;
      }

      setCoupons([data.data, ...coupons]);
      setCouponFormSuccess(`Coupon '${data.data.code}' created and saved to MongoDB Atlas!`);
      setCouponCode('');
      setCouponDescription('');
      setTimeout(() => setCouponFormSuccess(''), 4000);
    } catch (err: any) {
      setCouponFormError(err.message || 'Network error creating coupon');
    }
  };

  const handleToggleCouponActive = async (id: string, currentStatus: boolean) => {
    try {
      const res = await fetch(`/api/coupons/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isActive: !currentStatus }),
      });
      const data = await res.json();
      if (data.success) {
        setCoupons(coupons.map((c) => (c._id === id ? { ...c, isActive: !currentStatus } : c)));
      }
    } catch (err) {
      console.error('Failed to toggle coupon', err);
    }
  };

  const handleDeleteCoupon = async (id: string, code: string) => {
    if (!confirm(`Are you sure you want to permanently delete coupon '${code}' from MongoDB Atlas?`)) return;
    try {
      const res = await fetch(`/api/coupons/${id}`, { method: 'DELETE' });
      const data = await res.json();
      if (data.success) {
        setCoupons(coupons.filter((c) => c._id !== id));
      }
    } catch (err) {
      console.error('Failed to delete coupon', err);
    }
  };

  const handleCopyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  const handleSetQuickExpiry = (days: number) => {
    const d = new Date(Date.now() + days * 24 * 60 * 60 * 1000);
    setExpiryDate(d.toISOString().split('T')[0]);
  };

  const filteredProducts = products.filter((p) => {
    const matchesSearch =
      p.title.toLowerCase().includes(productSearch.toLowerCase()) ||
      p.collectionName?.toLowerCase().includes(productSearch.toLowerCase());
    const matchesCategory = productCategory === 'all' || p.category === productCategory;
    return matchesSearch && matchesCategory;
  });

  const totalProductPages = Math.ceil(filteredProducts.length / productsPerPage) || 1;
  const paginatedProducts = filteredProducts.slice(
    (productPage - 1) * productsPerPage,
    productPage * productsPerPage
  );

  const filteredOrders = orders.filter((o) => {
    const matchesSearch =
      o.orderNumber.toLowerCase().includes(orderSearch.toLowerCase()) ||
      o.customerName.toLowerCase().includes(orderSearch.toLowerCase()) ||
      o.customerEmail.toLowerCase().includes(orderSearch.toLowerCase());
    const matchesStatus = orderStatus === 'all' || o.status === orderStatus;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="min-h-screen bg-[#F8F9FD] text-[#0F172A]">
      <header className="border-b border-slate-200 bg-white/85 backdrop-blur-md px-4 sm:px-6 py-3.5 sticky top-0 z-30">
        <div className="mx-auto flex flex-col sm:flex-row max-w-7xl items-start sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <button
              onClick={onBackToStore}
              className="flex items-center gap-2 rounded-xl bg-slate-100 px-3 py-1.5 text-xs font-bold text-slate-700 hover:bg-slate-200 hover:text-slate-900 transition-colors border border-slate-200 shadow-xs cursor-pointer flex-shrink-0"
            >
              <ArrowLeft className="h-4 w-4" /> Back to Storefront
            </button>
            <h1 className="font-display text-base sm:text-lg font-black text-slate-900 tracking-wide truncate">
              FASHIONWEKK <span className="text-[#FF5722]">COMMAND CENTER</span>
            </h1>
          </div>

          <div className="flex items-center gap-2 self-end sm:self-auto">
            <button
              onClick={fetchData}
              className="flex items-center gap-1.5 rounded-xl bg-slate-100 px-3 py-1.5 text-xs font-semibold text-slate-700 hover:text-slate-900 transition-colors border border-slate-200 shadow-xs cursor-pointer"
            >
              <RefreshCw className={`h-3.5 w-3.5 ${loading ? 'animate-spin' : ''}`} /> Sync Atlas DB
            </button>
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-7xl p-4 sm:p-6 pb-24 sm:pb-8">
        <div className="flex gap-2 border-b border-slate-200 pb-3 overflow-x-auto scrollbar-none">
          {[
            { id: 'analytics', label: 'Analytics Overview', icon: TrendingUp },
            { id: 'products', label: `Products (${products.length})`, icon: Package },
            { id: 'orders', label: `Orders (${orders.length})`, icon: ShoppingBag },
            { id: 'coupons', label: `Coupons Vault (${coupons.length})`, icon: Tag },
          ].map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-bold transition-all ${
                  activeTab === tab.id
                    ? 'bg-[#FF5722] text-white shadow-md shadow-[#FF5722]/30'
                    : 'bg-white text-slate-700 hover:bg-slate-100 hover:text-slate-900 border border-slate-200 shadow-xs'
                }`}
              >
                <Icon className="h-4 w-4" /> {tab.label}
              </button>
            );
          })}
        </div>

        {activeTab === 'analytics' && analytics && (
          <div className="mt-6 space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="rounded-3xl bg-white p-5 border-2 border-slate-900/10 shadow-[4px_4px_0px_#0F172A]">
                <span className="text-xs text-slate-500 font-semibold">Total Live Revenue</span>
                <p className="mt-2 font-display text-3xl font-black text-[#FF5722]">
                  ${analytics.totalRevenue?.toFixed(2) || '0.00'}
                </p>
              </div>
              <div className="rounded-3xl bg-white p-5 border-2 border-slate-900/10 shadow-[4px_4px_0px_#0F172A]">
                <span className="text-xs text-slate-500 font-semibold">Total Orders Placed</span>
                <p className="mt-2 font-display text-3xl font-black text-[#0096C7]">
                  {analytics.totalOrders || 0}
                </p>
              </div>
              <div className="rounded-3xl bg-white p-5 border-2 border-slate-900/10 shadow-[4px_4px_0px_#0F172A]">
                <span className="text-xs text-slate-500 font-semibold">Live Drops in Atlas</span>
                <p className="mt-2 font-display text-3xl font-black text-[#7C3AED]">
                  {analytics.totalProducts || products.length}
                </p>
              </div>
            </div>

            <div className="rounded-3xl bg-white p-5 border-2 border-slate-900/10 shadow-[4px_4px_0px_#0F172A]">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900 mb-3">Order Status Pipeline</h3>
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 text-center">
                {Object.entries(analytics.statusCounts || {}).map(([status, count]) => (
                  <div key={status} className="rounded-2xl bg-slate-50 p-3 border border-slate-200">
                    <p className="text-xs uppercase text-slate-500 font-semibold">{status}</p>
                    <p className="mt-1 font-display text-xl font-bold text-slate-900">{String(count)}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'products' && (
          <div className="mt-6 space-y-6">
            <form onSubmit={handleCreateProduct} className="rounded-3xl bg-white p-5 border-2 border-slate-900/10 shadow-[4px_4px_0px_#0F172A]">
              <h3 className="text-xs font-bold uppercase tracking-wider text-[#FF5722] mb-3 flex items-center gap-1.5">
                <Plus className="h-4 w-4" /> Add New Cartoon Streetwear Drop to MongoDB
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-5 gap-3">
                <input
                  type="text"
                  placeholder="Drop Title (e.g. Cyber Toon Hoodie)"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="rounded-xl bg-slate-50 px-3.5 py-2 text-xs text-slate-900 border border-slate-200 focus:border-[#FF5722] focus:outline-none"
                />
                <input
                  type="number"
                  placeholder="Price ($)"
                  value={newPrice}
                  onChange={(e) => setNewPrice(e.target.value)}
                  className="rounded-xl bg-slate-50 px-3.5 py-2 text-xs text-slate-900 border border-slate-200 focus:border-[#FF5722] focus:outline-none"
                />
                <input
                  type="number"
                  placeholder="Weight (GSM)"
                  value={newGsm}
                  onChange={(e) => setNewGsm(e.target.value)}
                  className="rounded-xl bg-slate-50 px-3.5 py-2 text-xs text-slate-900 border border-slate-200 focus:border-[#FF5722] focus:outline-none"
                />
                <select
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value as any)}
                  aria-label="Product Category"
                  className="rounded-xl bg-slate-50 px-3 py-2 text-xs text-slate-900 border border-slate-200 focus:border-[#FF5722] focus:outline-none cursor-pointer"
                >
                  <option value="hoodies">Hoodies</option>
                  <option value="tees">Tees</option>
                  <option value="bottoms">Bottoms</option>
                  <option value="outerwear">Outerwear</option>
                  <option value="accessories">Accessories</option>
                  <option value="collectibles">Collectibles</option>
                </select>
                <button
                  type="submit"
                  className="rounded-xl bg-slate-900 hover:bg-[#FF5722] py-2 text-xs font-bold text-white shadow-sm transition-all"
                >
                  Create Drop
                </button>
              </div>
            </form>

            <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
              <div className="relative flex-1 w-full max-w-md">
                <Search className="absolute left-3.5 top-2.5 h-4 w-4 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search drops, collections..."
                  value={productSearch}
                  onChange={(e) => {
                    setProductSearch(e.target.value);
                    setProductPage(1);
                  }}
                  className="w-full rounded-xl bg-white pl-10 pr-4 py-2 text-xs text-slate-900 border border-slate-200 shadow-sm focus:border-[#FF5722] focus:outline-none"
                />
              </div>

              <div className="flex items-center gap-2 w-full sm:w-auto">
                <select
                  value={productCategory}
                  onChange={(e) => {
                    setProductCategory(e.target.value);
                    setProductPage(1);
                  }}
                  aria-label="Filter by category"
                  className="rounded-xl bg-white px-3 py-2 text-xs text-slate-800 border border-slate-200 shadow-sm focus:border-[#FF5722] focus:outline-none cursor-pointer"
                >
                  <option value="all">All Categories</option>
                  <option value="hoodies">Hoodies</option>
                  <option value="tees">Tees</option>
                  <option value="bottoms">Bottoms</option>
                  <option value="outerwear">Outerwear</option>
                  <option value="accessories">Accessories</option>
                  <option value="collectibles">Collectibles</option>
                </select>
              </div>
            </div>

            <div className="overflow-x-auto rounded-3xl bg-white border-2 border-slate-900/10 shadow-[4px_4px_0px_#0F172A]">
              <table className="w-full text-left text-xs text-slate-800">
                <thead className="bg-slate-100 text-slate-700 uppercase text-xs font-mono tracking-wider border-b border-slate-200">
                  <tr>
                    <th className="p-4">Streetwear Piece</th>
                    <th className="p-4">Category</th>
                    <th className="p-4">Collection</th>
                    <th className="p-4">Price</th>
                    <th className="p-4">GSM</th>
                    <th className="p-4">Stock Status</th>
                    <th className="p-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {paginatedProducts.map((p) => {
                    const isLow = p.stock > 0 && p.stock <= 10;
                    const isOut = p.stock === 0;

                    return (
                      <tr key={p._id} className="hover:bg-slate-50 transition-colors">
                        <td className="p-4 flex items-center gap-3">
                          <img
                            src={p.images[0]}
                            alt=""
                            className="h-10 w-10 rounded-xl object-cover border border-slate-200 bg-slate-100"
                          />
                          <div className="max-w-xs">
                            <span className="font-semibold text-slate-900 block truncate">{p.title}</span>
                            <span className="text-[10px] text-slate-500 font-mono">ID: {p._id.slice(-6)}</span>
                          </div>
                        </td>
                        <td className="p-4 uppercase text-[#0096C7] font-bold">{p.category}</td>
                        <td className="p-4 text-slate-700 font-medium">{p.collectionName || 'Season Drop'}</td>
                        <td className="p-4 font-black text-[#FF5722]">${p.price}</td>
                        <td className="p-4 font-mono font-bold text-amber-600">{p.gsm} GSM</td>
                        <td className="p-4">
                          {isOut ? (
                            <span className="rounded-full bg-rose-50 px-2 py-0.5 text-xs font-bold text-rose-600 border border-rose-200">
                              Sold Out (0)
                            </span>
                          ) : isLow ? (
                            <span className="rounded-full bg-amber-50 px-2 py-0.5 text-xs font-bold text-amber-600 border border-amber-200">
                              Only {p.stock} Left
                            </span>
                          ) : (
                            <span className="rounded-full bg-emerald-50 px-2 py-0.5 text-xs font-bold text-emerald-600 border border-emerald-200">
                              {p.stock} in Stock
                            </span>
                          )}
                        </td>
                        <td className="p-4 text-right">
                          <div className="flex items-center justify-end gap-1">
                            <button
                              onClick={() => setEditingProduct(p)}
                              className="rounded-lg p-1.5 text-[#0096C7] hover:text-white hover:bg-[#0096C7] transition-colors"
                              title="Edit Drop"
                            >
                              <Edit className="h-4 w-4" />
                            </button>
                            <button
                              onClick={() => handleDeleteProduct(p._id)}
                              className="rounded-lg p-1.5 text-rose-500 hover:text-white hover:bg-rose-500 transition-colors"
                              title="Delete Drop"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            <div className="flex items-center justify-between text-xs text-slate-500 pt-2 font-medium">
              <span>
                Showing {paginatedProducts.length} of {filteredProducts.length} items
              </span>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setProductPage(Math.max(1, productPage - 1))}
                  disabled={productPage === 1}
                  className="rounded-xl bg-white p-2 text-slate-700 hover:bg-slate-100 border border-slate-200 shadow-xs disabled:opacity-30"
                >
                  <ChevronLeft className="h-4 w-4" />
                </button>
                <span className="font-mono text-slate-900 font-bold">
                  Page {productPage} of {totalProductPages}
                </span>
                <button
                  onClick={() => setProductPage(Math.min(totalProductPages, productPage + 1))}
                  disabled={productPage === totalProductPages}
                  className="rounded-xl bg-white p-2 text-slate-700 hover:bg-slate-100 border border-slate-200 shadow-xs disabled:opacity-30"
                >
                  <ChevronRight className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'orders' && (
          <div className="mt-6 space-y-4">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
              <div className="relative flex-1 w-full max-w-md">
                <Search className="absolute left-3.5 top-2.5 h-4 w-4 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search order #, customer name, email..."
                  value={orderSearch}
                  onChange={(e) => setOrderSearch(e.target.value)}
                  className="w-full rounded-xl bg-white pl-10 pr-4 py-2 text-xs text-slate-900 border border-slate-200 shadow-sm focus:border-[#FF5722] focus:outline-none"
                />
              </div>

              <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto pb-1 scrollbar-none">
                {['all', 'pending', 'processing', 'shipped', 'delivered', 'cancelled'].map((st) => (
                  <button
                    key={st}
                    onClick={() => setOrderStatus(st)}
                    className={`rounded-lg px-3 py-1.5 text-xs font-semibold uppercase tracking-wider transition-all ${
                      orderStatus === st
                        ? 'bg-[#FF5722] text-white font-bold shadow-sm'
                        : 'bg-white text-slate-600 hover:text-slate-900 border border-slate-200 shadow-xs'
                    }`}
                  >
                    {st}
                  </button>
                ))}
              </div>
            </div>

            {filteredOrders.length === 0 ? (
              <div className="rounded-3xl bg-white p-12 text-center border-2 border-slate-900/10 shadow-[4px_4px_0px_#0F172A]">
                <ShoppingBag className="mx-auto h-12 w-12 text-slate-300 mb-3" />
                <p className="text-sm font-bold text-slate-800">No orders matching your criteria</p>
              </div>
            ) : (
              <div className="overflow-x-auto rounded-3xl bg-white border-2 border-slate-900/10 shadow-[4px_4px_0px_#0F172A]">
                <table className="w-full text-left text-xs text-slate-800">
                  <thead className="bg-slate-100 text-slate-700 uppercase text-xs font-mono tracking-wider border-b border-slate-200">
                    <tr>
                      <th className="p-4">Order #</th>
                      <th className="p-4">Customer</th>
                      <th className="p-4">Items</th>
                      <th className="p-4">Total Amount</th>
                      <th className="p-4">Payment</th>
                      <th className="p-4">Status</th>
                      <th className="p-4 text-right">Details</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {filteredOrders.map((order) => (
                      <tr key={order._id || order.orderNumber} className="hover:bg-slate-50 transition-colors">
                        <td className="p-4 font-mono font-bold text-[#0096C7]">
                          #{order.orderNumber}
                        </td>
                        <td className="p-4">
                          <p className="font-bold text-slate-900">{order.customerName}</p>
                          <p className="text-xs text-slate-500">{order.customerEmail}</p>
                        </td>
                        <td className="p-4">
                          <span className="rounded-md bg-slate-100 px-2 py-0.5 text-xs font-medium text-slate-700 border border-slate-200">
                            {order.items.reduce((s, it) => s + it.quantity, 0)} items
                          </span>
                        </td>
                        <td className="p-4 font-display font-black text-slate-900 text-sm">
                          ${order.totalAmount.toFixed(2)}
                        </td>
                        <td className="p-4 uppercase text-xs font-mono text-slate-500 font-bold">
                          {order.paymentMethod}
                        </td>
                        <td className="p-4">
                          <select
                            value={order.status}
                            onChange={(e) => handleUpdateOrderStatus(order._id!, e.target.value)}
                            aria-label="Update order status"
                            className="rounded-xl bg-slate-50 px-3 py-1 text-xs font-semibold text-slate-800 border border-slate-200 focus:border-[#FF5722] focus:outline-none cursor-pointer"
                          >
                            <option value="pending">Pending</option>
                            <option value="processing">Processing</option>
                            <option value="shipped">Shipped</option>
                            <option value="delivered">Delivered</option>
                            <option value="cancelled">Cancelled</option>
                          </select>
                        </td>
                        <td className="p-4 text-right">
                          <button
                            onClick={() => setSelectedOrderDetails(order)}
                            className="rounded-xl bg-slate-100 hover:bg-slate-200 p-2 text-slate-700 hover:text-slate-900 transition-colors border border-slate-200"
                            title="View Order Breakdown"
                          >
                            <Eye className="h-4 w-4" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {activeTab === 'coupons' && (
          <div className="mt-6 space-y-6">
            {/* Top Metric Cards */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div className="rounded-3xl bg-white p-5 border-2 border-slate-900/10 shadow-[4px_4px_0px_#0F172A]">
                <span className="text-xs text-slate-500 font-semibold uppercase font-mono">Total Coupons</span>
                <p className="mt-2 font-display text-3xl font-black text-slate-900">
                  {coupons.length}
                </p>
                <span className="text-[10px] text-slate-400 font-mono">Vault Stored</span>
              </div>

              <div className="rounded-3xl bg-white p-5 border-2 border-slate-900/10 shadow-[4px_4px_0px_#0F172A]">
                <span className="text-xs text-slate-500 font-semibold uppercase font-mono">Active Vouchers</span>
                <p className="mt-2 font-display text-3xl font-black text-emerald-600">
                  {coupons.filter((c) => c.isActive && new Date(c.expiryDate || '') >= new Date()).length}
                </p>
                <span className="text-[10px] text-emerald-600 font-mono">Live & Valid</span>
              </div>

              <div className="rounded-3xl bg-white p-5 border-2 border-slate-900/10 shadow-[4px_4px_0px_#0F172A]">
                <span className="text-xs text-slate-500 font-semibold uppercase font-mono">Expired Codes</span>
                <p className="mt-2 font-display text-3xl font-black text-rose-500">
                  {coupons.filter((c) => new Date(c.expiryDate || '') < new Date()).length}
                </p>
                <span className="text-[10px] text-rose-500 font-mono">Needs Archive</span>
              </div>

              <div className="rounded-3xl bg-white p-5 border-2 border-slate-900/10 shadow-[4px_4px_0px_#0F172A]">
                <span className="text-xs text-slate-500 font-semibold uppercase font-mono">Total Redemptions</span>
                <p className="mt-2 font-display text-3xl font-black text-[#FF5722]">
                  {coupons.reduce((sum, c) => sum + (c.timesUsed || 0), 0)}
                </p>
                <span className="text-[10px] text-slate-400 font-mono">Customer Uses</span>
              </div>
            </div>

            {/* Main Form & Matrix Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
              {/* Left Column: Create Coupon Form */}
              <div className="lg:col-span-5 rounded-3xl bg-white p-5 sm:p-6 border-2 border-slate-900/10 shadow-[4px_4px_0px_#0F172A]">
                <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-100">
                  <div>
                    <h3 className="font-display text-base font-black text-slate-900 uppercase">
                      Create Atelier Coupon
                    </h3>
                    <p className="text-xs text-slate-500 font-medium">
                      Deploy discount codes to MongoDB Atlas
                    </p>
                  </div>
                  <span className="rounded-md bg-slate-900 text-[#D4FF00] px-2 py-0.5 text-[10px] font-mono font-black uppercase">
                    VAULT MINT
                  </span>
                </div>

                <form onSubmit={handleCreateCoupon} className="space-y-4">
                  {couponFormError && (
                    <div className="rounded-xl bg-rose-50 p-3 text-xs text-rose-700 font-bold border border-rose-200">
                      {couponFormError}
                    </div>
                  )}

                  {couponFormSuccess && (
                    <div className="rounded-xl bg-emerald-50 p-3 text-xs text-emerald-800 font-bold border border-emerald-200">
                      {couponFormSuccess}
                    </div>
                  )}

                  <div>
                    <label className="block text-[11px] font-mono uppercase font-bold text-slate-700 mb-1">
                      Coupon Code *
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. TOON25, VIPDRIP, FREESHIP"
                      value={couponCode}
                      onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                      className="w-full rounded-xl bg-slate-50 px-3.5 py-2.5 text-xs font-mono font-bold text-slate-900 border border-slate-200 uppercase focus:border-[#FF5722] focus:outline-none"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-mono uppercase font-bold text-slate-700 mb-1">
                      Discount Type *
                    </label>
                    <div className="grid grid-cols-3 gap-2">
                      <button
                        type="button"
                        onClick={() => setDiscountType('percent')}
                        className={`rounded-xl py-2 text-xs font-bold transition-all cursor-pointer ${
                          discountType === 'percent'
                            ? 'bg-slate-900 text-white font-black'
                            : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                        }`}
                      >
                        Percent (%)
                      </button>
                      <button
                        type="button"
                        onClick={() => setDiscountType('fixed')}
                        className={`rounded-xl py-2 text-xs font-bold transition-all cursor-pointer ${
                          discountType === 'fixed'
                            ? 'bg-slate-900 text-white font-black'
                            : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                        }`}
                      >
                        Fixed ($)
                      </button>
                      <button
                        type="button"
                        onClick={() => setDiscountType('freeship')}
                        className={`rounded-xl py-2 text-xs font-bold transition-all cursor-pointer ${
                          discountType === 'freeship'
                            ? 'bg-slate-900 text-white font-black'
                            : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                        }`}
                      >
                        Free Ship
                      </button>
                    </div>
                  </div>

                  {discountType !== 'freeship' && (
                    <div>
                      <label className="block text-[11px] font-mono uppercase font-bold text-slate-700 mb-1">
                        {discountType === 'percent' ? 'Discount Percentage (%)' : 'Fixed Discount Amount ($)'} *
                      </label>
                      <input
                        type="number"
                        min="1"
                        max={discountType === 'percent' ? '100' : '1000'}
                        value={discountValue}
                        onChange={(e) => setDiscountValue(e.target.value)}
                        className="w-full rounded-xl bg-slate-50 px-3.5 py-2.5 text-xs font-bold text-slate-900 border border-slate-200 focus:border-[#FF5722] focus:outline-none"
                        required
                      />
                    </div>
                  )}

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] font-mono uppercase font-bold text-slate-700 mb-1">
                        Min. Order ($)
                      </label>
                      <input
                        type="number"
                        min="0"
                        value={minOrderValue}
                        onChange={(e) => setMinOrderValue(e.target.value)}
                        className="w-full rounded-xl bg-slate-50 px-3.5 py-2.5 text-xs font-bold text-slate-900 border border-slate-200 focus:border-[#FF5722] focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-mono uppercase font-bold text-slate-700 mb-1">
                        Usage Limit (0=∞)
                      </label>
                      <input
                        type="number"
                        min="0"
                        value={usageLimit}
                        onChange={(e) => setUsageLimit(e.target.value)}
                        className="w-full rounded-xl bg-slate-50 px-3.5 py-2.5 text-xs font-bold text-slate-900 border border-slate-200 focus:border-[#FF5722] focus:outline-none"
                      />
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <label className="block text-[11px] font-mono uppercase font-bold text-slate-700">
                        Expiration Date *
                      </label>
                      <div className="flex items-center gap-1">
                        <button
                          type="button"
                          onClick={() => handleSetQuickExpiry(7)}
                          className="rounded px-1.5 py-0.5 text-[10px] font-mono font-bold bg-slate-100 hover:bg-slate-200 text-slate-700 cursor-pointer"
                        >
                          +7d
                        </button>
                        <button
                          type="button"
                          onClick={() => handleSetQuickExpiry(30)}
                          className="rounded px-1.5 py-0.5 text-[10px] font-mono font-bold bg-slate-100 hover:bg-slate-200 text-slate-700 cursor-pointer"
                        >
                          +30d
                        </button>
                        <button
                          type="button"
                          onClick={() => handleSetQuickExpiry(90)}
                          className="rounded px-1.5 py-0.5 text-[10px] font-mono font-bold bg-slate-100 hover:bg-slate-200 text-slate-700 cursor-pointer"
                        >
                          +90d
                        </button>
                        <button
                          type="button"
                          onClick={() => handleSetQuickExpiry(365)}
                          className="rounded px-1.5 py-0.5 text-[10px] font-mono font-bold bg-slate-100 hover:bg-slate-200 text-slate-700 cursor-pointer"
                        >
                          1yr
                        </button>
                      </div>
                    </div>
                    <input
                      type="date"
                      value={expiryDate}
                      onChange={(e) => setExpiryDate(e.target.value)}
                      className="w-full rounded-xl bg-slate-50 px-3.5 py-2.5 text-xs font-mono font-bold text-slate-900 border border-slate-200 focus:border-[#FF5722] focus:outline-none cursor-pointer"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-mono uppercase font-bold text-slate-700 mb-1">
                      Campaign Description / Notes
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. 20% off for KhanhBro VIP Streetwear Club"
                      value={couponDescription}
                      onChange={(e) => setCouponDescription(e.target.value)}
                      className="w-full rounded-xl bg-slate-50 px-3.5 py-2.5 text-xs text-slate-900 border border-slate-200 focus:border-[#FF5722] focus:outline-none font-medium"
                    />
                  </div>

                  <div className="flex items-center gap-2 pt-1">
                    <input
                      type="checkbox"
                      id="couponIsActive"
                      checked={couponIsActive}
                      onChange={(e) => setCouponIsActive(e.target.checked)}
                      className="h-4 w-4 rounded text-[#FF5722] focus:ring-[#FF5722]"
                    />
                    <label htmlFor="couponIsActive" className="text-xs font-bold text-slate-700 cursor-pointer">
                      Activate immediately in store
                    </label>
                  </div>

                  <button
                    type="submit"
                    className="w-full flex items-center justify-center gap-2 rounded-xl bg-slate-900 hover:bg-[#FF5722] py-3 text-xs font-black text-white shadow-md transition-all cursor-pointer font-mono uppercase tracking-wider"
                  >
                    <Plus className="h-4 w-4" />
                    <span>Deploy Coupon to Vault</span>
                  </button>
                </form>
              </div>

              {/* Right Column: Active & Archived Coupons Matrix */}
              <div className="lg:col-span-7 rounded-3xl bg-white p-5 sm:p-6 border-2 border-slate-900/10 shadow-[4px_4px_0px_#0F172A]">
                <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-100">
                  <div>
                    <h3 className="font-display text-base font-black text-slate-900 uppercase">
                      Coupons Vault Matrix
                    </h3>
                    <p className="text-xs text-slate-500 font-medium">
                      Manage live validity, redemptions, and expiration timers
                    </p>
                  </div>
                  <span className="font-mono text-xs font-bold text-slate-400">
                    {coupons.length} Recorded
                  </span>
                </div>

                {coupons.length === 0 ? (
                  <div className="py-16 text-center text-slate-400">
                    <Tag className="h-10 w-10 mx-auto mb-2 opacity-40" />
                    <p className="font-bold text-xs uppercase font-mono">No Coupons in Vault</p>
                    <p className="text-xs text-slate-400 mt-1">
                      Create your first promotional code using the form.
                    </p>
                  </div>
                ) : (
                  <div className="space-y-3 max-h-[700px] overflow-y-auto pr-1">
                    {coupons.map((c) => {
                      const isExpired = new Date(c.expiryDate || '') < new Date();
                      const expiryDateFormatted = c.expiryDate
                        ? new Date(c.expiryDate).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric',
                          })
                        : 'No Expiry';

                      const diffDays = c.expiryDate
                        ? Math.ceil((new Date(c.expiryDate).getTime() - Date.now()) / (1000 * 60 * 60 * 24))
                        : 999;

                      return (
                        <div
                          key={c._id || c.code}
                          className={`rounded-2xl border p-4 transition-all ${
                            !c.isActive || isExpired
                              ? 'bg-slate-50/80 border-slate-200 opacity-80'
                              : 'bg-white border-slate-200/90 shadow-xs hover:border-slate-300'
                          }`}
                        >
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2.5 border-b border-slate-100">
                            <div className="flex items-center gap-2">
                              <span className="rounded-lg bg-slate-900 text-[#D4FF00] px-3 py-1 font-mono text-xs font-black tracking-wider">
                                {c.code}
                              </span>

                              <button
                                onClick={() => handleCopyCode(c.code)}
                                className="rounded-lg bg-slate-100 hover:bg-slate-200 p-1.5 text-slate-600 hover:text-slate-900 transition-colors cursor-pointer"
                                title="Copy coupon code"
                              >
                                {copiedCode === c.code ? (
                                  <Check className="h-3.5 w-3.5 text-emerald-600" />
                                ) : (
                                  <Copy className="h-3.5 w-3.5" />
                                )}
                              </button>

                              <span
                                className={`rounded-md px-2 py-0.5 text-[10px] font-mono font-bold uppercase ${
                                  c.discountPercent > 0
                                    ? 'bg-[#FF5722]/10 text-[#FF5722] border border-[#FF5722]/20'
                                    : c.fixedDiscount
                                    ? 'bg-[#0096C7]/10 text-[#0096C7] border border-[#0096C7]/20'
                                    : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                                }`}
                              >
                                {c.discountPercent > 0
                                  ? `${c.discountPercent}% OFF`
                                  : c.fixedDiscount
                                  ? `$${c.fixedDiscount} FLAT`
                                  : 'FREE SHIPPING'}
                              </span>
                            </div>

                            <div className="flex items-center gap-2 self-end sm:self-auto">
                              <button
                                onClick={() => c._id && handleToggleCouponActive(c._id, c.isActive ?? true)}
                                className={`flex items-center gap-1 rounded-lg px-2.5 py-1 text-[11px] font-mono font-bold transition-colors cursor-pointer ${
                                  c.isActive
                                    ? 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200'
                                    : 'bg-slate-100 text-slate-500 hover:bg-slate-200 border border-slate-200'
                                }`}
                              >
                                {c.isActive ? 'ACTIVE' : 'DISABLED'}
                              </button>

                              {c._id && (
                                <button
                                  onClick={() => handleDeleteCoupon(c._id!, c.code)}
                                  className="rounded-lg p-1 text-slate-400 hover:bg-rose-50 hover:text-rose-600 transition-colors cursor-pointer"
                                  title="Delete coupon"
                                >
                                  <Trash2 className="h-4 w-4" />
                                </button>
                              )}
                            </div>
                          </div>

                          <div className="mt-2.5 grid grid-cols-2 sm:grid-cols-3 gap-2 text-xs">
                            <div>
                              <span className="text-[10px] font-mono text-slate-400 uppercase font-bold block">
                                Expiration
                              </span>
                              <span
                                className={`font-mono text-[11px] font-bold ${
                                  isExpired
                                    ? 'text-rose-600'
                                    : diffDays <= 3
                                    ? 'text-amber-600'
                                    : 'text-slate-700'
                                }`}
                              >
                                {expiryDateFormatted}
                              </span>
                              <span className="text-[10px] font-mono text-slate-400 block">
                                {isExpired
                                  ? '(Expired)'
                                  : diffDays === 0
                                  ? '(Expires today)'
                                  : `(${diffDays}d left)`}
                              </span>
                            </div>

                            <div>
                              <span className="text-[10px] font-mono text-slate-400 uppercase font-bold block">
                                Threshold
                              </span>
                              <span className="font-mono text-[11px] font-bold text-slate-700">
                                {c.minOrderValue && c.minOrderValue > 0
                                  ? `Min $${c.minOrderValue.toFixed(2)}`
                                  : 'No minimum'}
                              </span>
                            </div>

                            <div>
                              <span className="text-[10px] font-mono text-slate-400 uppercase font-bold block">
                                Redemptions
                              </span>
                              <span className="font-mono text-[11px] font-bold text-slate-700">
                                {c.timesUsed || 0} / {c.usageLimit && c.usageLimit > 0 ? c.usageLimit : '∞'}
                              </span>
                            </div>
                          </div>

                          {c.description && (
                            <p className="mt-2 text-[11px] text-slate-500 font-medium italic">
                              "{c.description}"
                            </p>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>

      {editingProduct && (
        <AdminProductEditModal
          product={editingProduct}
          onClose={() => setEditingProduct(null)}
          onSave={(updated) => {
            setProducts(products.map((p) => (p._id === updated._id ? updated : p)));
          }}
        />
      )}

      {selectedOrderDetails && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="relative w-full max-w-lg rounded-3xl bg-white p-6 border-2 border-slate-900/15 shadow-[8px_8px_0px_#0F172A] text-slate-900">
            <button
              onClick={() => setSelectedOrderDetails(null)}
              className="absolute right-4 top-4 rounded-xl bg-slate-100 p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-200 transition-colors"
            >
              <ArrowLeft className="h-5 w-5" />
            </button>

            <h3 className="font-display text-lg font-black text-slate-900 mb-1">
              Order Details #{selectedOrderDetails.orderNumber}
            </h3>
            <p className="text-xs text-slate-500 mb-4 font-medium">
              Recipient: <strong className="text-slate-900 font-bold">{selectedOrderDetails.customerName}</strong> ({selectedOrderDetails.customerPhone || 'N/A'})
            </p>

            <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
              {selectedOrderDetails.items.map((it, idx) => (
                <div key={idx} className="flex items-center justify-between rounded-2xl bg-slate-50 p-3 border border-slate-200">
                  <div className="flex items-center gap-3">
                    <img src={it.image} alt="" className="h-10 w-10 rounded-xl object-cover bg-white border border-slate-200" />
                    <div>
                      <p className="text-xs font-bold text-slate-900">{it.title}</p>
                      <p className="text-xs text-slate-500 font-mono">
                        Size: {it.size} | Color: {it.color} | Qty: {it.quantity}
                      </p>
                    </div>
                  </div>
                  <span className="font-mono text-xs font-black text-[#FF5722]">
                    ${(it.price * it.quantity).toFixed(2)}
                  </span>
                </div>
              ))}
            </div>

            <div className="mt-4 pt-3 border-t border-slate-200 text-xs space-y-1 text-slate-600">
              <div className="flex justify-between">
                <span>Shipping Address:</span>
                <span className="text-slate-900 font-medium text-right max-w-xs">{selectedOrderDetails.shippingAddress}</span>
              </div>
              <div className="flex justify-between font-bold text-slate-900 text-sm pt-2">
                <span>Total Order Amount:</span>
                <span className="text-[#FF5722] font-display text-base font-black">${selectedOrderDetails.totalAmount.toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
