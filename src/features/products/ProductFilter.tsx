import React from 'react';
import {
  Search,
  SlidersHorizontal,
  RotateCcw,
  LayoutGrid,
  TableProperties,
} from 'lucide-react';

interface ProductFilterProps {
  category: string;
  onSelectCategory: (cat: string) => void;
  collection: string;
  onSelectCollection: (col: string) => void;
  search: string;
  onSearchChange: (search: string) => void;
  flashSale: boolean;
  onToggleFlashSale: () => void;
  sortBy: string;
  onSortChange: (sort: string) => void;
  viewMode: 'grid' | 'table';
  onViewModeChange: (mode: 'grid' | 'table') => void;
  onReset: () => void;
}

const CATEGORIES = [
  { id: 'all', label: 'All Drops' },
  { id: 'hoodies', label: 'Heavy Hoodies' },
  { id: 'tees', label: 'Cartoon Tees' },
  { id: 'bottoms', label: 'Tactical Cargo' },
  { id: 'outerwear', label: 'Splash Jackets' },
  { id: 'accessories', label: 'Headwear' },
  { id: 'collectibles', label: 'Collectibles' },
];

const POPULAR_COLLECTIONS = [
  { id: 'all', label: 'All Collections' },
  { id: 'Cyber Toon Glitch', label: 'Cyber Toon' },
  { id: 'Mecha Bot Evolution', label: 'Mecha Bot' },
  { id: 'Rogue Clan Distressed', label: 'Rogue Clan' },
  { id: 'Street Ronin Brush', label: 'Street Ronin' },
  { id: 'Chibi Harajuku Splash', label: 'Chibi Splash' },
  { id: 'Pixel Quest 8-Bit', label: 'Pixel Quest' },
  { id: 'Synth Wave Sunset', label: 'Synth Sunset' },
  { id: 'KhanhBro Signature Drip', label: 'KhanhBro Drip' },
];

export const ProductFilter: React.FC<ProductFilterProps> = ({
  category,
  onSelectCategory,
  collection,
  onSelectCollection,
  search,
  onSearchChange,
  flashSale,
  onToggleFlashSale,
  sortBy,
  onSortChange,
  viewMode,
  onViewModeChange,
  onReset,
}) => {
  const isFiltered =
    category !== 'all' || collection !== 'all' || Boolean(search) || flashSale;

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
        {CATEGORIES.map((cat) => (
          <button
            key={cat.id}
            onClick={() => onSelectCategory(cat.id)}
            className={`whitespace-nowrap rounded-xl px-4 py-2 text-xs font-bold transition-all ${
              category === cat.id
                ? 'bg-[#FF5722] text-white shadow-md shadow-[#FF5722]/30'
                : 'bg-white text-slate-700 hover:bg-slate-100 hover:text-slate-900 border border-slate-200/90 shadow-sm'
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
        <span className="flex items-center gap-1 text-xs font-black text-[#0096C7] uppercase tracking-wider pl-1 flex-shrink-0 font-mono">
          Capsules:
        </span>
        {POPULAR_COLLECTIONS.map((col) => (
          <button
            key={col.id}
            onClick={() => onSelectCollection(col.id)}
            className={`whitespace-nowrap rounded-lg px-3 py-1.5 text-xs font-semibold transition-all ${
              collection === col.id
                ? 'bg-[#0096C7] text-white font-bold shadow-sm'
                : 'bg-white/80 text-slate-600 hover:bg-white hover:text-slate-900 border border-slate-200/70 shadow-xs'
            }`}
          >
            {col.label}
          </button>
        ))}
      </div>

      <div className="flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between pt-1">
        <div className="relative flex-1 w-full md:max-w-md">
          <Search className="absolute left-3.5 top-2.5 h-4 w-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search cartoon drops, GSM, hoodies, splashes..."
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full rounded-xl bg-white pl-10 pr-4 py-2 text-xs sm:text-xs text-slate-900 border border-slate-200 shadow-sm focus:border-[#FF5722] focus:ring-2 focus:ring-[#FF5722]/20 focus:outline-none placeholder:text-slate-400 font-medium"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={onToggleFlashSale}
            className={`flex items-center gap-1.5 rounded-xl px-3 py-2 text-xs font-black uppercase tracking-wider transition-all flex-shrink-0 cursor-pointer font-mono ${
              flashSale
                ? 'bg-[#FF2E93] text-white shadow-md shadow-[#FF2E93]/25'
                : 'bg-white text-slate-700 hover:text-slate-900 border border-slate-200 shadow-sm'
            }`}
          >
            Flash Drops
          </button>

          <div className="relative flex items-center flex-1 sm:flex-initial min-w-[140px]">
            <SlidersHorizontal className="absolute left-3 h-3.5 w-3.5 text-slate-500 pointer-events-none" />
            <select
              value={sortBy}
              onChange={(e) => onSortChange(e.target.value)}
              aria-label="Sort drops"
              className="w-full appearance-none rounded-xl bg-white pl-8 pr-7 py-2 text-xs font-semibold text-slate-800 border border-slate-200 shadow-sm focus:border-[#FF5722] focus:outline-none cursor-pointer"
            >
              <option value="featured">Featured Drops</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
              <option value="gsm-desc">Heaviest GSM Weight</option>
              <option value="rating-desc">Highest Rated</option>
            </select>
          </div>

          <div className="flex items-center rounded-xl bg-white p-1 border border-slate-200 shadow-sm flex-shrink-0">
            <button
              onClick={() => onViewModeChange('grid')}
              title="Bento Grid Mode"
              className={`rounded-lg p-1.5 transition-colors cursor-pointer ${
                viewMode === 'grid'
                  ? 'bg-[#FF5722] text-white shadow-xs'
                  : 'text-slate-400 hover:text-slate-800'
              }`}
            >
              <LayoutGrid className="h-3.5 w-3.5" />
            </button>
            <button
              onClick={() => onViewModeChange('table')}
              title="Spec Table Mode"
              className={`rounded-lg p-1.5 transition-colors cursor-pointer ${
                viewMode === 'table'
                  ? 'bg-[#FF5722] text-white shadow-xs'
                  : 'text-slate-400 hover:text-slate-800'
              }`}
            >
              <TableProperties className="h-3.5 w-3.5" />
            </button>
          </div>

          {isFiltered && (
            <button
              onClick={onReset}
              className="flex items-center gap-1 text-xs text-rose-600 hover:text-rose-700 px-2.5 py-1.5 rounded-lg bg-rose-50 border border-rose-200 font-semibold cursor-pointer"
              title="Reset all filters"
            >
              <RotateCcw className="h-3.5 w-3.5" />
              <span>Reset</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
