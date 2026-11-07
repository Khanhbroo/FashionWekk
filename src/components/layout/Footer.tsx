import React from 'react';
import { Sparkles } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="mt-20 border-t-2 border-[#0A0A0C] bg-[#0A0A0C] pt-12 pb-28 sm:pb-12 text-xs text-slate-300 select-none">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="space-y-3 md:col-span-2">
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-black text-[#D4FF00] font-mono font-black text-xs border border-[#D4FF00]/40 shadow-xs">
                FW
              </div>
              <span className="font-display text-lg font-black tracking-tight uppercase text-white">
                FASHION<span className="text-[#FF5722]">WEKK</span> <span className="text-[#D4FF00]">// ATELIER</span>
              </span>
              <span className="bg-[#D4FF00]/10 px-2 py-0.5 text-[10px] font-mono uppercase tracking-widest text-[#D4FF00] border border-[#D4FF00]/30 font-bold">
                by KhanhBro
              </span>
            </div>
            <p className="max-w-md text-xs text-slate-400 leading-relaxed font-normal">
              Y2K Cyber & 3D Cartoon Splash Atelier. Crafting heavyweight 480+ GSM garments infused with graphic pop-art illustrations, comic graffiti drips, and collectible streetwear fits.
            </p>
            <div className="flex items-center gap-3 pt-2 text-xs font-mono font-medium text-slate-400">
              <span className="text-[#D4FF00] font-bold">
                LIMITED CAPSULE VAULT
              </span>
              <span>•</span>
              <span>100 Pieces Per Edition</span>
              <span>•</span>
              <span>Zero Restocks</span>
            </div>
          </div>

          <div className="space-y-2 font-mono">
            <h4 className="text-xs font-bold uppercase tracking-wider text-white">
              Streetwear Drops
            </h4>
            <ul className="space-y-1.5 text-xs text-slate-400">
              <li><a href="#" className="hover:text-[#D4FF00] transition-colors">Heavy Hoodies (480 GSM)</a></li>
              <li><a href="#" className="hover:text-[#D4FF00] transition-colors">Graphic Tees & Camis</a></li>
              <li><a href="#" className="hover:text-[#D4FF00] transition-colors">Tactical Cargo & Pants</a></li>
              <li><a href="#" className="hover:text-[#D4FF00] transition-colors">Splash Bomber Jackets</a></li>
            </ul>
          </div>

          <div className="space-y-2 font-mono">
            <h4 className="text-xs font-bold uppercase tracking-wider text-white">
              Guarantees
            </h4>
            <ul className="space-y-1.5 text-xs text-slate-400">
              <li>100% Battle-Grade Combed Cotton</li>
              <li>Free Global Air Freight over $75</li>
              <li>30-Day Hassle-Free Exchange</li>
              <li>Collector Certificate Included</li>
            </ul>
          </div>
        </div>

        <div className="mt-12 flex flex-col sm:flex-row items-center justify-between border-t border-white/10 pt-6 text-xs text-slate-500 font-mono">
          <p>© 2026 FashionWekk Atelier. Curated & Directed by KhanhBro.</p>
          <p className="mt-2 sm:mt-0 text-[11px] text-slate-400">
            Powered by React 19 + Tailwind v4 + GSAP
          </p>
        </div>
      </div>
    </footer>
  );
};
