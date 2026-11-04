import React, { useRef, useState } from 'react';
import {
  ShoppingBag,
  Layers,
  ChevronDown,
  Menu,
  X,
  ArrowRight,
  Shirt,
  Grid,
} from 'lucide-react';
import { useCartStore } from '../../stores/cartStore';
import { useMascotStore } from '../../stores/mascotStore';
import { animateSquashAndStretch } from '../../utils/animations';
import { CartToast } from '../common/CartToast';

interface NavbarProps {
  onOpenWheel: () => void;
  onOpenAdmin: () => void;
  onGoHome?: () => void;
  onSelectCollection?: (collection: string) => void;
}

const ALL_COLLECTIONS = [
  'KhanhBro Signature Drip',
  'Cyber Toon Glitch',
  'Mecha Bot Evolution',
  'Rogue Clan Distressed',
  'Street Ronin Brush',
  'Chibi Harajuku Splash',
  'Pixel Quest 8-Bit',
  'Solar Flare Washed',
  'Synth Wave Sunset',
  'Demon Mask Pop Art',
];

export const Navbar: React.FC<NavbarProps> = ({
  onOpenWheel,
  onOpenAdmin,
  onGoHome,
  onSelectCollection,
}) => {
  const { toggleCart, getItemCount } = useCartStore();
  const { toggleStudio, equipped } = useMascotStore();

  const [isCollectionsOpen, setIsCollectionsOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const cartButtonRef = useRef<HTMLButtonElement>(null);
  const studioButtonRef = useRef<HTMLButtonElement>(null);
  const wheelButtonRef = useRef<HTMLButtonElement>(null);

  const cartCount = getItemCount();
  const equippedCount = Object.values(equipped).filter(Boolean).length;

  const handleCartClick = () => {
    animateSquashAndStretch(cartButtonRef.current, 1.2);
    toggleCart();
  };

  const handleStudioClick = () => {
    animateSquashAndStretch(studioButtonRef.current, 1.15);
    toggleStudio();
  };

  const handleWheelClick = () => {
    animateSquashAndStretch(wheelButtonRef.current, 1.15);
    onOpenWheel();
  };

  return (
    <>
      <header className="sticky top-0 z-40 w-full border-b border-slate-200/80 bg-white/90 backdrop-blur-xl shadow-xs">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-3 sm:px-6 lg:px-8">
          <div className="flex items-center gap-2 sm:gap-6">
            <button
              type="button"
              onClick={() => {
                setIsMobileMenuOpen(false);
                onGoHome?.();
              }}
              className="flex items-center gap-2 group cursor-pointer text-left"
            >
              <div className="flex h-9 w-9 sm:h-10 sm:w-10 items-center justify-center rounded-xl bg-slate-900 text-[#D4FF00] font-black font-mono text-sm tracking-tighter border border-slate-900 shadow-sm transition-transform group-hover:scale-105 flex-shrink-0">
                FW
              </div>
              <div>
                <div className="flex items-center gap-1 sm:gap-1.5">
                  <span className="font-display text-lg sm:text-xl font-black tracking-wider text-slate-900">
                    FASHION<span className="text-[#FF5722]">WEKK</span>
                  </span>
                  <span className="rounded bg-[#FF5722]/10 px-1.5 py-0.5 text-[9px] sm:text-[10px] font-mono uppercase tracking-widest text-[#FF5722] border border-[#FF5722]/25 font-bold">
                    by KhanhBro
                  </span>
                </div>
                <span className="hidden sm:inline-block text-[10px] font-mono uppercase tracking-wider text-slate-500 font-semibold">
                  Cartoon Drip Atelier
                </span>
              </div>
            </button>

            <nav className="hidden md:flex items-center gap-1">
              <button
                onClick={onGoHome}
                className="px-3 py-1.5 rounded-xl text-xs font-bold text-slate-700 hover:text-slate-900 hover:bg-slate-100 transition-colors cursor-pointer"
              >
                Drops
              </button>

              <div className="relative">
                <button
                  onClick={() => setIsCollectionsOpen(!isCollectionsOpen)}
                  className="flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-bold text-slate-700 hover:text-slate-900 hover:bg-slate-100 transition-colors cursor-pointer"
                >
                  <Layers className="h-3.5 w-3.5 text-[#0096C7]" />
                  <span>Collections</span>
                  <ChevronDown className="h-3 w-3 text-slate-400" />
                </button>

                {isCollectionsOpen && (
                  <div
                    onMouseLeave={() => setIsCollectionsOpen(false)}
                    className="absolute left-0 mt-1 w-64 rounded-2xl bg-white p-2 shadow-2xl border-2 border-slate-900/10 z-50 animate-in fade-in slide-in-from-top-2 duration-150 max-h-[80vh] overflow-y-auto"
                  >
                    <div className="px-3 py-1.5 text-[10px] font-mono font-bold text-slate-400 uppercase tracking-wider border-b border-slate-100 mb-1">
                      10 Atelier Capsules
                    </div>
                    {ALL_COLLECTIONS.map((col) => (
                      <button
                        key={col}
                        onClick={() => {
                          setIsCollectionsOpen(false);
                          onSelectCollection?.(col);
                        }}
                        className="w-full text-left rounded-xl px-3 py-2 text-xs font-bold text-slate-700 hover:bg-[#FF5722]/10 hover:text-[#FF5722] transition-colors cursor-pointer flex items-center justify-between group"
                      >
                        <span>{col}</span>
                        <ArrowRight className="h-3 w-3 opacity-0 group-hover:opacity-100 transition-opacity text-[#FF5722]" />
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </nav>
          </div>

          <div className="flex items-center gap-1.5 sm:gap-3">
            <button
              ref={wheelButtonRef}
              onClick={handleWheelClick}
              className="flex items-center gap-1 rounded-xl bg-slate-100 hover:bg-[#D4FF00] hover:text-black px-2.5 sm:px-3.5 py-2 text-xs font-black text-slate-800 border border-slate-200 transition-all cursor-pointer font-mono uppercase tracking-wider"
              title="Lucky Wheel"
              aria-label="Spin Lucky Wheel"
            >
              <span>WHEEL -20%</span>
            </button>

            <button
              ref={studioButtonRef}
              onClick={handleStudioClick}
              className="flex items-center gap-1.5 rounded-xl bg-slate-100 hover:bg-[#D4FF00] hover:text-black px-2.5 sm:px-3.5 py-2 text-xs font-bold text-slate-800 border border-slate-200 transition-all shadow-xs group cursor-pointer"
              title="Fit Studio"
              aria-label="Open Fit Studio"
            >
              <Shirt className="h-3.5 w-3.5 text-slate-600 group-hover:text-black transition-colors" />
              <span className="hidden sm:inline">Fit Studio</span>
              {equippedCount > 0 && (
                <span className="rounded-full bg-[#FF5722] px-1.5 py-0.2 text-[10px] font-black text-white">
                  {equippedCount}
                </span>
              )}
            </button>

            <button
              onClick={onOpenAdmin}
              className="hidden sm:flex items-center gap-1 rounded-xl bg-slate-100 px-3 py-2 text-xs font-bold text-slate-700 hover:text-slate-900 hover:bg-slate-200 border border-slate-200 transition-all cursor-pointer font-mono uppercase text-[11px] tracking-wider"
              title="Database Command Center"
            >
              <span className="hidden xl:inline">Admin Vault</span>
              <span className="xl:hidden">Admin</span>
            </button>

            <button
              id="navbar-cart-button"
              ref={cartButtonRef}
              onClick={handleCartClick}
              className="relative flex items-center justify-center rounded-xl bg-[#FF5722] hover:bg-[#FF6E40] p-2 sm:p-2.5 text-white shadow-md shadow-[#FF5722]/30 transition-all cursor-pointer"
              aria-label="View bag"
            >
              <ShoppingBag className="h-4 w-4 sm:h-5 sm:w-5" />
              {cartCount > 0 && (
                <span className="absolute -top-1.5 -right-1.5 flex h-4 w-4 sm:h-5 sm:w-5 items-center justify-center rounded-full bg-[#0096C7] font-mono text-[9px] sm:text-[10px] font-black text-white border-2 border-white shadow-xs">
                  {cartCount}
                </span>
              )}
            </button>

            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden rounded-xl bg-slate-100 p-2 text-slate-700 hover:text-slate-900 border border-slate-200 cursor-pointer"
              aria-label="Toggle menu"
            >
              {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>

        {isMobileMenuOpen && (
          <div className="md:hidden border-t border-slate-200 bg-white p-4 shadow-xl animate-in slide-in-from-top-4 duration-200 max-h-[85vh] overflow-y-auto">
            <div className="space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <span className="font-mono text-xs font-bold uppercase tracking-wider text-slate-400">
                  Navigation
                </span>
                <span className="text-[11px] font-bold text-[#FF5722]">100 Drops Vault</span>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => {
                    setIsMobileMenuOpen(false);
                    onGoHome?.();
                  }}
                  className="flex items-center justify-center gap-2 rounded-xl bg-slate-100 p-3 text-xs font-bold text-slate-900 hover:bg-[#FF5722] hover:text-white transition-colors cursor-pointer"
                >
                  All Drops (100)
                </button>

                <button
                  onClick={() => {
                    setIsMobileMenuOpen(false);
                    onOpenWheel();
                  }}
                  className="flex items-center justify-center gap-2 rounded-xl bg-amber-50 p-3 text-xs font-bold text-amber-900 hover:bg-amber-100 transition-colors cursor-pointer"
                >
                  Spin Wheel (-20%)
                </button>

                <button
                  onClick={() => {
                    setIsMobileMenuOpen(false);
                    toggleStudio();
                  }}
                  className="flex items-center justify-center gap-2 rounded-xl bg-slate-100 p-3 text-xs font-bold text-slate-900 hover:bg-[#D4FF00] hover:text-black transition-colors cursor-pointer"
                >
                  Mascot Studio
                </button>

                <button
                  onClick={() => {
                    setIsMobileMenuOpen(false);
                    onOpenAdmin();
                  }}
                  className="flex items-center justify-center gap-2 rounded-xl bg-slate-100 p-3 text-xs font-bold text-slate-900 hover:bg-slate-200 transition-colors cursor-pointer"
                >
                  Admin Vault
                </button>
              </div>

              <div className="pt-2">
                <div className="text-xs font-mono font-bold uppercase tracking-wider text-slate-400 mb-2">
                  Atelier Capsules
                </div>
                <div className="space-y-1">
                  {ALL_COLLECTIONS.map((col) => (
                    <button
                      key={col}
                      onClick={() => {
                        setIsMobileMenuOpen(false);
                        onSelectCollection?.(col);
                      }}
                      className="w-full text-left rounded-xl px-3 py-2 text-xs font-bold text-slate-700 hover:bg-[#FF5722]/10 hover:text-[#FF5722] transition-colors flex items-center justify-between"
                    >
                      <span>{col}</span>
                      <ArrowRight className="h-3 w-3 text-slate-400" />
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        <CartToast />
      </header>

      {/* Mobile Bottom Navigation Bar (app-like experience on screens under 768px) */}
      <nav
        aria-label="Mobile Navigation"
        className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-lg border-t border-slate-200/90 safe-area-bottom shadow-[0_-4px_16px_rgba(0,0,0,0.06)]"
      >
        <div className="grid grid-cols-4 h-14 max-w-md mx-auto">
          <button
            onClick={onGoHome}
            className="flex flex-col items-center justify-center gap-1 text-slate-700 hover:text-[#FF5722] transition-colors cursor-pointer"
          >
            <Grid className="h-4 w-4" />
            <span className="text-[10px] font-bold">Drops</span>
          </button>

          <button
            onClick={() => setIsMobileMenuOpen(true)}
            className="flex flex-col items-center justify-center gap-1 text-slate-700 hover:text-[#0096C7] transition-colors cursor-pointer"
          >
            <Layers className="h-4 w-4" />
            <span className="text-[10px] font-bold">Capsules</span>
          </button>

          <button
            onClick={toggleStudio}
            className="relative flex flex-col items-center justify-center gap-1 text-slate-700 hover:text-[#0096C7] transition-colors cursor-pointer"
          >
            <Shirt className="h-4 w-4" />
            <span className="text-[10px] font-bold">Fit Studio</span>
            {equippedCount > 0 && (
              <span className="absolute top-1 right-5 flex h-3.5 w-3.5 items-center justify-center rounded-full bg-[#FF5722] text-[8px] font-black text-white">
                {equippedCount}
              </span>
            )}
          </button>

          <button
            onClick={toggleCart}
            className="relative flex flex-col items-center justify-center gap-1 text-slate-700 hover:text-[#FF5722] transition-colors cursor-pointer"
          >
            <ShoppingBag className="h-4 w-4" />
            <span className="text-[10px] font-bold">Bag</span>
            {cartCount > 0 && (
              <span className="absolute top-1 right-5 flex h-3.5 w-3.5 items-center justify-center rounded-full bg-[#0096C7] text-[8px] font-black text-white">
                {cartCount}
              </span>
            )}
          </button>
        </div>
      </nav>
    </>
  );
};
