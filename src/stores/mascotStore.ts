import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Product } from '../types';

interface MascotState {
  equipped: {
    head: Product | null;
    top: Product | null;
    bottom: Product | null;
    accessory: Product | null;
  };
  mood: 'hype' | 'chill' | 'cyber' | 'battle';
  isStudioOpen: boolean;
  bouncingSlot: string | null;

  equipProduct: (product: Product) => void;
  unequipSlot: (slot: 'head' | 'top' | 'bottom' | 'accessory') => void;
  resetMascot: () => void;
  setMood: (mood: 'hype' | 'chill' | 'cyber' | 'battle') => void;
  toggleStudio: () => void;
  openStudio: () => void;
  closeStudio: () => void;
}

export const useMascotStore = create<MascotState>()(
  persist(
    (set, get) => ({
      equipped: {
        head: null,
        top: null,
        bottom: null,
        accessory: null,
      },
      mood: 'hype',
      isStudioOpen: false,
      bouncingSlot: null,

      equipProduct: (product: Product) => {
        let slot: 'head' | 'top' | 'bottom' | 'accessory' | null = null;
        if (product.mascotSlot && product.mascotSlot !== 'none') {
          slot = product.mascotSlot;
        } else if (product.category === 'hoodies' || product.category === 'tees' || product.category === 'outerwear') {
          slot = 'top';
        } else if (product.category === 'bottoms') {
          slot = 'bottom';
        } else if (product.category === 'accessories') {
          slot = 'head';
        } else if (product.category === 'collectibles') {
          slot = 'accessory';
        }

        if (!slot) return;

        const currentSlotItem = get().equipped[slot];
        if (currentSlotItem?._id === product._id) {
          set({
            equipped: { ...get().equipped, [slot]: null },
          });
          return;
        }

        set({
          equipped: { ...get().equipped, [slot]: product },
          bouncingSlot: slot,
        });

        setTimeout(() => {
          set({ bouncingSlot: null });
        }, 600);
      },

      unequipSlot: (slot) => {
        set({
          equipped: { ...get().equipped, [slot]: null },
        });
      },

      resetMascot: () => {
        set({
          equipped: { head: null, top: null, bottom: null, accessory: null },
        });
      },

      setMood: (mood) => set({ mood }),
      toggleStudio: () => set({ isStudioOpen: !get().isStudioOpen }),
      openStudio: () => set({ isStudioOpen: true }),
      closeStudio: () => set({ isStudioOpen: false }),
    }),
    {
      name: 'fashionwekk-mascot-storage',
    }
  )
);
