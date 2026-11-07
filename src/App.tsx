import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Product } from './types';
import { Navbar } from './components/layout/Navbar';
import { FlashSaleBanner } from './components/layout/FlashSaleBanner';
import { HeroSection } from './components/layout/HeroSection';
import { Footer } from './components/layout/Footer';
import { ProductFilter } from './features/products/ProductFilter';
import { ProductList } from './features/products/ProductList';
import { Pagination } from './features/products/Pagination';
import { CollectionBanner } from './features/collections/CollectionBanner';
import { CollectionPage } from './features/collections/CollectionPage';
import { ProductDetailPage } from './features/products/ProductDetailPage';
import { CartDrawer } from './features/cart/CartDrawer';
import { MascotDressUpDrawer } from './features/mascot/MascotDressUpDrawer';
import { MysteryWheelModal } from './features/gamification/MysteryWheelModal';
import { ThemeCustomizerModal } from './components/common/ThemeCustomizerModal';
import { AdminDashboard } from './features/admin/AdminDashboard';
import { animateStaggeredReveal } from './utils/animations';
import { useThemeStore, applyThemeToDOM } from './stores/themeStore';
import { preloadCollectionImages } from './utils/imageOptimizer';

type ViewMode = 'home' | 'product' | 'collection' | 'admin';

