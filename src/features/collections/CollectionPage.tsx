import React, { useState, useEffect, useRef } from 'react';
import {
  ArrowLeft,
  Layers,
  Search,
  SlidersHorizontal,
  LayoutGrid,
  TableProperties,
  ChevronRight,
  PackageOpen,
} from 'lucide-react';
import gsap from 'gsap';
import { Product } from '../../types';
import { ProductCard } from '../products/ProductCard';
import { ProductTableView } from '../products/ProductTableView';
import { animateSquashAndStretch } from '../../utils/animations';

interface CollectionPageProps {
  collectionName: string;
  allProducts: Product[];
  onBack: () => void;
  onSelectProduct: (product: Product) => void;
  onSelectCollection: (name: string) => void;
}

interface CollectionMeta {
  tag: string;
  subtitle: string;
  description: string;
  lore: string;
  accentColor: string;
  gsm: number;
  silhouette: string;
  printTech: string;
  edition: string;
  bgGradient: string;
}

export const COLLECTION_CATALOG: Record<string, CollectionMeta> = {
  'Cyber Toon Glitch': {
    tag: 'SERIES 01 // DROP ATELIER',
    subtitle: 'Distorted Cartoon Pop-Art & Electric Halftones',
    description:
      'Inspired by explosive cartoon character distortion, retro CRT screen scanlines, and high-voltage neon pop splatters.',
    lore:
      'The Cyber Toon Glitch capsule captures the feeling of classic saturday morning animation broadcast across an overclocked cathode ray tube. Every graphic is printed using multi-layered plastisol ink that gives a tactile 3D comic pop texture, set against 460 GSM combed French terry designed to drape with weight and structural boxiness.',
    accentColor: '#FF5722',
    gsm: 460,
    silhouette: 'Oversized Drop-Shoulder Boxy Fit',
    printTech: 'High-Density 3D Silicone & Crack-Resistant Halftone',
    edition: 'Drop Batch // Limited 100 Pieces',
    bgGradient: 'from-[#FF5722]/15 via-white to-[#0096C7]/10',
  },
  'Mecha Bot Evolution': {
    tag: 'SERIES 02 // BATTLE FRAME',
    subtitle: 'Cybernetic Comic Outlines & Reinforced Tactical Heavyweights',
    description:
      'Vibrant robotic cartoon graphics with cybernetic comic outlines, heavy industrial typography, and reflective splatter overlays.',
    lore:
      'Engineered for urban survival, Mecha Bot Evolution fuses classic cartoon mecha styling with battle-ready tactical garments. Features 480 GSM double-faced terry cotton, reinforced Bar-Tack stress points, and metallic comic accents that catch the light under night city neon.',
    accentColor: '#00E5FF',
    gsm: 480,
    silhouette: 'Structured Tactical Silhouette with Articulated Sleeves',
    printTech: 'Reflective Foil & Plastisol Comic Decals',
    edition: 'Atelier Vault Release // 80 Pieces',
    bgGradient: 'from-[#00E5FF]/15 via-white to-[#7C3AED]/10',
  },
  'Rogue Clan Distressed': {
    tag: 'SERIES 03 // VINTAGE REBEL',
    subtitle: 'Acid-Washed Comic Motifs & Raw Hand-Distressed Edges',
    description:
      'Acid washed comic character motifs with vintage distressed finishes, frayed raw hems, and deep sun-faded pigment dyes.',
    lore:
      'Each piece in the Rogue Clan collection undergoes an artisanal 8-hour enzyme and mineral wash, giving the 450 GSM French terry the broken-in drape of a 1990s thrift grail while retaining bulletproof fabric density. The cartoon graphics feature distressed cracking that evolves uniquely with every wear.',
    accentColor: '#FF2E93',
    gsm: 450,
    silhouette: 'Relaxed Vintage Boxy Cut with Dropped Armholes',
    printTech: 'Cracked Ink Waterbase & Hand-Distressed Washes',
    edition: 'Limited Run // 120 Pieces',
    bgGradient: 'from-[#FF2E93]/15 via-white to-amber-500/10',
  },
  'Street Ronin Brush': {
    tag: 'SERIES 04 // INK WARRIOR',
    subtitle: 'Dynamic Comic Brushwork & Ink-Splatter Drips',
    description:
      'Bold cartoon warrior brushstrokes and dynamic ink splatter drips. Asymmetrical hems, tactical pocketing, and 500 GSM armor-grade fabric.',
    lore:
      'Conceived as wearable pop-art calligraphy, Street Ronin Brush translates sweeping comic action lines into heavyweight cotton streetwear. At 500 GSM, this is FashionWekk’s heaviest textile weave, offering rigid architectural contours and deep jet-black pigment with high-contrast character accents.',
    accentColor: '#8B5CF6',
    gsm: 500,
    silhouette: 'Heavy Armor-Grade Wide Silhouette',
    printTech: 'Screenprinted Calligraphic Plastisol with 3D Gloss Emulsion',
    edition: 'Signature Series // 90 Pieces',
    bgGradient: 'from-[#8B5CF6]/15 via-white to-[#FF5722]/10',
  },
  'Chibi Harajuku Splash': {
    tag: 'SERIES 05 // POP GRAFFITI',
    subtitle: 'Playful Chibi Characters with Underground Drip Aesthetics',
    description:
      'Vibrant chibi character illustrations colliding with underground street graffiti drips. Soft 380 GSM breathable combed jersey.',
    lore:
      'An explosion of joyful hyper-color inspired by Tokyo street culture and cartoon graffiti murals. Crafted from tightly spun 380 GSM ring-spun combed cotton, Chibi Harajuku Splash features vibrant multi-color spot printing and custom rubberized cartoon hem tags.',
    accentColor: '#FFD600',
    gsm: 380,
    silhouette: 'Midweight Relaxed Street Silhouette',
    printTech: 'Ultra-Vibrant CMYK Spot Ink with Clear Puff Accent',
    edition: 'Spring Release // 150 Pieces',
    bgGradient: 'from-[#FFD600]/20 via-white to-[#FF2E93]/10',
  },
  'Pixel Quest 8-Bit': {
    tag: 'SERIES 06 // RETRO TOON',
    subtitle: 'Textured Pixel Monsters & 90s Arcade Drip',
    description:
      'Pixelated cartoon monsters with high-density silicone textured prints on heavy 360 GSM drop-shoulder streetwear cut.',
    lore:
      'Bridging the golden era of 16-bit arcade adventures and modern cartoon street style. Every sprite pixel is rendered through micro-embossed silicone ink that raises 1.5mm off the cotton surface, creating a distinctive touchable texture.',
    accentColor: '#00E5FF',
    gsm: 360,
    silhouette: 'Retro Boxy Cut with Ribbed Cuffs',
    printTech: 'Micro-Embossed 3D Silicone & Pixel Print',
    edition: 'Collector Archive // 100 Pieces',
    bgGradient: 'from-[#00E5FF]/15 via-white to-emerald-500/10',
  },
  'Solar Flare Washed': {
    tag: 'SERIES 07 // SUPERCHARGED',
    subtitle: 'Radiant Comic Explosions & Washed Charcoal Foundations',
    description:
      'Radiant yellow and orange comic explosion graphics printed with cracked ink effects on washed charcoal 420 GSM fabric.',
    lore:
      'Drawing energy from comic fight climax frames, Solar Flare Washed features burst graphics with fluorescent halftone gradients. Set against a washed charcoal fabric base that softens bright tones into wearable streetwear perfection.',
    accentColor: '#FF5722',
    gsm: 420,
    silhouette: 'Contemporary Boxy Slouch Cut',
    printTech: 'Discharge Ink with Fluorescent Topcoat',
    edition: 'Limited Run // 110 Pieces',
    bgGradient: 'from-[#FF5722]/20 via-white to-amber-400/15',
  },
  'Synth Wave Sunset': {
    tag: 'SERIES 08 // RETRO WAVE',
    subtitle: 'Magenta & Cyan Pop-Art Cartoon Silhouettes',
    description:
      'Magenta and cyan palm tree pop-art cartoon silhouettes with gradient backprints on relaxed 350 GSM cotton.',
    lore:
      'A romantic retro-futuristic cartoon dreamscape. Bold neon gradients printed using ultra-fine digital sublimation on combed cotton face, framed by custom comic lettering and minimal chest embroidery.',
    accentColor: '#FF2E93',
    gsm: 350,
    silhouette: 'Relaxed Everyday Drop-Shoulder',
    printTech: 'High-Fidelity Digital Gradient & Chest Embroidery',
    edition: 'Summer Capsule // 130 Pieces',
    bgGradient: 'from-[#FF2E93]/15 via-white to-[#00E5FF]/15',
  },
  'Demon Mask Pop Art': {
    tag: 'SERIES 09 // FOLK COMIC',
    subtitle: 'Mythical Cartoon Creatures & Dark Pop Splatters',
    description:
      'Pop-art cartoon horned creature graphics with multi-layered plastisol ink and double-stitched reinforcements at 460 GSM.',
    lore:
      'Reimagining mythological folklore through vivid comic strip inkwork. Features double-layered hood construction, custom chrome aglets, and giant back murals printed with 6-pass screenprinting.',
    accentColor: '#E11D48',
    gsm: 460,
    silhouette: 'Substantial Heavyweight Hooded Cut',
    printTech: '6-Pass Heavy Plastisol & Chrome Embellishments',
    edition: 'Atelier Vault // 95 Pieces',
    bgGradient: 'from-[#E11D48]/15 via-white to-slate-900/10',
  },
  'KhanhBro Signature Drip': {
    tag: 'SERIES 10 // ATELIER FLAGSHIP',
    subtitle: 'The Definitive Cartoon Drip Masterpiece Capsule',
    description:
      'The flagship capsule curated by KhanhBro. Signature 3D cartoon liquid drips, custom character graphics, and ultra-dense 480 GSM French terry.',
    lore:
      'The definitive statement piece of FashionWekk. Conceived and directed personally by KhanhBro, this capsule showcases the signature 3D cartoon drip border and liquid splatter aesthetics in their purest form. Every seam is flatlocked with reinforced contrast thread, stamped with the atelier wax seal.',
    accentColor: '#FF5722',
    gsm: 480,
    silhouette: 'Atelier Tailored Oversized Luxury Streetwear',
    printTech: 'Signature 3D Liquid Drip Silicone & Gold Foil Serial Seal',
    edition: 'KhanhBro Masterpiece Edition // 75 Pieces Worldwide',
    bgGradient: 'from-[#FF5722]/20 via-[#FF2E93]/15 to-white',
  },
};

