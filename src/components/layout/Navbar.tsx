import React, { useRef, useState } from 'react';
import {
  ShoppingBag,
  Layers,
  ChevronDown,
  ArrowRight,
  Shirt,
  Sparkles,
  Sun,
  Moon,
  Palette,
} from 'lucide-react';
import { useCartStore } from '../../stores/cartStore';
import { useMascotStore } from '../../stores/mascotStore';
import { useThemeStore } from '../../stores/themeStore';
import { useSoundFx } from '../../hooks/useSoundFx';
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
  const { mode, toggleMode, openCustomizer } = useThemeStore();
  const { playPop } = useSoundFx();

  const [isCollectionsOpen, setIsCollectionsOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const cartButtonRef = useRef<HTMLButtonElement>(null);
  const shopAllBtnRef = useRef<HTMLButtonElement>(null);
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

  const handleModeToggle = () => {
    toggleMode();
    playPop();
  };

  return (
    <>
      <header className="sticky top-0 z-40 w-full border-b border-[#0A0A0C]/20 dark:border-white/15 bg-white/95 dark:bg-[#0A0D14]/95 backdrop-blur-xl shadow-xs transition-colors">
        {/* Neon Lime Accent Line on top rim matching Dribbble reference */}
        <div className="h-[3px] w-full bg-[#D4FF00]" />

        <div className="mx-auto flex h-14 max-w-7xl items-center justify-between px-3 sm:px-6 lg:px-8">
          {/* Left: FashionWekk Brand Logo matching Favicon */}
          <div className="flex items-center gap-2 sm:gap-6">
            <button
              type="button"
              onClick={() => {
                setIsMobileMenuOpen(false);
                onGoHome?.();
              }}
              className="flex items-center gap-2.5 group cursor-pointer text-left"
            >
              {/* Favicon Match Badge */}
              <div className="flex h-8 w-8 sm:h-9 sm:w-9 items-center justify-center rounded-xl bg-[#0A0A0C] text-[#D4FF00] font-black font-mono text-sm tracking-tighter border border-[#0A0A0C] dark:border-white/20 shadow-sm transition-transform group-hover:scale-105 flex-shrink-0">
                FW
              </div>
              <div className="flex items-baseline gap-1.5">
                <span className="font-display text-base sm:text-lg font-black tracking-tight uppercase text-[#0A0A0C] dark:text-white">
                  FASHION<span className="text-[#FF5722]">WEKK</span>
                </span>
                <span className="text-[10px] font-mono uppercase tracking-widest text-slate-500 dark:text-slate-400 font-bold hidden sm:inline">
                  // ATELIER
                </span>
              </div>
            </button>
          </div>

          {/* Center Navigation Links */}
          <nav className="hidden lg:flex items-center gap-6 text-[11px] font-mono font-bold tracking-widest uppercase text-slate-700 dark:text-slate-300">
            <button
              onClick={onGoHome}
              className="hover:text-[#0A0A0C] dark:hover:text-white hover:underline underline-offset-4 transition-colors cursor-pointer"
            >
              NEW COLLECTION
            </button>

            <div className="relative">
              <button
                onClick={() => setIsCollectionsOpen(!isCollectionsOpen)}
                className="flex items-center gap-1 hover:text-[#0A0A0C] dark:hover:text-white transition-colors cursor-pointer"
              >
                <span>CATALOG</span>
                <ChevronDown className="h-3 w-3 text-slate-400" />
              </button>

              {isCollectionsOpen && (
                <div
                  onMouseLeave={() => setIsCollectionsOpen(false)}
                  className="absolute left-0 mt-2 w-64 rounded-xl bg-white dark:bg-[#0E121B] p-2 shadow-2xl border-2 border-[#0A0A0C] dark:border-white/20 z-50 animate-in fade-in slide-in-from-top-2 duration-150 max-h-[75vh] overflow-y-auto"
                >
                  <div className="px-3 py-1.5 text-[10px] font-mono font-bold text-slate-400 uppercase tracking-wider border-b border-slate-100 dark:border-slate-800 mb-1">
                    10 Atelier Capsules
                  </div>
                  {ALL_COLLECTIONS.map((col) => (
                    <button
                      key={col}
                      onClick={() => {
                        setIsCollectionsOpen(false);
                        onSelectCollection?.(col);
                      }}
                      className="w-full text-left rounded-lg px-3 py-2 text-xs font-bold text-slate-700 dark:text-slate-300 hover:bg-[#D4FF00] hover:text-black transition-colors cursor-pointer flex items-center justify-between group"
                    >
                      <span>{col}</span>
                      <ArrowRight className="h-3 w-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </button>
                  ))}
                </div>
              )}
            </div>

            <button
              onClick={handleStudioClick}
              className="hover:text-[#0A0A0C] dark:hover:text-white hover:underline underline-offset-4 transition-colors cursor-pointer flex items-center gap-1"
            >
              <span>FIT STUDIO</span>
              {equippedCount > 0 && (
                <span className="rounded-full bg-[#FF5722] px-1.5 py-0.2 text-[9px] font-black text-white">
                  {equippedCount}
                </span>
              )}
            </button>

            <button
              onClick={handleWheelClick}
              className="hover:text-[#0A0A0C] dark:hover:text-white hover:underline underline-offset-4 transition-colors cursor-pointer text-[#FF5722]"
            >
              SPIN -20%
            </button>

            <button
              onClick={onOpenAdmin}
              className="hover:text-[#0A0A0C] dark:hover:text-white hover:underline underline-offset-4 transition-colors cursor-pointer"
            >
              VAULT
            </button>
          </nav>

          {/* Right Controls: Theme Customizer, Mode Switcher, Cart & Action Button */}
          <div className="flex items-center gap-1.5 sm:gap-2.5">
            {/* Quick Dark/Light Mode Toggle */}
            <button
              id="theme-toggle-btn"
              type="button"
              onClick={handleModeToggle}
              title={mode === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
              aria-label="Toggle theme mode"
              className="flex h-8 w-8 sm:h-9 sm:w-9 items-center justify-center rounded-lg bg-slate-100 dark:bg-[#141A26] text-slate-800 dark:text-[#D4FF00] border border-slate-300 dark:border-white/20 hover:border-black transition-colors cursor-pointer"
            >
              {mode === 'dark' ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            </button>

            {/* Gradient Atmosphere Customizer Modal Trigger */}
            <button
              id="theme-customizer-btn"
              type="button"
              onClick={openCustomizer}
              title="Open Horizon Gradient Customizer"
              aria-label="Open gradient customizer"
              className="flex h-8 w-8 sm:h-9 sm:w-9 items-center justify-center rounded-lg bg-slate-100 dark:bg-[#141A26] text-slate-800 dark:text-white border border-slate-300 dark:border-white/20 hover:bg-[#D4FF00] hover:text-black hover:border-black transition-colors cursor-pointer"
            >
              <Palette className="h-4 w-4" />
            </button>

            {/* Cart Status */}
            <button
              id="navbar-cart-button"
              ref={cartButtonRef}
              onClick={handleCartClick}
              className="px-2.5 sm:px-3 py-1.5 text-[11px] sm:text-xs font-mono font-bold uppercase tracking-wider text-[#0A0A0C] dark:text-white hover:bg-slate-100 dark:hover:bg-[#141A26] rounded-lg transition-colors cursor-pointer border border-transparent hover:border-slate-300 dark:hover:border-white/20"
              aria-label="View bag"
            >
              CART ({cartCount})
            </button>

            {/* Inverted Black / Lime Action Button */}
            <button
              ref={shopAllBtnRef}
              onClick={() => {
                onGoHome?.();
                const drops = document.getElementById('drops-main-section');
                if (drops) drops.scrollIntoView({ behavior: 'smooth' });
              }}
              className="flex items-center justify-center rounded-none bg-[#0A0A0C] hover:bg-[#D4FF00] hover:text-[#0A0A0C] dark:bg-[#D4FF00] dark:text-black dark:hover:bg-white px-3 sm:px-5 py-2 sm:py-2.5 text-[10px] sm:text-xs font-mono font-black tracking-widest uppercase text-white transition-all cursor-pointer border border-[#0A0A0C] dark:border-[#D4FF00] shadow-xs active:translate-y-0.5"
            >
              SHOP ALL
            </button>
          </div>
        </div>
      </header>

      <CartToast />
    </>
  );
};
