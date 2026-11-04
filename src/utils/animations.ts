import { useEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

export const animateModalOpen = (
  modalElement: HTMLElement | null,
  backdropElement: HTMLElement | null,
  onComplete?: () => void
) => {
  if (!modalElement) return;

  const tl = gsap.timeline({ onComplete });

  if (backdropElement) {
    tl.fromTo(
      backdropElement,
      { opacity: 0 },
      { opacity: 1, duration: 0.25, ease: 'power2.out' },
      0
    );
  }

  tl.fromTo(
    modalElement,
    { scale: 0.75, opacity: 0, y: 35 },
    { scale: 1, opacity: 1, y: 0, duration: 0.45, ease: 'back.out(1.7)' },
    0.05
  );

  return tl;
};

export const animateModalClose = (
  modalElement: HTMLElement | null,
  backdropElement: HTMLElement | null,
  onComplete?: () => void
) => {
  if (!modalElement) {
    onComplete?.();
    return;
  }

  const tl = gsap.timeline({ onComplete });

  tl.to(
    modalElement,
    { scale: 0.85, opacity: 0, y: 20, duration: 0.22, ease: 'power2.in' },
    0
  );

  if (backdropElement) {
    tl.to(
      backdropElement,
      { opacity: 0, duration: 0.22, ease: 'power2.in' },
      0
    );
  }

  return tl;
};

export const animateDrawerOpen = (
  drawerElement: HTMLElement | null,
  backdropElement: HTMLElement | null,
  onComplete?: () => void
) => {
  if (!drawerElement) return;

  const tl = gsap.timeline({ onComplete });

  if (backdropElement) {
    tl.fromTo(
      backdropElement,
      { opacity: 0 },
      { opacity: 1, duration: 0.25, ease: 'power2.out' },
      0
    );
  }

  tl.fromTo(
    drawerElement,
    { x: '100%', opacity: 0.8 },
    { x: '0%', opacity: 1, duration: 0.4, ease: 'power3.out' },
    0
  );

  return tl;
};

export const animateDrawerClose = (
  drawerElement: HTMLElement | null,
  backdropElement: HTMLElement | null,
  onComplete?: () => void
) => {
  if (!drawerElement) {
    onComplete?.();
    return;
  }

  const tl = gsap.timeline({ onComplete });

  tl.to(
    drawerElement,
    { x: '100%', duration: 0.3, ease: 'power3.in' },
    0
  );

  if (backdropElement) {
    tl.to(
      backdropElement,
      { opacity: 0, duration: 0.3, ease: 'power2.in' },
      0
    );
  }

  return tl;
};

export const animateSquashAndStretch = (
  element: HTMLElement | null,
  intensity = 1.15
) => {
  if (!element) return;

  gsap.timeline()
    .to(element, {
      scaleX: intensity,
      scaleY: 1 / intensity,
      duration: 0.12,
      ease: 'power2.out',
    })
    .to(element, {
      scaleX: 1 / (intensity * 0.9),
      scaleY: intensity * 0.9,
      duration: 0.16,
      ease: 'power2.out',
    })
    .to(element, {
      scaleX: 1,
      scaleY: 1,
      duration: 0.25,
      ease: 'elastic.out(1.4, 0.4)',
    });
};

export const animateSplatterBurst = (
  container: HTMLElement | null,
  originX: number,
  originY: number,
  colors = ['#FF5722', '#FF2E93', '#00E5FF', '#8B5CF6', '#FFD600']
) => {
  if (!container) return;

  const particleCount = 20;

  for (let i = 0; i < particleCount; i++) {
    const dot = document.createElement('div');
    const size = gsap.utils.random(8, 22);
    const color = gsap.utils.random(colors);
    const angle = gsap.utils.random(0, Math.PI * 2);
    const distance = gsap.utils.random(35, 120);

    dot.style.position = 'absolute';
    dot.style.left = `${originX}px`;
    dot.style.top = `${originY}px`;
    dot.style.width = `${size}px`;
    dot.style.height = `${size}px`;
    dot.style.borderRadius = '50%';
    dot.style.backgroundColor = color;
    dot.style.border = '2px solid rgba(0, 0, 0, 0.3)';
    dot.style.pointerEvents = 'none';
    dot.style.zIndex = '9999';

    container.appendChild(dot);

    const destX = Math.cos(angle) * distance;
    const destY = Math.sin(angle) * distance + 20;

    gsap.timeline({
      onComplete: () => {
        dot.remove();
      },
    })
      .to(dot, {
        x: destX,
        y: destY,
        scale: gsap.utils.random(0.3, 0.7),
        duration: gsap.utils.random(0.45, 0.75),
        ease: 'power2.out',
      })
      .to(
        dot,
        {
          opacity: 0,
          duration: 0.2,
          ease: 'power1.in',
        },
        '-=0.2'
      );
  }
};

export const animateStaggeredReveal = (
  selectorOrElements: string | Element[],
  triggerElement?: string | Element
) => {
  if (typeof window === 'undefined') return;

  return gsap.from(selectorOrElements, {
    scrollTrigger: triggerElement
      ? {
          trigger: triggerElement,
          start: 'top 85%',
        }
      : undefined,
    opacity: 0,
    y: 35,
    scale: 0.95,
    stagger: 0.06,
    duration: 0.5,
    ease: 'back.out(1.4)',
    clearProps: 'transform,opacity',
  });
};

export const animateFlyToCart = (
  sourceElement: HTMLElement | null,
  targetSelector = '#navbar-cart-button',
  onComplete?: () => void
) => {
  if (typeof window === 'undefined' || !sourceElement) {
    onComplete?.();
    return;
  }

  const target = document.querySelector(targetSelector) as HTMLElement | null;
  if (!target) {
    onComplete?.();
    return;
  }

  const sourceRect = sourceElement.getBoundingClientRect();
  const targetRect = target.getBoundingClientRect();

  const flyer = document.createElement('div');
  flyer.className = 'fixed z-[9999] pointer-events-none flex items-center justify-center';
  flyer.style.left = `${sourceRect.left + sourceRect.width / 2 - 18}px`;
  flyer.style.top = `${sourceRect.top + sourceRect.height / 2 - 18}px`;
  flyer.style.width = '36px';
  flyer.style.height = '36px';
  flyer.style.borderRadius = '12px';
  flyer.style.background = '#FF5722';
  flyer.style.border = '2px solid #0F172A';
  flyer.style.boxShadow = '3px 3px 0px #0F172A';
  flyer.style.color = '#FFFFFF';
  flyer.innerHTML = `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z"/><path d="M3 6h18"/><path d="M16 10a4 4 0 0 1-8 0"/></svg>`;

  document.body.appendChild(flyer);

  const deltaX = (targetRect.left + targetRect.width / 2) - (sourceRect.left + sourceRect.width / 2);
  const deltaY = (targetRect.top + targetRect.height / 2) - (sourceRect.top + sourceRect.height / 2);

  const tl = gsap.timeline({
    onComplete: () => {
      flyer.remove();
      animateSquashAndStretch(target, 1.25);
      animateSplatterBurst(
        document.body,
        targetRect.left + targetRect.width / 2,
        targetRect.top + targetRect.height / 2,
        ['#FF5722', '#FF2E93', '#0096C7', '#F59E0B']
      );
      onComplete?.();
    },
  });

  tl.to(flyer, {
    x: deltaX,
    duration: 0.6,
    ease: 'power1.inOut',
  }, 0)
  .to(flyer, {
    y: deltaY - 60,
    duration: 0.3,
    ease: 'power2.out',
  }, 0)
  .to(flyer, {
    y: deltaY,
    duration: 0.3,
    ease: 'power2.in',
  }, 0.3)
  .to(flyer, {
    scale: 0.65,
    rotation: 360,
    duration: 0.6,
    ease: 'power1.inOut',
  }, 0);

  return tl;
};

export const useBodyScrollLock = (isLocked: boolean) => {
  useEffect(() => {
    if (!isLocked || typeof window === 'undefined') return;

    const originalOverflow = document.body.style.overflow;
    const originalPaddingRight = document.body.style.paddingRight;
    const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;

    document.body.style.overflow = 'hidden';
    if (scrollbarWidth > 0) {
      document.body.style.paddingRight = `${scrollbarWidth}px`;
    }

    return () => {
      document.body.style.overflow = originalOverflow;
      document.body.style.paddingRight = originalPaddingRight;
    };
  }, [isLocked]);
};

export { gsap, ScrollTrigger };
