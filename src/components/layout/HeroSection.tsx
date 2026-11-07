import React, { useEffect, useRef, useState } from 'react';
import {
  ArrowRight,
  Star,
  Check,
  ShoppingBag,
  ChevronUp,
  ChevronDown,
  Sparkles,
} from 'lucide-react';
import { useMascotStore } from '../../stores/mascotStore';
import { useCartStore } from '../../stores/cartStore';
import { useSoundFx } from '../../hooks/useSoundFx';
import {
  gsap,
  animateSplatterBurst,
  animateSquashAndStretch,
  animateFlyToCart,
} from '../../utils/animations';
import { getOptimizedImageUrl } from '../../utils/imageOptimizer';

interface HeroSectionProps {
  onExploreDrops: () => void;
  onOpenWheel: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  onExploreDrops,
  onOpenWheel,
}) => {
  const { openStudio } = useMascotStore();
  const { addItem } = useCartStore();
  const { playPop } = useSoundFx();

  const [quantity, setQuantity] = useState(1);
  const [selectedColorway, setSelectedColorway] = useState('METALLIC ONYX');
  const [selectedSize, setSelectedSize] = useState('L');
  const [isHeroAdded, setIsHeroAdded] = useState(false);

  const [openAccordion, setOpenAccordion] = useState<{
    materials: boolean;
    description: boolean;
  }>({
    materials: true,
    description: true,
  });

  const heroContainerRef = useRef<HTMLDivElement>(null);
  const showcaseRef = useRef<HTMLDivElement>(null);
  const heroAddBtnRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        showcaseRef.current,
        { opacity: 0, y: 30, scale: 0.98 },
        { opacity: 1, y: 0, scale: 1, duration: 0.9, ease: 'power3.out' }
      );
    });

    return () => ctx.revert();
  }, []);

  const handleHeroSplatter = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    animateSplatterBurst(e.currentTarget, x, y);
  };

  const handleHeroQuickAdd = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    if (heroAddBtnRef.current) {
      animateSquashAndStretch(heroAddBtnRef.current, 1.25);
      animateFlyToCart(heroAddBtnRef.current);
    }
    setIsHeroAdded(true);
    addItem(
      {
        productId: '6728a11b241e1b8b09000001',
        title: 'KhanhBro Signature 3D Liquid Drip Hoodie',
        price: 125,
        quantity: quantity,
        size: selectedSize,
        color: selectedColorway,
        image:
          'https://res.cloudinary.com/dptpb60p7/image/upload/f_auto,q_auto/fashionwekk/masterpieces/khanhbro_hero_signature_drip.png',
        gsm: 480,
      },
      false
    );
    playPop();

    setTimeout(() => {
      setIsHeroAdded(false);
    }, 1800);
  };

  return (
    <section
      ref={heroContainerRef}
      className="relative overflow-hidden pt-4 pb-14 border-b border-[#0A0A0C]/15 select-none"
    >
      {/* Floating 3D Chrome Chains in background matching Dribbble reference */}
      <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden">
        {/* Top Right Floating Chain */}
        <div className="absolute -top-10 right-12 sm:right-32 w-28 sm:w-40 opacity-70 animate-float-chain">
          <svg viewBox="0 0 160 300" fill="none" className="w-full h-auto drop-shadow-xl">
            <ellipse cx="80" cy="50" rx="35" ry="45" stroke="#94A3B8" strokeWidth="16" />
            <ellipse cx="80" cy="50" rx="35" ry="45" stroke="url(#chainGrad1)" strokeWidth="12" />
            <ellipse cx="80" cy="130" rx="35" ry="45" stroke="#94A3B8" strokeWidth="16" />
            <ellipse cx="80" cy="130" rx="35" ry="45" stroke="url(#chainGrad2)" strokeWidth="12" />
            <ellipse cx="80" cy="210" rx="35" ry="45" stroke="#94A3B8" strokeWidth="16" />
            <ellipse cx="80" cy="210" rx="35" ry="45" stroke="url(#chainGrad1)" strokeWidth="12" />
            <defs>
              <linearGradient id="chainGrad1" x1="45" y1="5" x2="115" y2="95">
                <stop stopColor="#FFFFFF" />
                <stop offset="0.5" stopColor="#CBD5E1" />
                <stop offset="1" stopColor="#64748B" />
              </linearGradient>
              <linearGradient id="chainGrad2" x1="45" y1="85" x2="115" y2="175">
                <stop stopColor="#F8FAFC" />
                <stop offset="0.5" stopColor="#94A3B8" />
                <stop offset="1" stopColor="#475569" />
              </linearGradient>
            </defs>
          </svg>
        </div>

        {/* Bottom Left Floating Chain */}
        <div className="absolute -bottom-12 -left-8 sm:left-10 w-24 sm:w-36 opacity-60 animate-float-chain-reverse">
          <svg viewBox="0 0 160 260" fill="none" className="w-full h-auto drop-shadow-xl">
            <ellipse cx="80" cy="60" rx="35" ry="45" stroke="#94A3B8" strokeWidth="16" />
            <ellipse cx="80" cy="60" rx="35" ry="45" stroke="url(#chainGrad1)" strokeWidth="12" />
            <ellipse cx="80" cy="150" rx="35" ry="45" stroke="#94A3B8" strokeWidth="16" />
            <ellipse cx="80" cy="150" rx="35" ry="45" stroke="url(#chainGrad2)" strokeWidth="12" />
          </svg>
        </div>
      </div>

      {/* Giant Y2K Backdrop Typography spanning across screen behind showcase */}
      <div className="relative w-full overflow-hidden text-center select-none pt-2 sm:pt-4 pb-2 z-0">
        <h1 className="y2k-backdrop-title text-[14vw] sm:text-[15vw] lg:text-[15.5vw] tracking-tighter opacity-95 leading-[0.78]">
          FashionWekk
        </h1>
      </div>

      {/* Main Interactive Showcase Tablet Frame */}
      <div className="relative mx-auto max-w-6xl px-3 sm:px-6 z-10 -mt-6 sm:-mt-14 lg:-mt-24">
        <div
          ref={showcaseRef}
          className="w-full rounded-2xl sm:rounded-3xl bg-white dark:bg-[#0E121B] border-2 sm:border-3 border-[#0A0A0C] dark:border-white/20 shadow-[10px_10px_0px_0px_#0A0A0C] dark:shadow-[10px_10px_0px_0px_rgba(212,255,0,0.5)] overflow-hidden transition-colors"
        >
          {/* Top Frame Accent Line matching Dribbble tablet rim */}
          <div className="h-1 sm:h-1.5 w-full bg-[#D4FF00] border-b border-[#0A0A0C] dark:border-white/20" />

          {/* Device In-App Header Bar */}
          <div className="flex items-center justify-between px-4 sm:px-8 py-3 border-b border-[#0A0A0C]/15 dark:border-white/10 bg-white dark:bg-[#0E121B] text-xs transition-colors">
            <div className="flex items-center gap-2">
              <div className="flex h-5 w-5 items-center justify-center rounded-md bg-[#0A0A0C] text-[#D4FF00] font-mono font-black text-[9px] border border-white/20">
                FW
              </div>
              <span className="font-mono text-[11px] sm:text-xs font-black tracking-widest uppercase text-[#0A0A0C] dark:text-white">
                FASHIONWEKK
              </span>
            </div>

            <div className="hidden md:flex items-center gap-6 font-mono text-[10px] sm:text-[11px] font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400">
              <span className="text-[#0A0A0C] dark:text-white cursor-pointer hover:underline">NEW COLLECTION</span>
              <span className="cursor-pointer hover:text-black dark:hover:text-white">CATALOG</span>
              <span className="cursor-pointer hover:text-black dark:hover:text-white">ABOUT BRAND</span>
              <span className="cursor-pointer hover:text-black dark:hover:text-white">BLOG</span>
              <span className="cursor-pointer hover:text-black dark:hover:text-white">CONTACT US</span>
            </div>

            <div className="flex items-center gap-2">
              <span className="font-mono text-[11px] font-bold uppercase text-slate-800 dark:text-slate-300 pr-2 border-r border-slate-200 dark:border-slate-800">
                CART ({quantity})
              </span>
              <button
                onClick={onExploreDrops}
                className="bg-[#0A0A0C] hover:bg-[#D4FF00] hover:text-[#0A0A0C] dark:bg-[#D4FF00] dark:text-black text-white px-3 sm:px-4 py-1.5 text-[10px] sm:text-[11px] font-mono font-black uppercase tracking-wider transition-colors cursor-pointer border border-transparent dark:border-[#D4FF00]"
              >
                SHOP ALL NEW
              </button>
            </div>
          </div>

          {/* Split Content Body matching Dribbble reference */}
          <div className="grid grid-cols-1 lg:grid-cols-12 min-h-[520px]">
            {/* Left Column: Stacked Editorial Lookbook Polaroid Cards */}
            <div className="lg:col-span-6 p-4 sm:p-8 bg-slate-50/60 dark:bg-[#0A0D15]/80 border-b lg:border-b-0 lg:border-r border-[#0A0A0C]/15 dark:border-white/10 flex flex-col justify-between relative overflow-hidden transition-colors">
              {/* Top Lookbook Card */}
              <div className="relative w-full max-w-sm mx-auto bg-white dark:bg-[#121622] p-3 sm:p-4 border border-[#0A0A0C]/20 dark:border-white/20 shadow-md transition-colors">
                {/* Micro Metadata Header */}
                <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-100 dark:border-slate-800 text-[10px] font-mono font-bold uppercase tracking-widest text-slate-700 dark:text-slate-300">
                  <span>FASHIONWEKK</span>
                  <span>SUMMER 2026</span>
                </div>

                {/* Model Photography with Splatter Click */}
                <div
                  onClick={handleHeroSplatter}
                  className="relative aspect-[3/4] w-full overflow-hidden bg-slate-100 dark:bg-slate-900 cursor-crosshair group select-none border border-slate-200 dark:border-slate-800"
                  title="Click to trigger cartoon splatter"
                >
                  <img
                    src={getOptimizedImageUrl(
                      'https://res.cloudinary.com/dptpb60p7/image/upload/f_auto,q_auto/fashionwekk/masterpieces/khanhbro_hero_signature_drip.jpg',
                      { width: 800, quality: 'auto:good' }
                    )}
                    alt="FashionWekk Editorial Lookbook Model"
                    fetchPriority="high"
                    loading="eager"
                    width="600"
                    height="800"
                    draggable={false}
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105 pointer-events-none select-none"
                  />

                  {/* Badges */}
                  <div className="absolute top-2.5 left-2.5 flex flex-col gap-1 z-10 pointer-events-none">
                    <span className="bg-[#0A0A0C] text-white px-2 py-0.5 text-[10px] font-mono font-bold uppercase border border-white/20">
                      480 GSM
                    </span>
                    <span className="bg-[#D4FF00] text-black px-2 py-0.5 text-[10px] font-mono font-black uppercase">
                      LIMITED GRAIL
                    </span>
                  </div>

                  <div className="absolute bottom-2 right-2 rounded bg-white/90 dark:bg-black/90 backdrop-blur-sm px-2 py-0.5 text-[9px] font-mono font-bold text-slate-800 dark:text-slate-200 opacity-70 group-hover:opacity-100 transition-opacity">
                    Click for Drip Splatter
                  </div>
                </div>
              </div>

              {/* Peek Bottom Lookbook Card Stack */}
              <div className="mt-4 pt-3 border-t border-slate-200/80 dark:border-slate-800 flex items-center justify-between text-xs font-mono">
                <span className="text-slate-500 dark:text-slate-400 text-[11px] font-bold uppercase">
                  ARCHIVE // 100 PIECES WORLDWIDE
                </span>
                <span className="text-[#0A0A0C] dark:text-[#D4FF00] font-black text-[11px] uppercase tracking-wider">
                  DIRECTED BY KHANHBRO
                </span>
              </div>
            </div>

            {/* Right Column: Product Detail & Purchase Module */}
            <div className="lg:col-span-6 p-5 sm:p-8 sm:py-10 flex flex-col justify-between bg-white dark:bg-[#0E121B] transition-colors">
              <div>
                {/* Price Display */}
                <div className="flex items-baseline gap-2 font-mono text-xs sm:text-sm text-slate-500 dark:text-slate-400">
                  <span className="text-slate-400 dark:text-slate-500 line-through">$145.00 USD</span>
                  <span className="font-bold text-[#0A0A0C] dark:text-white text-sm sm:text-base">$125.00 USD</span>
                </div>

                {/* Ultra-Bold Italic Oblique Product Headline matching Dribbble */}
                <h2 className="mt-2 font-display text-2xl sm:text-4xl lg:text-[42px] font-black italic tracking-tight uppercase leading-[0.95] text-[#0A0A0C] dark:text-white">
                  Casual Metallic Grey Tank Top & Cami
                </h2>

                <p className="mt-2 text-xs text-slate-500 dark:text-slate-400 font-medium">
                  Heavyweight boxy atelier cut with metallic cyber silicone drip print. Engineered with 480 GSM combed cotton.
                </p>

                {/* Selectors: Minimalist Quantity & Option Dropdowns */}
                <div className="mt-6 grid grid-cols-12 gap-2">
                  {/* Quantity Box */}
                  <div className="col-span-3 sm:col-span-2 flex items-center justify-between border border-[#0A0A0C] dark:border-white/20 dark:bg-[#141A26] px-2 py-2 text-xs font-mono font-bold">
                    <button
                      type="button"
                      onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                      className="text-slate-500 dark:text-slate-400 hover:text-black dark:hover:text-white cursor-pointer px-1"
                    >
                      -
                    </button>
                    <span className="text-[#0A0A0C] dark:text-white">{quantity}</span>
                    <button
                      type="button"
                      onClick={() => setQuantity((q) => q + 1)}
                      className="text-slate-500 dark:text-slate-400 hover:text-black dark:hover:text-white cursor-pointer px-1"
                    >
                      +
                    </button>
                  </div>

                  {/* Option Dropdown Selector */}
                  <div className="col-span-9 sm:col-span-10 relative">
                    <select
                      value={selectedColorway}
                      onChange={(e) => setSelectedColorway(e.target.value)}
                      className="w-full appearance-none rounded-none border border-[#0A0A0C] dark:border-white/20 bg-white dark:bg-[#141A26] px-3 py-2 text-xs font-mono font-bold uppercase tracking-wider text-[#0A0A0C] dark:text-white cursor-pointer focus:outline-none"
                    >
                      <option value="METALLIC ONYX">METALLIC ONYX COLOR</option>
                      <option value="CHROME ICE BLUE">CHROME ICE BLUE</option>
                      <option value="HARAJUKU VOLT LIME">HARAJUKU VOLT LIME</option>
                      <option value="ACID WASHDOWN">ACID WASHDOWN GREY</option>
                    </select>
                    <ChevronDown className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-600 dark:text-slate-400" />
                  </div>
                </div>

                {/* Size Selector Strip */}
                <div className="mt-3 flex items-center gap-2">
                  <span className="text-[10px] font-mono uppercase font-bold text-slate-400">
                    SIZE:
                  </span>
                  {['S', 'M', 'L', 'XL'].map((s) => (
                    <button
                      key={s}
                      onClick={() => setSelectedSize(s)}
                      className={`h-7 px-2.5 text-[11px] font-mono font-bold uppercase border transition-colors cursor-pointer ${
                        selectedSize === s
                          ? 'bg-[#0A0A0C] text-white border-[#0A0A0C] dark:bg-[#D4FF00] dark:text-black dark:border-[#D4FF00]'
                          : 'bg-white text-slate-700 border-slate-300 dark:bg-[#141A26] dark:text-slate-300 dark:border-white/20 hover:border-black'
                      }`}
                    >
                      {s}
                    </button>
                  ))}
                </div>

                {/* Full-Width Neon Lime Gradient CTA Button */}
                <button
                  ref={heroAddBtnRef}
                  onClick={handleHeroQuickAdd}
                  className={`mt-5 w-full flex items-center justify-center gap-2 py-3.5 sm:py-4 text-xs sm:text-sm font-black tracking-widest uppercase transition-all shadow-md cursor-pointer ${
                    isHeroAdded
                      ? 'bg-emerald-600 text-white'
                      : 'lime-gradient-btn'
                  }`}
                >
                  {isHeroAdded ? (
                    <>
                      <Check className="h-4 w-4 stroke-[3]" /> ADDED TO BAG!
                    </>
                  ) : (
                    <>
                      <ShoppingBag className="h-4 w-4" /> ADD TO CART
                    </>
                  )}
                </button>
              </div>

              {/* Accordions: Materials & Details, Description matching Dribbble */}
              <div className="mt-6 pt-4 border-t border-[#0A0A0C]/15 dark:border-white/10 space-y-3">
                {/* Accordion 1: Materials & Details */}
                <div className="border-b border-slate-200 dark:border-slate-800 pb-3">
                  <button
                    onClick={() =>
                      setOpenAccordion((prev) => ({
                        ...prev,
                        materials: !prev.materials,
                      }))
                    }
                    className="w-full flex items-center justify-between text-left text-xs font-bold uppercase tracking-wider text-[#0A0A0C] dark:text-white cursor-pointer"
                  >
                    <span>Materials & Details</span>
                    {openAccordion.materials ? (
                      <ChevronUp className="h-3.5 w-3.5" />
                    ) : (
                      <ChevronDown className="h-3.5 w-3.5" />
                    )}
                  </button>

                  {openAccordion.materials && (
                    <div className="mt-2 space-y-1 text-[11px] font-mono text-slate-600 dark:text-slate-400 animate-in fade-in duration-150">
                      <div className="flex justify-between">
                        <span>Fabric:</span>
                        <span className="font-bold text-slate-900 dark:text-slate-200">Medium Stretch 480 GSM</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Fit Type:</span>
                        <span className="font-bold text-slate-900 dark:text-slate-200">Slim Fit / Boxy Streetwear</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Sheer:</span>
                        <span className="font-bold text-slate-900 dark:text-slate-200">No (Opaque Heavyweight)</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Composition:</span>
                        <span className="font-bold text-slate-900 dark:text-slate-200">94% Cotton Terry, 6% Elastane</span>
                      </div>
                    </div>
                  )}
                </div>

                {/* Accordion 2: Description */}
                <div className="border-b border-slate-200 dark:border-slate-800 pb-3">
                  <button
                    onClick={() =>
                      setOpenAccordion((prev) => ({
                        ...prev,
                        description: !prev.description,
                      }))
                    }
                    className="w-full flex items-center justify-between text-left text-xs font-bold uppercase tracking-wider text-[#0A0A0C] dark:text-white cursor-pointer"
                  >
                    <span>Description</span>
                    {openAccordion.description ? (
                      <ChevronUp className="h-3.5 w-3.5" />
                    ) : (
                      <ChevronDown className="h-3.5 w-3.5" />
                    )}
                  </button>

                  {openAccordion.description && (
                    <div className="mt-2 space-y-1 text-[11px] font-mono text-slate-600 dark:text-slate-400 animate-in fade-in duration-150">
                      <div className="flex justify-between">
                        <span>Color:</span>
                        <span className="font-bold text-slate-900 dark:text-slate-200">Metallic Onyx / Grey</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Style:</span>
                        <span className="font-bold text-slate-900 dark:text-slate-200">Y2K Cyber Cartoon Drip</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Pattern Type:</span>
                        <span className="font-bold text-slate-900 dark:text-slate-200">Figure, Letter, All Over Drip</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Length:</span>
                        <span className="font-bold text-slate-900 dark:text-slate-200">Regular Boxy</span>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
