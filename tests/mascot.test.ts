import { describe, it, expect } from 'vitest';
import {
  MascotSlot,
  getMascotSlotForCategory,
  getMascotSlotBadge,
  filterProductsByMascotSlot,
  MASCOT_SLOTS,
} from '../src/features/mascot/mascotLabels';

export interface MascotEquipment {
  head: string | null;
  top: string | null;
  bottom: string | null;
  accessory: string | null;
}

export const equipMascotItem = (
  current: MascotEquipment,
  slot: 'head' | 'top' | 'bottom' | 'accessory',
  assetId: string
): MascotEquipment => {
  if (current[slot] === assetId) {
    return { ...current, [slot]: null };
  }
  return { ...current, [slot]: assetId };
};

describe('mascot dress-up core mechanics', () => {
  it('should start with default empty equipment', () => {
    const defaultMascot: MascotEquipment = {
      head: null,
      top: null,
      bottom: null,
      accessory: null,
    };
    expect(defaultMascot.top).toBeNull();
    expect(defaultMascot.bottom).toBeNull();
  });

  it('should equip a hoodie into top slot', () => {
    const initial: MascotEquipment = {
      head: null,
      top: null,
      bottom: null,
      accessory: null,
    };
    const equipped = equipMascotItem(initial, 'top', 'asset_hoodies_1');
    expect(equipped.top).toBe('asset_hoodies_1');
    expect(equipped.bottom).toBeNull();
  });

  it('should replace equipped item when selecting another in same slot', () => {
    const initial: MascotEquipment = {
      head: null,
      top: 'asset_hoodies_1',
      bottom: null,
      accessory: null,
    };
    const updated = equipMascotItem(initial, 'top', 'asset_tees_3');
    expect(updated.top).toBe('asset_tees_3');
  });

  it('should toggle off if clicking the currently equipped item', () => {
    const initial: MascotEquipment = {
      head: 'asset_accessories_1',
      top: 'asset_hoodies_1',
      bottom: null,
      accessory: null,
    };
    const toggled = equipMascotItem(initial, 'head', 'asset_accessories_1');
    expect(toggled.head).toBeNull();
    expect(toggled.top).toBe('asset_hoodies_1');
  });

  it('should equip 3D pop-art accessories into accessory and head slots', () => {
    let mascot: MascotEquipment = {
      head: null,
      top: null,
      bottom: null,
      accessory: null,
    };
    mascot = equipMascotItem(mascot, 'accessory', '/assets/images/pixel_quest_8bit.jpg');
    mascot = equipMascotItem(mascot, 'head', '/assets/images/demon_mask_popart.jpg');
    mascot = equipMascotItem(mascot, 'top', '/assets/images/khanhbro_hoodie_sample.jpg');
    mascot = equipMascotItem(mascot, 'bottom', '/assets/images/mecha_bot_evolution.jpg');

    expect(mascot.accessory).toBe('/assets/images/pixel_quest_8bit.jpg');
    expect(mascot.head).toBe('/assets/images/demon_mask_popart.jpg');
    expect(mascot.top).toBe('/assets/images/khanhbro_hoodie_sample.jpg');
    expect(mascot.bottom).toBe('/assets/images/mecha_bot_evolution.jpg');
  });
});

describe('mascot slot label resolution and classification', () => {
  it('should resolve explicit mascot slot if present', () => {
    expect(getMascotSlotForCategory('hoodies', 'top')).toBe('top');
    expect(getMascotSlotForCategory('collectibles', 'accessory')).toBe('accessory');
    expect(getMascotSlotForCategory('accessories', 'head')).toBe('head');
  });

  it('should derive mascot slot from product category when explicit slot is missing or none', () => {
    expect(getMascotSlotForCategory('hoodies')).toBe('top');
    expect(getMascotSlotForCategory('tees')).toBe('top');
    expect(getMascotSlotForCategory('outerwear')).toBe('top');
    expect(getMascotSlotForCategory('bottoms')).toBe('bottom');
    expect(getMascotSlotForCategory('accessories')).toBe('head');
    expect(getMascotSlotForCategory('collectibles')).toBe('accessory');
  });

  it('should provide formatted badge text and styling for all 4 slots', () => {
    expect(getMascotSlotBadge('top').label).toBe('Tops');
    expect(getMascotSlotBadge('bottom').label).toBe('Bottoms');
    expect(getMascotSlotBadge('head').label).toBe('Headwear');
    expect(getMascotSlotBadge('accessory').label).toBe('Accessories');

    expect(MASCOT_SLOTS).toHaveLength(4);
  });

  it('should filter an array of products by mascot slot', () => {
    const mockProducts = [
      { _id: '1', title: 'Hoodie', category: 'hoodies', mascotSlot: 'top' },
      { _id: '2', title: 'Cargo', category: 'bottoms', mascotSlot: 'bottom' },
      { _id: '3', title: 'Beanie', category: 'accessories', mascotSlot: 'head' },
      { _id: '4', title: 'Art Toy', category: 'collectibles', mascotSlot: 'accessory' },
      { _id: '5', title: 'Tee', category: 'tees', mascotSlot: 'top' },
    ] as any[];

    expect(filterProductsByMascotSlot(mockProducts, 'all')).toHaveLength(5);
    expect(filterProductsByMascotSlot(mockProducts, 'top')).toHaveLength(2);
    expect(filterProductsByMascotSlot(mockProducts, 'bottom')).toHaveLength(1);
    expect(filterProductsByMascotSlot(mockProducts, 'head')).toHaveLength(1);
    expect(filterProductsByMascotSlot(mockProducts, 'accessory')).toHaveLength(1);
  });
});

describe('atelier wardrobe presets validation', () => {
  it('should include authentic items across all 4 mascot categories', async () => {
    const { ATELIER_WARDROBE_PRESETS } = await import('../src/features/mascot/MascotDressUpDrawer');
    expect(ATELIER_WARDROBE_PRESETS.length).toBeGreaterThanOrEqual(30);

    const tops = ATELIER_WARDROBE_PRESETS.filter((p) => p.mascotSlot === 'top');
    const bottoms = ATELIER_WARDROBE_PRESETS.filter((p) => p.mascotSlot === 'bottom');
    const headwear = ATELIER_WARDROBE_PRESETS.filter((p) => p.mascotSlot === 'head');
    const accessories = ATELIER_WARDROBE_PRESETS.filter((p) => p.mascotSlot === 'accessory');

    expect(tops.length).toBeGreaterThanOrEqual(10);
    expect(bottoms.length).toBeGreaterThanOrEqual(6);
    expect(headwear.length).toBeGreaterThanOrEqual(6);
    expect(accessories.length).toBeGreaterThanOrEqual(10);
  });

  it('should ensure all wardrobe preset images are served via Cloudinary CDN with f_auto,q_auto', async () => {
    const { ATELIER_WARDROBE_PRESETS } = await import('../src/features/mascot/MascotDressUpDrawer');
    for (const preset of ATELIER_WARDROBE_PRESETS) {
      expect(preset.images[0]).toContain('res.cloudinary.com');
      expect(preset.images[0]).toContain('f_auto,q_auto');
      expect(preset.images[0]).not.toContain('unsplash.com');
      expect(preset.price).toBeGreaterThan(0);
    }
  });
});
