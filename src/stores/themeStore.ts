import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type ThemeMode = 'light' | 'dark';

export type GradientPresetId =
  | 'cyber-sky'
  | 'acid-volt'
  | 'liquid-chrome'
  | 'sunset-harajuku'
  | 'onyx-nocturne';

export interface GradientPreset {
  id: GradientPresetId;
  name: string;
  subtitle: string;
  lightGradient: string;
  darkGradient: string;
  accentColor: string;
  previewColors: [string, string, string];
}

export const GRADIENT_PRESETS: GradientPreset[] = [
  {
    id: 'cyber-sky',
    name: 'Y2K Cyber Sky',
    subtitle: 'Classic Ethereal Cloud Horizon',
    lightGradient: 'linear-gradient(180deg, #B0DCFB 0%, #CCE5FC 30%, #E4F1FD 65%, #F4F8FD 100%)',
    darkGradient: 'linear-gradient(180deg, #060B12 0%, #0A1422 35%, #0E1D31 70%, #080D14 100%)',
    accentColor: '#D4FF00',
    previewColors: ['#B0DCFB', '#E4F1FD', '#0A1422'],
  },
  {
    id: 'acid-volt',
    name: 'Acid Volt Horizon',
    subtitle: 'Electric Neon Lime Mist',
    lightGradient: 'linear-gradient(180deg, #CEF5D6 0%, #E2F9DE 35%, #EDFCEB 70%, #F5FDF4 100%)',
    darkGradient: 'linear-gradient(180deg, #050E07 0%, #09190D 35%, #0D2413 70%, #060E08 100%)',
    accentColor: '#D4FF00',
    previewColors: ['#CEF5D6', '#D4FF00', '#09190D'],
  },
  {
    id: 'liquid-chrome',
    name: 'Liquid Chrome Silver',
    subtitle: 'Industrial Raw Metallic Streetwear',
    lightGradient: 'linear-gradient(180deg, #C5D0DC 0%, #D8E0EA 35%, #E8EEF5 70%, #F4F6F9 100%)',
    darkGradient: 'linear-gradient(180deg, #090B0E 0%, #111419 35%, #181D24 70%, #0A0C10 100%)',
    accentColor: '#FFFFFF',
    previewColors: ['#C5D0DC', '#E8EEF5', '#111419'],
  },
  {
    id: 'sunset-harajuku',
    name: 'Harajuku Sunset Drip',
    subtitle: 'Warm Cyber Pop Coral & Twilight',
    lightGradient: 'linear-gradient(180deg, #FCD5CE 0%, #FDE4DF 35%, #FEF0EC 70%, #FFF8F6 100%)',
    darkGradient: 'linear-gradient(180deg, #14070A 0%, #200B10 35%, #2B0F16 70%, #100608 100%)',
    accentColor: '#FF5722',
    previewColors: ['#FCD5CE', '#FF5722', '#200B10'],
  },
  {
    id: 'onyx-nocturne',
    name: 'Onyx Cyber Void',
    subtitle: 'Deep Midnight Streetwear Atelier',
    lightGradient: 'linear-gradient(180deg, #DCE2E8 0%, #EBF0F5 40%, #F7FAFC 100%)',
    darkGradient: 'linear-gradient(180deg, #050507 0%, #09090D 40%, #0E0E14 100%)',
    accentColor: '#D4FF00',
    previewColors: ['#DCE2E8', '#050507', '#D4FF00'],
  },
];

interface ThemeState {
  mode: ThemeMode;
  gradientId: GradientPresetId;
  isCustomizerOpen: boolean;
  setMode: (mode: ThemeMode) => void;
  toggleMode: () => void;
  setGradientId: (id: GradientPresetId) => void;
  openCustomizer: () => void;
  closeCustomizer: () => void;
  getActiveGradient: () => string;
}

export const applyThemeToDOM = (mode: ThemeMode, gradientId: GradientPresetId) => {
  const root = document.documentElement;
  if (mode === 'dark') {
    root.classList.add('dark');
  } else {
    root.classList.remove('dark');
  }

  const preset = GRADIENT_PRESETS.find((p) => p.id === gradientId) || GRADIENT_PRESETS[0];
  const activeGradient = mode === 'dark' ? preset.darkGradient : preset.lightGradient;
  root.style.setProperty('--active-gradient', activeGradient);
  document.body.style.background = activeGradient;
};

export const useThemeStore = create<ThemeState>()(
  persist(
    (set, get) => ({
      mode: 'light',
      gradientId: 'cyber-sky',
      isCustomizerOpen: false,

      setMode: (mode) => {
        set({ mode });
        applyThemeToDOM(mode, get().gradientId);
      },

      toggleMode: () => {
        const nextMode = get().mode === 'light' ? 'dark' : 'light';
        set({ mode: nextMode });
        applyThemeToDOM(nextMode, get().gradientId);
      },

      setGradientId: (gradientId) => {
        set({ gradientId });
        applyThemeToDOM(get().mode, gradientId);
      },

      openCustomizer: () => set({ isCustomizerOpen: true }),
      closeCustomizer: () => set({ isCustomizerOpen: false }),

      getActiveGradient: () => {
        const { mode, gradientId } = get();
        const preset = GRADIENT_PRESETS.find((p) => p.id === gradientId) || GRADIENT_PRESETS[0];
        return mode === 'dark' ? preset.darkGradient : preset.lightGradient;
      },
    }),
    {
      name: 'fashionwekk-theme-storage',
      onRehydrateStorage: () => (state) => {
        if (state) {
          applyThemeToDOM(state.mode, state.gradientId);
        }
      },
    }
  )
);