const ALL_COLLECTION_NAMES = Object.keys(COLLECTION_CATALOG);

export const COLLECTION_HERO_MAP: Record<string, string> = {
  'KhanhBro Signature Drip': '/assets/images/khanhbro_hoodie_sample.jpg',
  'Cyber Toon Glitch': '/assets/images/cyber_toon_glitch.jpg',
  'Mecha Bot Evolution': '/assets/images/mecha_bot_evolution.jpg',
  'Street Ronin Brush': '/assets/images/street_ronin_brush.jpg',
  'Chibi Harajuku Splash': '/assets/images/chibi_harajuku_splash.jpg',
  'Pixel Quest 8-Bit': '/assets/images/pixel_quest_8bit.jpg',
  'Solar Flare Washed': '/assets/images/solar_flare_washed.jpg',
  'Synth Wave Sunset': '/assets/images/synth_wave_sunset.jpg',
  'Demon Mask Pop Art': '/assets/images/demon_mask_popart.jpg',
  'Rogue Clan Distressed': '/assets/images/rogue_clan_distressed.jpg',
};

export const CollectionPage: React.FC<CollectionPageProps> = ({
  collectionName,
  allProducts,
  onBack,
  onSelectProduct,
  onSelectCollection,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [search, setSearch] = useState<string>('');
  const [sortBy, setSortBy] = useState<string>('featured');
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid');

  const heroRef = useRef<HTMLDivElement>(null);

  const meta = COLLECTION_CATALOG[collectionName] || {
    tag: 'CURATED CAPSULE // ATELIER',
    subtitle: 'Exclusive Cartoon Pop-Art Streetwear Drops',
    description:
      'Limited production cartoon streetwear drops engineered with heavyweight cotton textiles and distinctive comic art.',
    lore:
      'Each garment in this capsule is created to bridge contemporary streetwear cuts with dynamic cartoon pop-art graphics. Built with durable heavyweight cotton and hand-inspected details.',
    accentColor: '#FF5722',
    gsm: 450,
    silhouette: 'Boxy Drop-Shoulder Fit',
    printTech: 'High-Density Plastisol Print',
    edition: 'Limited Run Collection',
    bgGradient: 'from-[#FF5722]/15 via-white to-[#0096C7]/10',
  };

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    if (heroRef.current) {
      gsap.fromTo(
        heroRef.current,
        { opacity: 0, y: 25 },
        { opacity: 1, y: 0, duration: 0.6, ease: 'power3.out' }
      );
    }
  }, [collectionName]);

  const collectionProducts = allProducts.filter((p) => {
    const matchesCollection =
      p.collectionName?.toLowerCase().trim() === collectionName.toLowerCase().trim();
    const matchesCategory =
      selectedCategory === 'all' || p.category?.toLowerCase() === selectedCategory.toLowerCase();
    const matchesSearch =
      !search ||
      p.title.toLowerCase().includes(search.toLowerCase()) ||
      p.description.toLowerCase().includes(search.toLowerCase()) ||
      p.gsm.toString().includes(search);
    return matchesCollection && matchesCategory && matchesSearch;
  });

  const sortedProducts = [...collectionProducts].sort((a, b) => {
    if (sortBy === 'price-asc') return a.price - b.price;
    if (sortBy === 'price-desc') return b.price - a.price;
    if (sortBy === 'gsm-desc') return b.gsm - a.gsm;
    if (sortBy === 'rating-desc') return b.rating - a.rating;
    return 0;
  });

  const categoriesInCollection = Array.from(
    new Set(
      allProducts
        .filter((p) => p.collectionName?.toLowerCase().trim() === collectionName.toLowerCase().trim())
        .map((p) => p.category)
    )
  );

  return (
    <div className="mx-auto max-w-7xl px-3 sm:px-6 lg:px-8 py-6 pb-28 sm:pb-8 w-full">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200/80 pb-4 mb-6 sm:mb-8">
        <nav className="flex items-center gap-1.5 text-xs text-slate-500 font-medium">
          <button
            onClick={onBack}
            className="hover:text-slate-900 transition-colors flex items-center gap-1 cursor-pointer"
          >
            <ArrowLeft className="h-3.5 w-3.5" /> All Drops
          </button>
          <ChevronRight className="h-3 w-3 text-slate-400" />
          <span className="text-slate-400">Collections</span>
          <ChevronRight className="h-3 w-3 text-slate-400" />
          <span className="text-slate-900 font-bold truncate max-w-[150px] sm:max-w-none">{collectionName}</span>
        </nav>

        <div className="flex items-center gap-2">
          <button
            onClick={onBack}
            className="rounded-xl bg-white px-3.5 py-1.5 text-xs font-bold text-slate-700 hover:text-slate-900 border border-slate-200 shadow-xs transition-colors cursor-pointer"
          >
            ← Back to Storefront
          </button>
        </div>
      </div>

      <div
        ref={heroRef}
        className={`relative overflow-hidden rounded-3xl bg-gradient-to-br ${meta.bgGradient} p-5 sm:p-10 lg:p-12 border-2 border-slate-900/15 shadow-[6px_6px_0px_#0F172A] mb-8 sm:mb-12`}
      >
        <div
          className="absolute -right-20 -top-20 h-80 w-80 rounded-full blur-3xl opacity-25 pointer-events-none"
          style={{ backgroundColor: meta.accentColor }}
        />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center relative z-10">
          <div className="lg:col-span-8">
            <div className="inline-flex items-center gap-2 rounded-lg bg-slate-900 text-white px-3 py-1 text-[11px] font-mono font-black tracking-widest uppercase mb-4 flex-wrap">
              <span className="h-2 w-2 rounded-full" style={{ backgroundColor: meta.accentColor }} />
              <span>{meta.tag}</span>
              <span className="text-slate-500">•</span>
              <span className="text-[#D4FF00]">{meta.edition}</span>
            </div>

            <h1 className="font-display text-2xl sm:text-4xl lg:text-5xl font-black text-slate-900 tracking-tight leading-tight">
              COLLECTION: <span style={{ color: meta.accentColor }}>{collectionName}</span>
            </h1>

            <p className="mt-2 text-base sm:text-lg font-semibold text-slate-700">
              {meta.subtitle}
            </p>

            <p className="mt-4 text-xs sm:text-sm text-slate-600 max-w-2xl leading-relaxed font-medium">
              {meta.description}
            </p>

            <div className="mt-6 rounded-2xl bg-white/80 backdrop-blur-sm p-4 sm:p-5 border border-slate-200/80 max-w-3xl">
              <div className="flex items-center gap-2 text-xs font-mono font-bold uppercase tracking-wider text-slate-500 mb-1.5">
                <span className="text-[#FF5722] font-black">//</span>
                <span>Creative Director’s Atelier Note</span>
              </div>
              <p className="text-xs text-slate-700 leading-relaxed font-serif italic">
                "{meta.lore}"
              </p>
              <div className="mt-2 flex items-center justify-between text-[11px] font-mono text-slate-500 pt-2 border-t border-slate-200">
                <span>Curated by KhanhBro</span>
                <span className="font-bold text-[#FF5722]">FashionWekk Atelier</span>
              </div>
            </div>

            <div className="mt-8 grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 max-w-3xl">
              <div className="rounded-2xl bg-white p-3.5 border border-slate-200 shadow-xs">
                <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400 block font-bold">
                  Fabric Density
                </span>
                <span className="font-mono text-sm sm:text-base font-black text-slate-900 mt-0.5 block">
                  {meta.gsm} GSM
                </span>
                <span className="text-[10px] text-slate-500">Heavyweight Terry</span>
              </div>

              <div className="rounded-2xl bg-white p-3.5 border border-slate-200 shadow-xs">
                <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400 block font-bold">
                  Silhouette
                </span>
                <span className="text-xs sm:text-xs font-bold text-slate-900 mt-0.5 block line-clamp-1">
                  {meta.silhouette.split(' ')[0]} {meta.silhouette.split(' ')[1]}
                </span>
                <span className="text-[10px] text-slate-500">Boxy Drop Cut</span>
              </div>

              <div className="rounded-2xl bg-white p-3.5 border border-slate-200 shadow-xs">
                <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400 block font-bold">
                  Print Tech
                </span>
                <span className="text-xs sm:text-xs font-bold text-slate-900 mt-0.5 block line-clamp-1">
                  High-Density
                </span>
                <span className="text-[10px] text-slate-500">3D Tactile Ink</span>
              </div>

              <div className="rounded-2xl bg-white p-3.5 border border-slate-200 shadow-xs">
                <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400 block font-bold">
                  Pieces in Drop
                </span>
                <span className="font-mono text-sm sm:text-base font-black text-[#FF5722] mt-0.5 block">
                  {collectionProducts.length} Pieces
                </span>
                <span className="text-[10px] text-slate-500">Vault Available</span>
              </div>
            </div>
          </div>

          <div className="lg:col-span-4 flex justify-center">
            <div className="w-full max-w-xs sm:max-w-sm rounded-3xl bg-white p-4 sm:p-5 border-2 border-slate-900/15 shadow-[6px_6px_0px_#0F172A]">
              <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-100 text-[10px] font-mono font-bold text-slate-500 uppercase">
                <span className="text-[#FF5722] font-black">GRAIL HERO ART</span>
                <span>{meta.edition}</span>
              </div>
              <div className="relative aspect-square w-full overflow-hidden rounded-2xl bg-slate-100 border border-slate-200 select-none">
                <img
                  src={COLLECTION_HERO_MAP[collectionName] || '/assets/images/khanhbro_hoodie_sample.jpg'}
                  alt={`${collectionName} Hero Grail`}
                  width="400"
                  height="400"
                  draggable={false}
                  fetchPriority="high"
                  className="h-full w-full object-cover select-none pointer-events-none"
                />
                <div className="absolute top-2.5 left-2.5 rounded-lg bg-slate-900/90 backdrop-blur-md px-2 py-0.5 text-[10px] font-mono font-bold text-white border border-white/20">
                  {meta.gsm} GSM
                </div>
              </div>
              <div className="mt-3">
                <h4 className="font-display text-sm font-black text-slate-900 line-clamp-1">
                  {collectionName} Flagship Piece
                </h4>
                <p className="text-[10px] text-slate-500 font-mono mt-0.5">
                  100% Proprietary KhanhBro 3D Pop-Art
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="mb-8">
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-mono font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1">
            <Layers className="h-3.5 w-3.5 text-[#0096C7]" /> Switch Capsule Drop:
          </span>
          <span className="text-[11px] font-mono text-slate-400">10 Atelier Series</span>
        </div>

        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
          {ALL_COLLECTION_NAMES.map((name) => {
            const isActive = name.toLowerCase() === collectionName.toLowerCase();
            return (
              <button
                key={name}
                onClick={() => onSelectCollection(name)}
                className={`whitespace-nowrap rounded-xl px-3.5 py-2 text-xs font-bold transition-all cursor-pointer ${
                  isActive
                    ? 'bg-slate-900 text-white shadow-md shadow-slate-900/30 scale-105'
                    : 'bg-white text-slate-700 hover:bg-slate-100 hover:text-slate-900 border border-slate-200/80 shadow-xs'
                }`}
              >
                {name}
              </button>
            );
          })}
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between pb-6 border-b border-slate-200/80 mb-6">
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
          <button
            onClick={() => setSelectedCategory('all')}
            className={`whitespace-nowrap rounded-xl px-3.5 py-1.5 text-xs font-bold transition-all cursor-pointer ${
              selectedCategory === 'all'
                ? 'bg-[#FF5722] text-white shadow-sm'
                : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            All Capsule Pieces ({collectionProducts.length})
          </button>
          {categoriesInCollection.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`whitespace-nowrap rounded-xl px-3.5 py-1.5 text-xs font-bold uppercase transition-all cursor-pointer ${
                selectedCategory === cat
                  ? 'bg-[#FF5722] text-white shadow-sm'
                  : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-3">
          <div className="relative flex-1 sm:w-60">
            <Search className="absolute left-3 top-2.5 h-3.5 w-3.5 text-slate-400" />
            <input
              type="text"
              placeholder="Search in collection..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full rounded-xl bg-white pl-9 pr-3 py-1.5 text-xs text-slate-900 border border-slate-200 shadow-xs focus:border-[#FF5722] focus:outline-none"
            />
          </div>

          <div className="relative flex items-center">
            <SlidersHorizontal className="absolute left-3 h-3.5 w-3.5 text-slate-500 pointer-events-none" />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              aria-label="Sort collection drops"
              className="appearance-none rounded-xl bg-white pl-8 pr-7 py-1.5 text-xs font-semibold text-slate-800 border border-slate-200 shadow-xs focus:border-[#FF5722] focus:outline-none cursor-pointer"
            >
              <option value="featured">Featured Drops</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
              <option value="gsm-desc">Heaviest GSM</option>
              <option value="rating-desc">Highest Rated</option>
            </select>
          </div>

          <div className="flex items-center rounded-xl bg-white p-1 border border-slate-200 shadow-xs">
            <button
              onClick={() => setViewMode('grid')}
              title="Bento Grid"
              className={`rounded-lg p-1.5 transition-colors cursor-pointer ${
                viewMode === 'grid'
                  ? 'bg-[#FF5722] text-white'
                  : 'text-slate-400 hover:text-slate-700'
              }`}
            >
              <LayoutGrid className="h-3.5 w-3.5" />
            </button>
            <button
              onClick={() => setViewMode('table')}
              title="Spec Table"
              className={`rounded-lg p-1.5 transition-colors cursor-pointer ${
                viewMode === 'table'
                  ? 'bg-[#FF5722] text-white'
                  : 'text-slate-400 hover:text-slate-700'
              }`}
            >
              <TableProperties className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>
      </div>

      {sortedProducts.length === 0 ? (
        <div className="my-16 flex flex-col items-center justify-center text-center p-8 rounded-3xl bg-white border-2 border-slate-900/10 shadow-[4px_4px_0px_#0F172A]">
          <PackageOpen className="h-14 w-14 text-slate-400 mb-3" />
          <h3 className="font-display text-lg font-bold text-slate-900">
            No Drops Found in this Capsule View
          </h3>
          <p className="mt-1 text-xs text-slate-500 max-w-sm">
            Try adjusting your search or clearing the category filter to view all pieces in this collection.
          </p>
          <button
            onClick={() => {
              setSelectedCategory('all');
              setSearch('');
            }}
            className="mt-5 rounded-xl bg-[#FF5722] px-5 py-2.5 text-xs font-bold text-white shadow-md hover:opacity-90 transition-all cursor-pointer"
          >
            Show All {collectionName} Pieces
          </button>
        </div>
      ) : viewMode === 'table' ? (
        <ProductTableView
          products={sortedProducts}
          onOpenModal={(p) => onSelectProduct(p)}
        />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 py-2">
          {sortedProducts.map((product) => (
            <ProductCard
              key={product._id}
              product={product}
              onOpenModal={(p) => onSelectProduct(p)}
              onSelectCollection={(col) => onSelectCollection(col)}
            />
          ))}
        </div>
      )}

      <div className="mt-16 rounded-3xl bg-slate-900 text-white p-8 sm:p-10 border-2 border-slate-900 shadow-[6px_6px_0px_#FF5722]">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-1.5 rounded-lg bg-[#FF5722]/20 px-3 py-1 text-xs font-mono font-bold text-[#FF5722] border border-[#FF5722]/30 mb-2">
              <span className="h-1.5 w-1.5 rounded-full bg-[#FF5722]" />
              <span>KHANHBRO ATELIER GUARANTEE</span>
            </div>
            <h3 className="font-display text-xl sm:text-2xl font-black tracking-tight text-white">
              LIMITED PRODUCTION CAPSULE ARCHIVE
            </h3>
            <p className="mt-1 text-xs sm:text-sm text-slate-400 max-w-2xl leading-relaxed">
              Every drop in {collectionName} is manufactured in a single limited run. Once the batch is sold out, designs are archived permanently into the FashionWekk vault with no re-prints.
            </p>
          </div>

          <button
            onClick={onBack}
            className="rounded-2xl bg-[#FF5722] hover:bg-[#FF6E40] px-6 py-3.5 text-xs font-black text-white shadow-lg shadow-[#FF5722]/30 transition-all cursor-pointer flex-shrink-0"
          >
            Explore All 100 Drops →
          </button>
        </div>
      </div>
    </div>
  );
};
