import React from 'react';
import { Database } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="mt-20 border-t border-slate-200 bg-slate-100/80 pt-12 pb-28 sm:pb-12 text-xs text-slate-600">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="space-y-3 md:col-span-2">
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-slate-900 text-[#D4FF00] font-mono font-black text-xs border border-slate-900 shadow-xs">
                FW
              </div>
              <span className="font-display text-lg font-black text-slate-900">
                FASHION<span className="text-[#FF5722]">WEKK</span>
              </span>
              <span className="rounded bg-[#FF5722]/10 px-2 py-0.5 text-[10px] font-mono uppercase tracking-widest text-[#FF5722] border border-[#FF5722]/25 font-bold">
                Directed by KhanhBro
              </span>
            </div>
            <p className="max-w-md text-xs text-slate-600 leading-relaxed font-normal">
              3D Cartoon Splash & Toon Drip Streetwear Atelier. Crafting heavyweight 450+ GSM garments infused with graphic pop-art illustrations, comic graffiti drips, and collectible character fits.
            </p>
            <div className="flex items-center gap-3 pt-2 text-xs font-mono font-medium">
              <span className="flex items-center gap-1 text-[#0096C7]">
                <Database className="h-3.5 w-3.5" /> MongoDB Atlas Connected
              </span>
              <span>•</span>
              <span className="text-slate-500">React 19 + Tailwind v4 + Mongoose</span>
            </div>
          </div>

          <div className="space-y-2">
            <h4 className="font-display text-xs font-bold uppercase tracking-wider text-slate-900">
              Streetwear Drops
            </h4>
            <ul className="space-y-1.5 text-xs text-slate-600 font-medium">
              <li><a href="#" className="hover:text-[#FF5722] transition-colors">Heavy Hoodies (450+ GSM)</a></li>
              <li><a href="#" className="hover:text-[#FF5722] transition-colors">Cartoon Graphic Tees</a></li>
              <li><a href="#" className="hover:text-[#FF5722] transition-colors">Tactical Cargo & Pants</a></li>
              <li><a href="#" className="hover:text-[#FF5722] transition-colors">Pop Splash Bomber Jackets</a></li>
            </ul>
          </div>

          <div className="space-y-2">
            <h4 className="font-display text-xs font-bold uppercase tracking-wider text-slate-900">
              Guarantees
            </h4>
            <ul className="space-y-1.5 text-xs text-slate-600 font-medium">
              <li>100% Battle-Grade Combed Cotton</li>
              <li>Free Global Shipping over $75</li>
              <li>30-Day Hassle-Free Exchange</li>
              <li>Secured via MongoDB Atlas Vault</li>
            </ul>
          </div>
        </div>

        <div className="mt-12 flex flex-col sm:flex-row items-center justify-between border-t border-slate-200 pt-6 text-xs text-slate-500 font-medium">
          <p>© 2026 FashionWekk. All Rights Reserved. Curated & Directed by KhanhBro.</p>
          <p className="mt-2 sm:mt-0 font-mono text-[11px] text-slate-400">
            Engineered with Clean Code Architecture.
          </p>
        </div>
      </div>
    </footer>
  );
};
