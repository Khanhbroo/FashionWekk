import React, { useRef, useEffect } from 'react';
import { X, Sun, Moon, Palette, Check, Sparkles } from 'lucide-react';
import { useThemeStore, GRADIENT_PRESETS, GradientPresetId, ThemeMode } from '../../stores/themeStore';
import { useSoundFx } from '../../hooks/useSoundFx';
import { animateModalOpen, animateModalClose, useBodyScrollLock } from '../../utils/animations';

export const ThemeCustomizerModal: React.FC = () => {
  const {
    mode,
    gradientId,
    isCustomizerOpen,
    setMode,
    setGradientId,
    closeCustomizer,
  } = useThemeStore();

  const { playPop, playEquip } = useSoundFx();

  useBodyScrollLock(isCustomizerOpen);

  const modalRef = useRef<HTMLDivElement>(null);
  const backdropRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isCustomizerOpen && modalRef.current && backdropRef.current) {
      animateModalOpen(modalRef.current, backdropRef.current);
    }
  }, [isCustomizerOpen]);

  if (!isCustomizerOpen) return null;

  const handleClose = () => {
    if (modalRef.current && backdropRef.current) {
      animateModalClose(modalRef.current, backdropRef.current, closeCustomizer);
    } else {
      closeCustomizer();
    }
  };

  const handleModeChange = (newMode: ThemeMode) => {
    setMode(newMode);
    playPop();
  };

  const handlePresetSelect = (id: GradientPresetId) => {
    setGradientId(id);
    playEquip();
  };

  return (
    <div
      ref={backdropRef}
      onClick={handleClose}
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-[#0A0A0C]/75 backdrop-blur-md select-none"
    >
      <div
        ref={modalRef}
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-md bg-white dark:bg-[#0E121B] border-2 sm:border-3 border-[#0A0A0C] dark:border-white/20 shadow-[10px_10px_0px_#0A0A0C] dark:shadow-[10px_10px_0px_rgba(212,255,0,0.5)] overflow-hidden text-[#0A0A0C] dark:text-white max-h-[92dvh] overflow-y-auto"
      >
        {/* Top Rim Accent */}
        <div className="h-1.5 w-full bg-[#D4FF00] border-b border-[#0A0A0C] dark:border-white/20" />

        {/* Close Button */}
        <button
          onClick={handleClose}
          aria-label="Close theme customizer"
          className="absolute right-3.5 top-3.5 z-20 flex h-8 w-8 items-center justify-center bg-white dark:bg-[#141A26] hover:bg-[#D4FF00] hover:text-black text-black dark:text-white border border-[#0A0A0C] dark:border-white/20 shadow-xs transition-colors cursor-pointer"
        >
          <X className="h-4 w-4" />
        </button>

        {/* Header */}
        <div className="px-5 sm:px-6 pt-5 pb-3 border-b border-[#0A0A0C]/15 dark:border-white/10">
          <div className="inline-flex items-center gap-1.5 bg-[#0A0A0C] text-[#D4FF00] px-2.5 py-0.5 text-[10px] font-mono font-black uppercase tracking-widest border border-black/30 mb-2">
            <Palette className="h-3 w-3" />
            <span>FW ATELIER // ATMOSPHERE ENGINE</span>
          </div>

          <h3 className="font-display text-xl sm:text-2xl font-black italic uppercase tracking-tight text-[#0A0A0C] dark:text-white leading-none">
            DISPLAY & GRADIENT THEMES
          </h3>

          <p className="mt-1.5 text-xs text-slate-600 dark:text-slate-400 font-medium">
            Personalize your atelier browsing experience with dark mode and curated Y2K ambient gradients.
          </p>
        </div>

        <div className="p-5 sm:p-6 space-y-6">
          {/* Mode Switcher: Light vs Dark */}
          <div>
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 block mb-2.5">
              1. Base Lighting Mode:
            </span>

            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => handleModeChange('light')}
                className={`flex items-center justify-center gap-2 p-3 text-xs font-mono font-black uppercase tracking-wider border-2 transition-all cursor-pointer ${
                  mode === 'light'
                    ? 'bg-[#0A0A0C] text-[#D4FF00] border-[#0A0A0C] shadow-[4px_4px_0px_#0A0A0C]'
                    : 'bg-white dark:bg-[#141A26] text-slate-700 dark:text-slate-300 border-slate-300 dark:border-slate-700 hover:border-black'
                }`}
              >
                <Sun className="h-4 w-4" />
                <span>LIGHT MODE</span>
                {mode === 'light' && <Check className="h-3.5 w-3.5 stroke-[3] ml-auto" />}
              </button>

              <button
                type="button"
                onClick={() => handleModeChange('dark')}
                className={`flex items-center justify-center gap-2 p-3 text-xs font-mono font-black uppercase tracking-wider border-2 transition-all cursor-pointer ${
                  mode === 'dark'
                    ? 'bg-[#D4FF00] text-black border-[#0A0A0C] shadow-[4px_4px_0px_rgba(212,255,0,0.6)]'
                    : 'bg-white dark:bg-[#141A26] text-slate-700 dark:text-slate-300 border-slate-300 dark:border-slate-700 hover:border-black'
                }`}
              >
                <Moon className="h-4 w-4" />
                <span>DARK MODE</span>
                {mode === 'dark' && <Check className="h-3.5 w-3.5 stroke-[3] ml-auto" />}
              </button>
            </div>
          </div>

          {/* Gradient Presets Selector */}
          <div>
            <div className="flex items-center justify-between mb-2.5">
              <span className="text-xs font-mono font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                2. Horizon Gradient Presets:
              </span>
              <span className="text-[11px] font-mono text-slate-400">
                {GRADIENT_PRESETS.length} Curated Atmospheres
              </span>
            </div>

            <div className="space-y-2.5">
              {GRADIENT_PRESETS.map((preset) => {
                const isSelected = gradientId === preset.id;
                const activeGradString = mode === 'dark' ? preset.darkGradient : preset.lightGradient;

                return (
                  <button
                    key={preset.id}
                    type="button"
                    onClick={() => handlePresetSelect(preset.id)}
                    className={`w-full flex items-center justify-between p-3 border-2 transition-all cursor-pointer text-left ${
                      isSelected
                        ? 'border-[#0A0A0C] dark:border-[#D4FF00] bg-slate-50 dark:bg-[#141A26] shadow-[4px_4px_0px_#0A0A0C] dark:shadow-[4px_4px_0px_rgba(212,255,0,0.5)]'
                        : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0E121B] hover:border-slate-400 dark:hover:border-slate-600'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      {/* Gradient Preview Swatch */}
                      <div
                        className="h-10 w-10 flex-shrink-0 rounded-lg border border-[#0A0A0C]/20 dark:border-white/20 shadow-xs"
                        style={{ background: activeGradString }}
                      />

                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-xs font-black uppercase text-[#0A0A0C] dark:text-white">
                            {preset.name}
                          </span>
                          {isSelected && (
                            <span className="rounded bg-[#D4FF00] text-black px-1.5 py-0.2 text-[9px] font-mono font-black uppercase">
                              Active
                            </span>
                          )}
                        </div>
                        <p className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">
                          {preset.subtitle}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-1.5 pl-2">
                      <div
                        className="h-3 w-3 rounded-full border border-black/20"
                        style={{ backgroundColor: preset.previewColors[0] }}
                      />
                      <div
                        className="h-3 w-3 rounded-full border border-black/20"
                        style={{ backgroundColor: preset.previewColors[1] }}
                      />
                      <div
                        className="h-3 w-3 rounded-full border border-black/20"
                        style={{ backgroundColor: preset.previewColors[2] }}
                      />
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Footer info & Done Button */}
        <div className="p-5 sm:p-6 pt-2 border-t border-[#0A0A0C]/15 dark:border-white/10">
          <button
            type="button"
            onClick={handleClose}
            className="w-full lime-gradient-btn py-3 text-xs font-mono font-black uppercase tracking-widest shadow-md cursor-pointer"
          >
            CONFIRM ATMOSPHERE
          </button>
        </div>
      </div>
    </div>
  );
};
