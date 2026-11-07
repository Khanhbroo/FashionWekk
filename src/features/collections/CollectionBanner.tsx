import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';

interface CollectionBannerProps {
  collection: string;
  onClear: () => void;
  onExploreCollection?: (collection: string) => void;
}

const COLLECTION_STORIES: Record<
  string,
  { tag: string; description: string; accentColor: string; gsm: number }
> = {
  'Cyber Toon Glitch': {
    tag: 'POP GLITCH // SERIES 01',
    description:
      'Inspired by explosive cartoon character distortion and neon pop splatters. Heavyweight 460 GSM combed French terry with distressed wash and high-definition comic prints.',
    accentColor: '#FF5722',
    gsm: 460,
  },
  'Mecha Bot Evolution': {
    tag: 'FUTURISTIC ROBOTIC TOON',
    description:
      'Vibrant robotic cartoon graphics with cybernetic comic outlines. Engineered with 480 GSM battle-ready cotton and reflective splatter overlays.',
    accentColor: '#00E5FF',
    gsm: 480,
  },
  'Rogue Clan Distressed': {
    tag: 'VINTAGE CARTOON REBEL',
    description:
      'Acid washed comic character motifs with vintage distressed finishes. Crafted from 450 GSM pure combed terry cotton for an effortless boxy fit.',
    accentColor: '#FF2E93',
    gsm: 450,
  },
  'Street Ronin Brush': {
    tag: 'INK SPLATTER & STREETWEAR',
    description:
      'Bold cartoon warrior brushstrokes and dynamic ink splatter drips. Asymmetrical hems, tactical pocketing, and 500 GSM armor-grade fabric.',
    accentColor: '#8B5CF6',
    gsm: 500,
  },
  'Chibi Harajuku Splash': {
    tag: 'KAWAII MEETS POP GRAFFITI',
    description:
      'Vibrant chibi character illustrations colliding with underground street graffiti drips. Soft 380 GSM breathable combed jersey.',
    accentColor: '#FFD600',
    gsm: 380,
  },
  'Pixel Quest 8-Bit': {
    tag: 'RETRO GAMING CARTOON',
    description:
      'Pixelated cartoon monsters with high-density silicone textured prints. Heavy 360 GSM drop-shoulder streetwear cut.',
    accentColor: '#00E5FF',
    gsm: 360,
  },
  'Solar Flare Washed': {
    tag: 'SUPERCHARGED CARTOON KI',
    description:
      'Radiant yellow and orange comic explosion graphics printed with cracked ink effects on washed charcoal 420 GSM fabric.',
    accentColor: '#FF5722',
    gsm: 420,
  },
  'Synth Wave Sunset': {
    tag: 'RETRO SYNTH CARTOON DRIFTER',
    description:
      'Magenta and cyan palm tree pop-art cartoon silhouettes with gradient backprints on relaxed 350 GSM cotton.',
    accentColor: '#FF2E93',
    gsm: 350,
  },
  'Demon Mask Pop Art': {
    tag: 'COMIC MONSTER FOLKLORE',
    description:
      'Pop-art cartoon horned creature graphics with multi-layered plastisol ink and double-stitched reinforcements at 460 GSM.',
    accentColor: '#E11D48',
    gsm: 460,
  },
  'KhanhBro Signature Drip': {
    tag: 'EXCLUSIVE ATELIER CAPSULE',
    description:
      'The flagship capsule curated by KhanhBro. Signature 3D cartoon liquid drips, custom character graphics, and ultra-dense 480 GSM French terry.',
    accentColor: '#FF5722',
    gsm: 480,
  },
};

