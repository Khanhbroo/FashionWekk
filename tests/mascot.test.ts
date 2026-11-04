import { describe, it, expect } from 'vitest';

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

describe('mascot dress-up', () => {
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
