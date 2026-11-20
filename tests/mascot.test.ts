import './helpers/memoryStorage';
import { afterEach, beforeEach, describe, it, expect, vi } from 'vitest';
import { useMascotStore } from '../src/stores/mascotStore';
import type { Product } from '../src/types';
import {
  MascotSlot,
  getMascotSlotForCategory,
  getMascotSlotBadge,
  filterProductsByMascotSlot,
  MASCOT_SLOTS,
} from '../src/features/mascot/mascotLabels';

const makeProduct = (overrides: Partial<Product> = {}): Product => ({
  _id: 'prod_1',
  title: 'Test Item',
  price: 50,
  originalPrice: 50,
  category: 'hoodies',
  description: '',
  images: [],
  colors: [],
  sizes: [],
  gsm: 300,
  stock: 10,
  isFlashSale: false,
  tags: [],
  rating: 5,
  reviewCount: 0,
  ...overrides,
});

describe('mascot store dress-up mechanics', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    useMascotStore.getState().resetMascot();
    useMascotStore.setState({ bouncingSlot: null });
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('starts with every slot empty', () => {
    const { equipped } = useMascotStore.getState();
    expect(equipped).toEqual({ head: null, top: null, bottom: null, accessory: null });
  });

  it('equips a hoodie into the top slot using its category', () => {
    const hoodie = makeProduct({ _id: 'hoodie_1', category: 'hoodies' });
    useMascotStore.getState().equipProduct(hoodie);
    const { equipped } = useMascotStore.getState();
    expect(equipped.top?._id).toBe('hoodie_1');
    expect(equipped.bottom).toBeNull();
  });

  it('prefers an explicit mascot slot over the category', () => {
    const mask = makeProduct({ _id: 'mask_1', category: 'collectibles', mascotSlot: 'head' });
    useMascotStore.getState().equipProduct(mask);
    const { equipped } = useMascotStore.getState();
    expect(equipped.head?._id).toBe('mask_1');
    expect(equipped.accessory).toBeNull();
  });

  it('replaces the item when another one targets the same slot', () => {
    useMascotStore.getState().equipProduct(makeProduct({ _id: 'hoodie_1', category: 'hoodies' }));
    useMascotStore.getState().equipProduct(makeProduct({ _id: 'tee_3', category: 'tees' }));
    expect(useMascotStore.getState().equipped.top?._id).toBe('tee_3');
  });

  it('toggles an item off when the equipped one is selected again', () => {
    const cap = makeProduct({ _id: 'cap_1', category: 'accessories' });
    const hoodie = makeProduct({ _id: 'hoodie_1', category: 'hoodies' });
    useMascotStore.getState().equipProduct(cap);
    useMascotStore.getState().equipProduct(hoodie);
    useMascotStore.getState().equipProduct(cap);
    const { equipped } = useMascotStore.getState();
    expect(equipped.head).toBeNull();
    expect(equipped.top?._id).toBe('hoodie_1');
  });

  it('fills all four slots from different categories', () => {
    const store = useMascotStore.getState();
    store.equipProduct(makeProduct({ _id: 'toy', category: 'collectibles' }));
    store.equipProduct(makeProduct({ _id: 'beanie', category: 'accessories' }));
    store.equipProduct(makeProduct({ _id: 'jacket', category: 'outerwear' }));
    store.equipProduct(makeProduct({ _id: 'cargo', category: 'bottoms' }));
    const { equipped } = useMascotStore.getState();
    expect(equipped.accessory?._id).toBe('toy');
    expect(equipped.head?._id).toBe('beanie');
    expect(equipped.top?._id).toBe('jacket');
    expect(equipped.bottom?._id).toBe('cargo');
  });

  it('marks the slot as bouncing and clears it after the animation window', () => {
    useMascotStore.getState().equipProduct(makeProduct({ category: 'bottoms' }));
    expect(useMascotStore.getState().bouncingSlot).toBe('bottom');
    vi.advanceTimersByTime(600);
    expect(useMascotStore.getState().bouncingSlot).toBeNull();
  });

  it('unequips a single slot without touching the others', () => {
    useMascotStore.getState().equipProduct(makeProduct({ _id: 'hoodie_1', category: 'hoodies' }));
    useMascotStore.getState().equipProduct(makeProduct({ _id: 'cargo', category: 'bottoms' }));
    useMascotStore.getState().unequipSlot('top');
    const { equipped } = useMascotStore.getState();
    expect(equipped.top).toBeNull();
    expect(equipped.bottom?._id).toBe('cargo');
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