const COLLECTION_HERO_MAP: Record<string, string> = {
  'KhanhBro Signature Drip': 'https://res.cloudinary.com/dptpb60p7/image/upload/f_auto,q_auto/fashionwekk/masterpieces/khanhbro_hero_signature_drip.jpg',
  'Cyber Toon Glitch': 'https://res.cloudinary.com/dptpb60p7/image/upload/f_auto,q_auto/fashionwekk/masterpieces/cyber_toon_glitch_hero.jpg',
  'Mecha Bot Evolution': 'https://res.cloudinary.com/dptpb60p7/image/upload/f_auto,q_auto/fashionwekk/masterpieces/mecha_bot_evolution.jpg',
  'Street Ronin Brush': 'https://res.cloudinary.com/dptpb60p7/image/upload/f_auto,q_auto/fashionwekk/masterpieces/street_ronin_brush.jpg',
  'Chibi Harajuku Splash': 'https://res.cloudinary.com/dptpb60p7/image/upload/f_auto,q_auto/fashionwekk/masterpieces/chibi_harajuku_splash.jpg',
  'Pixel Quest 8-Bit': 'https://res.cloudinary.com/dptpb60p7/image/upload/f_auto,q_auto/fashionwekk/masterpieces/pixel_quest_8bit.jpg',
  'Solar Flare Washed': 'https://res.cloudinary.com/dptpb60p7/image/upload/f_auto,q_auto/fashionwekk/masterpieces/solar_flare_washed.jpg',
  'Synth Wave Sunset': 'https://res.cloudinary.com/dptpb60p7/image/upload/f_auto,q_auto/fashionwekk/masterpieces/synth_wave_sunset.jpg',
  'Demon Mask Pop Art': 'https://res.cloudinary.com/dptpb60p7/image/upload/f_auto,q_auto/fashionwekk/masterpieces/demon_mask_popart.jpg',
  'Rogue Clan Distressed': 'https://res.cloudinary.com/dptpb60p7/image/upload/f_auto,q_auto/fashionwekk/masterpieces/rogue_clan_distressed.jpg',
};

export const CollectionBanner: React.FC<CollectionBannerProps> = ({
  collection,
  onClear,
  onExploreCollection,
}) => {
  const bannerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (bannerRef.current && collection !== 'all') {
      gsap.fromTo(
        bannerRef.current,
        { opacity: 0, y: -15, scale: 0.98 },
        { opacity: 1, y: 0, scale: 1, duration: 0.45, ease: 'back.out(1.4)' }
      );
    }
  }, [collection]);

  if (collection === 'all') return null;

  const story = COLLECTION_STORIES[collection] || {
    tag: 'CAPSULE DROP COLLECTION',
    description:
      'Exclusive limited edition cartoon streetwear drop curated for the FashionWekk collector atelier.',
    accentColor: '#FF5722',
    gsm: 450,
  };

  return (
    <div
      ref={bannerRef}
      className="relative mb-6 overflow-hidden bg-white p-6 border-2 border-[#0A0A0C] shadow-[6px_6px_0px_#0A0A0C]"
    >
      <div
        className="absolute -right-10 -top-10 h-40 w-40 rounded-full blur-3xl opacity-15 pointer-events-none"
        style={{ backgroundColor: story.accentColor }}
      />

      <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          {COLLECTION_HERO_MAP[collection] && (
            <div className="relative h-16 w-16 sm:h-20 sm:w-20 flex-shrink-0 overflow-hidden rounded-2xl border-2 border-slate-900/15 shadow-sm bg-slate-100 select-none">
              <img
                src={COLLECTION_HERO_MAP[collection]}
                alt={`${collection} Hero`}
                width="80"
                height="80"
                draggable={false}
                className="h-full w-full object-cover select-none pointer-events-none"
              />
            </div>
          )}
          <div>
            <div className="inline-flex items-center gap-1.5 rounded-lg bg-slate-900 text-white px-2.5 py-1 text-[10px] font-mono font-black tracking-widest uppercase mb-2">
              <span className="h-1.5 w-1.5 rounded-full" style={{ backgroundColor: story.accentColor }} />
              <span>{story.tag}</span>
            </div>

            <h3 className="font-display text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
              COLLECTION: <span style={{ color: story.accentColor }}>{collection}</span>
            </h3>

            <p className="mt-1 text-xs text-slate-600 max-w-2xl leading-relaxed font-medium">
              {story.description}
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <div className="rounded-2xl bg-slate-50 px-4 py-2 border border-slate-200 text-center shadow-sm">
            <span className="text-[11px] uppercase font-bold text-slate-500 block">Fabric Weight</span>
            <span className="font-mono text-sm font-bold text-slate-900">{story.gsm} GSM Heavyweight</span>
          </div>

          {onExploreCollection && (
            <button
              onClick={() => onExploreCollection(collection)}
              className="rounded-xl bg-[#FF5722] hover:bg-[#FF6E40] px-4 py-2.5 text-xs font-bold text-white transition-all shadow-md shadow-[#FF5722]/25 cursor-pointer"
            >
              Explore Collection Page →
            </button>
          )}

          <button
            onClick={onClear}
            className="rounded-xl bg-slate-900 hover:bg-slate-800 px-4 py-2.5 text-xs font-bold text-white transition-colors shadow-sm cursor-pointer"
          >
            Show All Drops
          </button>
        </div>
      </div>
    </div>
  );
};