export const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<ViewMode>('home');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [selectedCollectionName, setSelectedCollectionName] = useState<string>('KhanhBro Signature Drip');

  const [products, setProducts] = useState<Product[]>([]);
  const [allProductsCatalog, setAllProductsCatalog] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(12);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);

  const [category, setCategory] = useState('all');
  const [collection, setCollection] = useState('all');
  const [season, setSeason] = useState('all');
  const [mascotSlot, setMascotSlot] = useState('all');
  const [search, setSearch] = useState('');
  const [flashSale, setFlashSale] = useState(false);
  const [sortBy, setSortBy] = useState('featured');
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid');

  const [isWheelOpen, setIsWheelOpen] = useState(false);

  const dropsSectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const { mode, gradientId } = useThemeStore.getState();
    applyThemeToDOM(mode, gradientId);
  }, []);

  useEffect(() => {
    if (dropsSectionRef.current && currentView === 'home') {
      animateStaggeredReveal('.product-reveal-item', dropsSectionRef.current);
    }
  }, [products, currentView]);

  const fetchCatalogAll = async () => {
    try {
      const res = await fetch('/api/products?limit=200');
      const data = await res.json();
      if (data.success && Array.isArray(data.data)) {
        setAllProductsCatalog(data.data);
        if (typeof window !== 'undefined' && 'requestIdleCallback' in window) {
          window.requestIdleCallback(() => {
            const leadImages = data.data.slice(0, 8).map((p: Product) => p.images[0]);
            preloadCollectionImages(leadImages, 8);
          });
        } else {
          setTimeout(() => {
            const leadImages = data.data.slice(0, 8).map((p: Product) => p.images[0]);
            preloadCollectionImages(leadImages, 8);
          }, 1000);
        }
      }
    } catch (err) {
      console.error('Failed to preload catalog', err);
    }
  };

  const fetchProductById = async (id: string): Promise<Product | null> => {
    try {
      const res = await fetch(`/api/products/${id}`);
      const data = await res.json();
      if (data.success && data.data) {
        return data.data;
      }
    } catch (err) {
      console.error('Failed to fetch product by id', err);
    }
    return null;
  };

  const syncStateFromUrl = useCallback(async () => {
    const params = new URLSearchParams(window.location.search);
    const viewParam = params.get('view');
    const productId = params.get('product');
    const collectionParam = params.get('collection');

    if (viewParam === 'admin') {
      setCurrentView('admin');
      return;
    }

    if (productId) {
      let found = allProductsCatalog.find((p) => p._id === productId);
      if (!found) {
        found = products.find((p) => p._id === productId);
      }
      if (!found) {
        found = (await fetchProductById(productId)) || undefined;
      }
      if (found) {
        setSelectedProduct(found);
        setCurrentView('product');
        return;
      }
    }

    if (collectionParam) {
      setSelectedCollectionName(collectionParam);
      setCurrentView('collection');
      return;
    }

    setCurrentView('home');
    setSelectedProduct(null);
  }, [allProductsCatalog, products]);

  useEffect(() => {
    fetchCatalogAll();
  }, []);

  useEffect(() => {
    syncStateFromUrl();
  }, [syncStateFromUrl]);

  useEffect(() => {
    const handlePopState = () => {
      syncStateFromUrl();
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, [syncStateFromUrl]);

  const navigateToHome = () => {
    const url = new URL(window.location.href);
    url.searchParams.delete('product');
    url.searchParams.delete('collection');
    url.searchParams.delete('view');
    window.history.pushState({}, '', url.pathname + (url.search ? url.search : ''));
    setCurrentView('home');
    setSelectedProduct(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const navigateToProduct = (product: Product) => {
    const url = new URL(window.location.href);
    url.searchParams.set('product', product._id);
    url.searchParams.delete('collection');
    url.searchParams.delete('view');
    window.history.pushState({}, '', url.pathname + url.search);
    setSelectedProduct(product);
    setCurrentView('product');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const navigateToCollection = (collectionName: string) => {
    const url = new URL(window.location.href);
    url.searchParams.set('collection', collectionName);
    url.searchParams.delete('product');
    url.searchParams.delete('view');
    window.history.pushState({}, '', url.pathname + url.search);
    setSelectedCollectionName(collectionName);
    setCurrentView('collection');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const navigateToAdmin = () => {
    const url = new URL(window.location.href);
    url.searchParams.set('view', 'admin');
    url.searchParams.delete('product');
    url.searchParams.delete('collection');
    window.history.pushState({}, '', url.pathname + url.search);
    setCurrentView('admin');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (category !== 'all') params.append('category', category);
      if (collection !== 'all') params.append('collection', collection);
      if (season !== 'all') params.append('season', season);
      if (mascotSlot !== 'all') params.append('mascotSlot', mascotSlot);
      if (search) params.append('search', search);
      if (flashSale) params.append('flashSale', 'true');

      if (sortBy === 'price-asc') {
        params.append('sortBy', 'price');
        params.append('order', 'asc');
      } else if (sortBy === 'price-desc') {
        params.append('sortBy', 'price');
        params.append('order', 'desc');
      } else if (sortBy === 'gsm-desc') {
        params.append('sortBy', 'gsm');
        params.append('order', 'desc');
      } else if (sortBy === 'rating-desc') {
        params.append('sortBy', 'rating');
        params.append('order', 'desc');
      } else {
        params.append('sortBy', 'featured');
      }

      params.append('page', String(currentPage));
      params.append('limit', String(itemsPerPage));

      const res = await fetch(`/api/products?${params.toString()}`);
      const data = await res.json();
      if (data.success) {
        setProducts(data.data);
        setTotalPages(data.totalPages || 1);
        setTotalItems(data.total || data.data.length);
      }
    } catch (err) {
      console.error('Failed to fetch products', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setCurrentPage(1);
  }, [category, collection, season, mascotSlot, search, flashSale, sortBy, itemsPerPage]);

  useEffect(() => {
    fetchProducts();
  }, [category, collection, season, mascotSlot, search, flashSale, sortBy, currentPage, itemsPerPage]);

  const handleResetFilters = () => {
    setCategory('all');
    setCollection('all');
    setSeason('all');
    setMascotSlot('all');
    setSearch('');
    setFlashSale(false);
    setSortBy('featured');
    setCurrentPage(1);
  };

  const handleScrollToDrops = () => {
    dropsSectionRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  if (currentView === 'admin') {
    return <AdminDashboard onBackToStore={navigateToHome} />;
  }

  return (
    <div className="min-h-screen text-[#0A0A0C] dark:text-white flex flex-col font-sans selection:bg-[#D4FF00] selection:text-black">
      <FlashSaleBanner />

      <Navbar
        onOpenWheel={() => setIsWheelOpen(true)}
        onOpenAdmin={navigateToAdmin}
        onGoHome={navigateToHome}
        onSelectCollection={navigateToCollection}
      />

      {currentView === 'product' && selectedProduct && (
        <ProductDetailPage
          product={selectedProduct}
          allProducts={allProductsCatalog.length > 0 ? allProductsCatalog : products}
          onBack={navigateToHome}
          onSelectProduct={navigateToProduct}
          onSelectCollection={navigateToCollection}
        />
      )}

      {currentView === 'collection' && (
        <CollectionPage
          collectionName={selectedCollectionName}
          allProducts={allProductsCatalog.length > 0 ? allProductsCatalog : products}
          onBack={navigateToHome}
          onSelectProduct={navigateToProduct}
          onSelectCollection={navigateToCollection}
        />
      )}

      {currentView === 'home' && (
        <>
          <HeroSection
            onExploreDrops={handleScrollToDrops}
            onOpenWheel={() => setIsWheelOpen(true)}
          />

          <main
            ref={dropsSectionRef}
            id="drops-main-section"
            className="mx-auto max-w-7xl px-3 sm:px-6 lg:px-8 py-6 sm:py-8 pb-28 sm:pb-8 flex-1 w-full"
          >
            <CollectionBanner
              collection={collection}
              onClear={() => setCollection('all')}
              onExploreCollection={navigateToCollection}
            />

            <div className="flex flex-col sm:flex-row items-baseline justify-between gap-2 border-b border-[#0A0A0C]/15 pb-4 mb-6">
              <div>
                <h2 className="font-display text-2xl sm:text-3xl font-black italic tracking-tight uppercase text-[#0A0A0C]">
                  CURATED <span className="underline decoration-[#D4FF00] decoration-4">CARTOON DROPS</span>
                </h2>
                <p className="mt-1 text-xs text-slate-600 font-mono font-medium">
                  Exclusive {totalItems} heavyweight 350-500 GSM cartoon pop-art collector drops • Directed by KhanhBro
                </p>
              </div>
            </div>

            <ProductFilter
              category={category}
              onSelectCategory={setCategory}
              collection={collection}
              onSelectCollection={setCollection}
              season={season}
              onSelectSeason={setSeason}
              mascotSlot={mascotSlot}
              onSelectMascotSlot={setMascotSlot}
              search={search}
              onSearchChange={setSearch}
              flashSale={flashSale}
              onToggleFlashSale={() => setFlashSale(!flashSale)}
              sortBy={sortBy}
              onSortChange={setSortBy}
              viewMode={viewMode}
              onViewModeChange={setViewMode}
              onReset={handleResetFilters}
            />

            <ProductList
              products={products}
              loading={loading}
              viewMode={viewMode}
              onOpenModal={navigateToProduct}
              onSelectCollection={navigateToCollection}
              onResetFilters={handleResetFilters}
            />

            {!loading && products.length > 0 && (
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                totalItems={totalItems}
                itemsPerPage={itemsPerPage}
                onPageChange={(p) => {
                  setCurrentPage(p);
                  handleScrollToDrops();
                }}
                onItemsPerPageChange={setItemsPerPage}
              />
            )}
          </main>
        </>
      )}

      <CartDrawer />
      <MascotDressUpDrawer />
      <MysteryWheelModal
        isOpen={isWheelOpen}
        onClose={() => setIsWheelOpen(false)}
      />
      <ThemeCustomizerModal />

      <Footer />
    </div>
  );
};

export default App;
