import React from 'react';
import {
  Search,
  SlidersHorizontal,
  RotateCcw,
  LayoutGrid,
  TableProperties,
} from 'lucide-react';
import { MASCOT_SLOTS } from '../mascot/mascotLabels';

interface ProductFilterProps {
  category: string;
  onSelectCategory: (cat: string) => void;
  collection: string;
  onSelectCollection: (col: string) => void;
  season?: string;
  onSelectSeason?: (season: string) => void;
  mascotSlot?: string;
  onSelectMascotSlot?: (slot: string) => void;
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

const SEASONS = [
  { id: 'all', label: 'All Seasons' },
  { id: 'SS26', label: '☀️ Spring / Summer SS26' },
  { id: 'FW26', label: '❄️ Fall / Winter FW26' },
];

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
  season = 'all',
  onSelectSeason,
  mascotSlot = 'all',
  onSelectMascotSlot,
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
    category !== 'all' ||
    collection !== 'all' ||
    season !== 'all' ||
    (mascotSlot && mascotSlot !== 'all') ||
    Boolean(search) ||
    flashSale;

  return (
    <div className="space-y-4">
      {/* Mascot Dress-Up Slot Filter Bar */}
      {onSelectMascotSlot && (
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
          <span className="flex items-center gap-1 text-xs font-black text-[#0A0A0C] uppercase tracking-wider pl-1 flex-shrink-0 font-mono">
            Mascot Fit:
          </span>
          <button
            onClick={() => onSelectMascotSlot('all')}
            className={`whitespace-nowrap rounded-xl px-3 py-1.5 text-xs font-mono font-bold tracking-wider uppercase transition-all cursor-pointer border ${
              mascotSlot === 'all'
                ? 'bg-[#0A0A0C] text-[#D4FF00] border-[#0A0A0C] shadow-xs'
                : 'bg-white text-slate-700 hover:bg-slate-100 hover:text-slate-900 border-slate-200 shadow-xs'
            }`}
          >
            All Slots
          </button>
          {MASCOT_SLOTS.map((slot) => {
            const isSelected = mascotSlot === slot.id;
            return (
              <button
                key={slot.id}
                onClick={() => onSelectMascotSlot(slot.id)}
                className={`whitespace-nowrap rounded-xl px-3 py-1.5 text-xs font-mono font-bold tracking-wider uppercase transition-all cursor-pointer flex items-center gap-1.5 border ${
                  isSelected
                    ? 'bg-[#0A0A0C] text-white border-[#0A0A0C] shadow-xs'
                    : 'bg-white text-slate-700 hover:bg-slate-100 hover:text-slate-900 border-slate-200 shadow-xs'
                }`}
                style={isSelected ? { borderLeftColor: slot.accentColor, borderLeftWidth: '4px' } : {}}
              >
                <span
                  className="h-2 w-2 rounded-full"
                  style={{ backgroundColor: slot.accentColor }}
                />
                {slot.label}
              </button>
            );
          })}
        </div>
      )}

      {/* Season Selection Bar */}
      {onSelectSeason && (
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
          <span className="flex items-center gap-1 text-xs font-black text-amber-500 uppercase tracking-wider pl-1 flex-shrink-0 font-mono">
            Season:
          </span>
          {SEASONS.map((s) => (
            <button
              key={s.id}
              onClick={() => onSelectSeason(s.id)}
              className={`whitespace-nowrap rounded-xl px-3.5 py-1.5 text-xs font-black tracking-wide transition-all ${
                season === s.id
                  ? 'bg-slate-900 text-white shadow-md'
                  : 'bg-white text-slate-700 hover:bg-slate-100 hover:text-slate-900 border border-slate-200/80 shadow-xs'
              }`}
            >
              {s.label}
            </button>
          ))}
        </div>
      )}

      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
        {CATEGORIES.map((cat) => (
          <button
            key={cat.id}
            onClick={() => onSelectCategory(cat.id)}
            className={`whitespace-nowrap px-3.5 py-1.5 text-xs font-mono font-bold uppercase tracking-wider transition-all cursor-pointer border ${
              category === cat.id
                ? 'bg-[#0A0A0C] text-white border-[#0A0A0C] shadow-xs'
                : 'bg-white text-slate-700 hover:bg-[#D4FF00] hover:text-black border-slate-300 shadow-xs'
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
        <span className="flex items-center gap-1 text-[11px] font-mono font-black text-[#0A0A0C] uppercase tracking-wider pl-1 flex-shrink-0">
          Capsules:
        </span>
        {POPULAR_COLLECTIONS.map((col) => (
          <button
            key={col.id}
            onClick={() => onSelectCollection(col.id)}
            className={`whitespace-nowrap px-3 py-1 text-xs font-mono font-bold uppercase transition-all cursor-pointer border ${
              collection === col.id
                ? 'bg-[#D4FF00] text-black border-[#0A0A0C] shadow-xs'
                : 'bg-white text-slate-600 hover:bg-[#0A0A0C] hover:text-white border-slate-300 shadow-xs'
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
            placeholder="Search drops, GSM, hoodies, splashes..."
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full bg-white pl-10 pr-4 py-2 text-xs text-slate-900 border border-[#0A0A0C] shadow-xs focus:ring-1 focus:ring-[#0A0A0C] focus:outline-none placeholder:text-slate-400 font-mono font-medium"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={onToggleFlashSale}
            className={`flex items-center gap-1.5 px-3 py-2 text-xs font-black uppercase tracking-wider transition-all flex-shrink-0 cursor-pointer font-mono border ${
              flashSale
                ? 'bg-[#D4FF00] text-black border-[#0A0A0C] shadow-xs'
                : 'bg-white text-slate-700 hover:text-black border-slate-300 shadow-xs'
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
              className="w-full appearance-none bg-white pl-8 pr-7 py-2 text-xs font-mono font-bold uppercase text-slate-800 border border-[#0A0A0C] shadow-xs focus:outline-none cursor-pointer"
            >
              <option value="featured">Featured Drops</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
              <option value="gsm-desc">Heaviest GSM Weight</option>
              <option value="rating-desc">Highest Rated</option>
            </select>
          </div>

          <div className="flex items-center bg-white p-1 border border-[#0A0A0C] shadow-xs flex-shrink-0">
            <button
              onClick={() => onViewModeChange('grid')}
              title="Bento Grid Mode"
              className={`p-1.5 transition-colors cursor-pointer ${
                viewMode === 'grid'
                  ? 'bg-[#0A0A0C] text-[#D4FF00]'
                  : 'text-slate-400 hover:text-slate-800'
              }`}
            >
              <LayoutGrid className="h-3.5 w-3.5" />
            </button>
            <button
              onClick={() => onViewModeChange('table')}
              title="Spec Table Mode"
              className={`p-1.5 transition-colors cursor-pointer ${
                viewMode === 'table'
                  ? 'bg-[#0A0A0C] text-[#D4FF00]'
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
