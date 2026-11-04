import React, { useEffect, useRef, useState } from 'react';
import {
  ArrowRight,
  Star,
  Check,
  ShoppingBag,
  Shirt,
} from 'lucide-react';
import { MascotAvatar } from '../../features/mascot/MascotAvatar';
import { useMascotStore } from '../../stores/mascotStore';
import { useCartStore } from '../../stores/cartStore';
import { useSoundFx } from '../../hooks/useSoundFx';
import {
  gsap,
  animateSplatterBurst,
  animateSquashAndStretch,
  animateFlyToCart,
} from '../../utils/animations';

interface HeroSectionProps {
  onExploreDrops: () => void;
  onOpenWheel: () => void;
}

const CATEGORY_MARQUEE = [
  'HEAVY HOODIES (480 GSM)',
  'CARTOON GRAPHIC TEES (380 GSM)',
  'TACTICAL CARGO & PANTS (450 GSM)',
  'SPLASH BOMBER JACKETS (500 GSM)',
  'COMIC HEADWEAR & ACCESSORIES',
  'LIMITED COLLECTIBLES VAULT',
];

export const HeroSection: React.FC<HeroSectionProps> = ({
  onExploreDrops,
  onOpenWheel,
}) => {
  const { openStudio } = useMascotStore();
  const { addItem } = useCartStore();
  const { playPop, playEquip } = useSoundFx();

  const [selectedHeroSize, setSelectedHeroSize] = useState('L');
  const [isHeroAdded, setIsHeroAdded] = useState(false);

  const heroContainerRef = useRef<HTMLDivElement>(null);
  const headlineRef = useRef<HTMLDivElement>(null);
  const lookbookCardRef = useRef<HTMLDivElement>(null);
  const heroAddBtnRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });

      tl.fromTo(
        headlineRef.current,
        { opacity: 0, y: 35 },
        { opacity: 1, y: 0, duration: 0.7 }
      ).fromTo(
        lookbookCardRef.current,
        { opacity: 0, y: 40, scale: 0.96 },
        { opacity: 1, y: 0, scale: 1, duration: 0.8, ease: 'back.out(1.4)' },
        '-=0.4'
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
        quantity: 1,
        size: selectedHeroSize,
        color: 'Onyx Black',
        image: '/assets/images/khanhbro_hoodie_sample.jpg',
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
    <section className="relative overflow-hidden pt-4 sm:pt-6 pb-8 border-b border-slate-200/80 bg-white">
      <div className="relative mx-auto max-w-7xl px-3 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          {/* Left Column: Collusion Editorial Typography & Action */}
          <div ref={headlineRef} className="lg:col-span-7 flex flex-col justify-center">
            <div className="inline-flex items-center gap-2 rounded-full bg-slate-900 text-white px-3.5 py-1 text-[11px] sm:text-xs font-mono font-bold tracking-widest uppercase mb-4 sm:mb-6 shadow-sm w-fit">
              <span className="h-2 w-2 rounded-full bg-[#D4FF00] animate-ping" />
              <span>COLLUSION ATELIER // CAPSULE 01</span>
              <span className="text-slate-400">•</span>
              <span className="text-[#D4FF00]">BY KHANHBRO</span>
            </div>

            <h1 className="font-display text-4xl sm:text-6xl lg:text-7xl xl:text-8xl font-black tracking-tight text-slate-900 uppercase leading-[0.95]">
              COLLUSION <br />
              <span className="text-[#FF5722]">
                STREETWEAR
              </span>
              <span className="block text-slate-900 text-2xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight mt-1">
                3D CARTOON POP DRIP
              </span>
            </h1>

            <p className="mt-4 sm:mt-6 max-w-xl text-xs sm:text-sm md:text-base text-slate-600 leading-relaxed font-normal">
              An explosive collision of 480+ GSM battle-grade combed French terry, tactile 3D liquid cartoon pop-art graphics, and architectural drop-shoulder streetwear cuts. Directed personally by KhanhBro with zero restocks.
            </p>

            <div className="mt-6 sm:mt-8 flex flex-col sm:flex-row flex-wrap items-stretch sm:items-center gap-3 sm:gap-4">
              <button
                onClick={onExploreDrops}
                className="flex items-center justify-center gap-2 rounded-2xl bg-slate-900 hover:bg-[#FF5722] px-7 py-4 text-xs sm:text-sm font-black text-white shadow-xl transition-all hover:scale-105 cursor-pointer group"
              >
                <span>EXPLORE 100 DROPS</span>
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </button>

              <button
                onClick={openStudio}
                className="flex items-center justify-center gap-2 rounded-2xl bg-slate-100 hover:bg-[#D4FF00] hover:text-black px-6 py-4 text-xs sm:text-sm font-bold text-slate-900 border border-slate-200 transition-all cursor-pointer shadow-xs group"
              >
                <Shirt className="h-4 w-4 text-slate-700 group-hover:text-black transition-colors" />
                <span>FIT STUDIO AVATAR</span>
              </button>

              <button
                onClick={onOpenWheel}
                className="flex items-center justify-center rounded-2xl bg-slate-100 hover:bg-slate-200 px-5 py-4 text-xs sm:text-sm font-black text-slate-900 border border-slate-200 transition-all cursor-pointer font-mono uppercase tracking-wider"
              >
                <span>SPIN -20%</span>
              </button>
            </div>

            {/* Collusion Atelier Specifications Strip */}
            <div className="mt-8 pt-6 border-t border-slate-200/80 grid grid-cols-3 gap-3 max-w-lg">
              <div>
                <span className="text-[10px] font-mono uppercase font-bold text-slate-400 block">
                  FABRIC DENSITY
                </span>
                <span className="font-display text-sm sm:text-base font-black text-slate-900">
                  480 GSM
                </span>
                <span className="text-[10px] text-slate-500 block">Combed Terry</span>
              </div>
              <div>
                <span className="text-[10px] font-mono uppercase font-bold text-slate-400 block">
                  CAPSULES
                </span>
                <span className="font-display text-sm sm:text-base font-black text-[#FF5722]">
                  10 SERIES
                </span>
                <span className="text-[10px] text-slate-500 block">KhanhBro Atelier</span>
              </div>
              <div>
                <span className="text-[10px] font-mono uppercase font-bold text-slate-400 block">
                  EDITION POLICY
                </span>
                <span className="font-display text-sm sm:text-base font-black text-emerald-600">
                  100 PIECES
                </span>
                <span className="text-[10px] text-slate-500 block">No Restocks</span>
              </div>
            </div>
          </div>

          {/* Right Column: Interactive Collusion Lookbook Showcase Card */}
          <div ref={lookbookCardRef} className="lg:col-span-5 flex justify-center">
            <div className="w-full max-w-md rounded-3xl bg-white p-5 sm:p-6 border-2 border-slate-900/15 shadow-[8px_8px_0px_#0F172A] relative group">
              {/* Campaign Sticker */}
              <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-100 text-xs">
                <span className="inline-flex items-center gap-1.5 rounded-lg bg-[#D4FF00] px-2.5 py-0.5 font-mono text-[10px] font-black uppercase text-black border border-black/20">
                  FLAGSHIP GRAIL
                </span>
                <span className="font-mono text-slate-400 text-[11px] font-bold">
                  DROP 01 // 100
                </span>
              </div>

              {/* LCP Hero Image Container with Splatter Burst */}
              <div
                onClick={handleHeroSplatter}
                className="relative aspect-[4/5] w-full overflow-hidden rounded-2xl bg-slate-100 border border-slate-200 cursor-crosshair group/img select-none"
              >
                <img
                  src="/assets/images/khanhbro_hoodie_sample.jpg"
                  alt="KhanhBro Signature 3D Liquid Drip Hoodie"
                  fetchPriority="high"
                  loading="eager"
                  width="600"
                  height="750"
                  draggable={false}
                  className="h-full w-full object-cover select-none pointer-events-none"
                />

                <div className="absolute top-3 left-3 flex flex-wrap gap-1.5 z-10 pointer-events-none">
                  <span className="rounded-lg bg-slate-900/90 backdrop-blur-md px-2.5 py-1 text-[11px] font-mono font-bold text-white border border-white/20">
                    480 GSM TERRY
                  </span>
                  <span className="rounded-lg bg-[#FF5722] px-2.5 py-1 text-[11px] font-mono font-black text-white shadow-sm">
                    3D TOON DRIP
                  </span>
                </div>

                <div className="absolute bottom-3 right-3 rounded-lg bg-white/90 backdrop-blur-md px-2.5 py-1 text-[10px] font-mono font-bold text-slate-800 border border-slate-200 pointer-events-none opacity-80 group-hover/img:opacity-100 transition-opacity">
                  Click for Splatter
                </div>
              </div>

              {/* Card Meta & Interactive Size Selector */}
              <div className="mt-4">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold uppercase tracking-wider text-[#0096C7]">
                    KhanhBro Signature Drip
                  </span>
                  <span className="flex items-center gap-1 font-mono text-amber-500 font-bold">
                    <Star className="h-3 w-3 fill-current" /> 5.0 (28)
                  </span>
                </div>

                <h3 className="font-display text-base font-black text-slate-900 mt-1 line-clamp-1">
                  KhanhBro Signature 3D Liquid Drip Hoodie
                </h3>

                <div className="mt-3 flex items-center justify-between pt-2 border-t border-slate-100">
                  <div className="flex items-center gap-1.5">
                    <span className="text-[10px] font-mono font-bold text-slate-400 uppercase mr-1">
                      Size:
                    </span>
                    {['S', 'M', 'L', 'XL'].map((size) => (
                      <button
                        key={size}
                        onClick={() => setSelectedHeroSize(size)}
                        className={`min-w-8 h-8 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                          selectedHeroSize === size
                            ? 'bg-slate-900 text-white font-black shadow-xs'
                            : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                        }`}
                      >
                        {size}
                      </button>
                    ))}
                  </div>

                  <span className="font-display text-xl font-black text-[#FF5722]">
                    $125.00
                  </span>
                </div>

                {/* Instant Quick-Add Trigger */}
                <button
                  ref={heroAddBtnRef}
                  onClick={handleHeroQuickAdd}
                  className={`mt-3 w-full flex items-center justify-center gap-2 rounded-xl py-3 text-xs font-black transition-all shadow-md cursor-pointer ${
                    isHeroAdded
                      ? 'bg-emerald-600 text-white shadow-emerald-600/30'
                      : 'bg-[#D4FF00] hover:bg-[#c4ed00] text-black border border-black/20'
                  }`}
                >
                  {isHeroAdded ? (
                    <>
                      <Check className="h-4 w-4 stroke-[3]" /> ADDED TO BAG!
                    </>
                  ) : (
                    <>
                      <ShoppingBag className="h-4 w-4" /> QUICK BAG + ($125)
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Marquee Category Ribbon */}
      <div className="mt-8 border-t border-b border-slate-200/80 bg-slate-50 py-3 overflow-hidden select-none">
        <div className="animate-marquee whitespace-nowrap font-mono text-xs font-bold tracking-wider text-slate-700 flex items-center gap-8">
          {CATEGORY_MARQUEE.map((cat, idx) => (
            <span key={idx} className="flex items-center gap-4">
              <span>{cat}</span>
              <span className="text-[#FF5722] font-black">•</span>
            </span>
          ))}
          {CATEGORY_MARQUEE.map((cat, idx) => (
            <span key={`dup-${idx}`} className="flex items-center gap-4">
              <span>{cat}</span>
              <span className="text-[#FF5722] font-black">•</span>
            </span>
          ))}
        </div>
      </div>
    </section>
  );
};
