import { Product } from '../../types';

export type MascotSlot = 'top' | 'bottom' | 'head' | 'accessory' | 'none';

export interface MascotSlotMetadata {
  id: 'top' | 'bottom' | 'head' | 'accessory';
  label: string;
  badgeText: string;
  shortTag: string;
  icon: string;
  description: string;
  accentColor: string;
  bgClass: string;
  borderClass: string;
  textClass: string;
}

// Complete slot registry mapping human readable labels and styling
export const MASCOT_SLOT_CONFIG: Record<'top' | 'bottom' | 'head' | 'accessory', MascotSlotMetadata> = {
  top: {
    id: 'top',
    label: 'Tops',
    badgeText: 'Tops',
    shortTag: 'TOP',
    icon: '👕',
    description: 'Heavyweight hoodies, boxy graphic tees, and streetwear outerwear',
    accentColor: '#D4FF00',
    bgClass: 'bg-[#D4FF00]/15',
    borderClass: 'border-[#D4FF00]',
    textClass: 'text-[#0A0A0C]',
  },
  bottom: {
    id: 'bottom',
    label: 'Bottoms',
    badgeText: 'Bottoms',
    shortTag: 'BTM',
    icon: '👖',
    description: 'Tactical cargo pants, distressed denim, and parachute track shorts',
    accentColor: '#00E5FF',
    bgClass: 'bg-[#00E5FF]/15',
    borderClass: 'border-[#00E5FF]',
    textClass: 'text-[#0A0A0C]',
  },
  head: {
    id: 'head',
    label: 'Headwear',
    badgeText: 'Headwear',
    shortTag: 'HEAD',
    icon: '🧢',
    description: 'Heavy ribbed beanies, 5-panel street caps, and demon oni masks',
    accentColor: '#FF5722',
    bgClass: 'bg-[#FF5722]/15',
    borderClass: 'border-[#FF5722]',
    textClass: 'text-[#0A0A0C]',
  },
  accessory: {
    id: 'accessory',
    label: 'Accessories',
    badgeText: 'Accessories',
    shortTag: 'ACC',
    icon: '💎',
    description: 'Art toy figures, floating hologram orbs, titanium medals, and skate decks',
    accentColor: '#A855F7',
    bgClass: 'bg-[#A855F7]/15',
    borderClass: 'border-[#A855F7]',
    textClass: 'text-[#0A0A0C]',
  },
};

// Array of all 4 slots for tabs, filter chips, and selector controls
export const MASCOT_SLOTS = [
  MASCOT_SLOT_CONFIG.top,
  MASCOT_SLOT_CONFIG.bottom,
  MASCOT_SLOT_CONFIG.head,
  MASCOT_SLOT_CONFIG.accessory,
];

// Determine the mascot slot from explicit product attribute or category inference
export function getMascotSlotForCategory(category: string, explicitSlot?: string): MascotSlot {
  if (explicitSlot && explicitSlot !== 'none') {
    return explicitSlot as MascotSlot;
  }

  const normalized = (category || '').toLowerCase();
  if (normalized === 'hoodies' || normalized === 'tees' || normalized === 'outerwear') {
    return 'top';
  }
  if (normalized === 'bottoms') {
    return 'bottom';
  }
  if (normalized === 'accessories') {
    return 'head';
  }
  if (normalized === 'collectibles') {
    return 'accessory';
  }

  return 'none';
}

// Retrieve formatted display badge data with safe fallback for unknown slots
export function getMascotSlotBadge(slot: string): MascotSlotMetadata {
  const target = (slot || '').toLowerCase();
  if (target in MASCOT_SLOT_CONFIG) {
    return MASCOT_SLOT_CONFIG[target as keyof typeof MASCOT_SLOT_CONFIG];
  }
  return MASCOT_SLOT_CONFIG.top;
}

// Filter product list matching specific mascot wear slot
export function filterProductsByMascotSlot(products: Product[], slot: string): Product[] {
  if (!slot || slot === 'all') {
    return products;
  }
  return products.filter((p) => {
    const itemSlot = getMascotSlotForCategory(p.category, p.mascotSlot);
    return itemSlot === slot;
  });
}
