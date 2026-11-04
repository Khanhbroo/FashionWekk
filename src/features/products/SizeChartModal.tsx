import React, { useEffect, useRef } from 'react';
import { X, Ruler, Check } from 'lucide-react';
import { animateModalOpen, animateModalClose, useBodyScrollLock } from '../../utils/animations';

interface SizeChartModalProps {
  isOpen: boolean;
  onClose: () => void;
  category: string;
}

export const SizeChartModal: React.FC<SizeChartModalProps> = ({
  isOpen,
  onClose,
  category,
}) => {
  useBodyScrollLock(isOpen);

  const modalRef = useRef<HTMLDivElement>(null);
  const backdropRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen && modalRef.current && backdropRef.current) {
      animateModalOpen(modalRef.current, backdropRef.current);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleClose = () => {
    if (modalRef.current && backdropRef.current) {
      animateModalClose(modalRef.current, backdropRef.current, onClose);
    } else {
      onClose();
    }
  };

  return (
    <div
      ref={backdropRef}
      onClick={handleClose}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm"
    >
      <div
        ref={modalRef}
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-xl rounded-3xl bg-white p-5 sm:p-6 border-2 border-slate-900/15 shadow-[8px_8px_0px_#0F172A] text-slate-900 max-h-[92dvh] overflow-y-auto"
      >
        <button
          onClick={handleClose}
          className="absolute right-4 top-4 rounded-xl bg-slate-100 p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-200 transition-colors"
        >
          <X className="h-5 w-5" />
        </button>

        <div className="flex items-center gap-2 mb-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#0096C7] text-white">
            <Ruler className="h-5 w-5" />
          </div>
          <div>
            <h3 className="font-display text-lg font-black text-slate-900">
              BOXY OVERSIZED FIT SIZE GUIDE
            </h3>
            <p className="text-xs text-slate-500">
              Drop-shoulder streetwear proportions curated by KhanhBro
            </p>
          </div>
        </div>

        <div
          tabIndex={0}
          role="region"
          aria-label="Garment size measurements"
          className="mt-4 overflow-x-auto rounded-2xl bg-slate-50 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#0096C7]/30"
        >
          <table className="w-full text-left text-xs text-slate-800">
            <thead className="bg-slate-100 uppercase text-xs font-mono text-slate-700 border-b border-slate-200">
              <tr>
                <th className="p-3">Size</th>
                <th className="p-3">Length</th>
                <th className="p-3">Chest Width</th>
                <th className="p-3">Shoulder</th>
                <th className="p-3">Suggested Fit (Height / Weight)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 font-mono">
              <tr className="hover:bg-slate-100/60">
                <td className="p-3 font-bold text-[#FF5722]">S</td>
                <td className="p-3">68 cm / 26.8"</td>
                <td className="p-3">112 cm / 44.1"</td>
                <td className="p-3">54 cm / 21.2"</td>
                <td className="p-3 font-sans text-slate-600">5'1" - 5'5" (100 - 128 lbs)</td>
              </tr>
              <tr className="hover:bg-slate-100/60">
                <td className="p-3 font-bold text-[#FF5722]">M</td>
                <td className="p-3">71 cm / 28.0"</td>
                <td className="p-3">118 cm / 46.5"</td>
                <td className="p-3">56 cm / 22.0"</td>
                <td className="p-3 font-sans text-slate-600">5'5" - 5'8" (128 - 150 lbs)</td>
              </tr>
              <tr className="hover:bg-slate-100/60">
                <td className="p-3 font-bold text-[#FF5722]">L</td>
                <td className="p-3">74 cm / 29.1"</td>
                <td className="p-3">124 cm / 48.8"</td>
                <td className="p-3">58 cm / 22.8"</td>
                <td className="p-3 font-sans text-slate-600">5'8" - 5'11" (150 - 172 lbs)</td>
              </tr>
              <tr className="hover:bg-slate-100/60">
                <td className="p-3 font-bold text-[#FF5722]">XL</td>
                <td className="p-3">77 cm / 30.3"</td>
                <td className="p-3">130 cm / 51.2"</td>
                <td className="p-3">60 cm / 23.6"</td>
                <td className="p-3 font-sans text-slate-600">5'11" - 6'2" (172 - 195 lbs)</td>
              </tr>
              <tr className="hover:bg-slate-100/60">
                <td className="p-3 font-bold text-[#FF5722]">XXL</td>
                <td className="p-3">80 cm / 31.5"</td>
                <td className="p-3">136 cm / 53.5"</td>
                <td className="p-3">62 cm / 24.4"</td>
                <td className="p-3 font-sans text-slate-600">&gt; 6'2" (&gt; 195 lbs)</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div className="mt-4 rounded-xl bg-slate-50 p-3 text-xs text-slate-700 space-y-1 border border-slate-200">
          <p className="flex items-center gap-1.5 text-[#0096C7] font-bold">
            <Check className="h-3.5 w-3.5" /> Fit Recommendation:
          </p>
          <p className="text-xs text-slate-600 leading-relaxed font-medium">
            For a fitted streetwear look, size down one size. For a signature cartoon oversized boxy drape with dropped shoulders, order your true size according to the chart above.
          </p>
        </div>
      </div>
    </div>
  );
};
