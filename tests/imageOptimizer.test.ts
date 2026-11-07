import { describe, it, expect } from 'vitest';
import { getOptimizedImageUrl } from '../src/utils/imageOptimizer';

describe('Cloudinary Image Optimizer', () => {
  it('returns empty string when input is null or undefined', () => {
    expect(getOptimizedImageUrl(null)).toBe('');
    expect(getOptimizedImageUrl(undefined)).toBe('');
    expect(getOptimizedImageUrl('')).toBe('');
  });

  it('leaves non-Cloudinary urls unchanged', () => {
    const localUrl = '/assets/images/sample.jpg';
    expect(getOptimizedImageUrl(localUrl)).toBe(localUrl);
  });

  it('replaces raw upload transforms with optimized dimensions and format', () => {
    const rawUrl =
      'https://res.cloudinary.com/dptpb60p7/image/upload/f_auto,q_auto/v1793891791/fashionwekk/masterpieces/chibi_harajuku_splash.png';
    const optimized = getOptimizedImageUrl(rawUrl, { width: 500, quality: 'auto:good' });

    expect(optimized).toContain('c_limit,w_500,q_auto:good,f_auto,dpr_auto');
    expect(optimized).toContain('fashionwekk/masterpieces/chibi_harajuku_splash.png');
  });

  it('injects transforms when upload has no prior transformation prefix', () => {
    const rawUrl =
      'https://res.cloudinary.com/dptpb60p7/image/upload/fashionwekk/masterpieces/khanhbro_hero_signature_drip.jpg';
    const optimized = getOptimizedImageUrl(rawUrl, { width: 800 });

    expect(optimized).toContain('c_limit,w_800');
    expect(optimized).toContain('fashionwekk/masterpieces/khanhbro_hero_signature_drip.jpg');
  });

  it('handles custom dimensions and crop options', () => {
    const rawUrl =
      'https://res.cloudinary.com/dptpb60p7/image/upload/f_auto,q_auto/v1793891791/fashionwekk/sample.png';
    const optimized = getOptimizedImageUrl(rawUrl, {
      width: 300,
      height: 300,
      crop: 'fill',
      quality: 'auto:eco',
    });

    expect(optimized).toContain('c_fill,w_300,h_300,q_auto:eco');
  });
});
