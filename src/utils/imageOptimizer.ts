export interface ImageOptimizationOptions {
  width?: number;
  height?: number;
  quality?: 'auto' | 'auto:good' | 'auto:best' | 'auto:eco' | 'auto:low';
  crop?: 'limit' | 'fill' | 'scale' | 'fit';
  format?: 'auto' | 'webp' | 'avif';
  dpr?: number | 'auto';
}

// Transform raw Cloudinary URLs with width, compression, and modern web format constraints
export const getOptimizedImageUrl = (
  url?: string | null,
  options: ImageOptimizationOptions = {}
): string => {
  if (!url || typeof url !== 'string') return '';
  if (!url.includes('res.cloudinary.com')) return url;

  const {
    width = 500,
    quality = 'auto:good',
    crop = 'limit',
    format = 'auto',
    dpr = 'auto',
  } = options;

  const transforms = [
    `c_${crop}`,
    `w_${width}`,
    options.height ? `h_${options.height}` : null,
    `q_${quality}`,
    `f_${format}`,
    `dpr_${dpr}`,
  ]
    .filter(Boolean)
    .join(',');

  const uploadMarker = '/image/upload/';
  const uploadIdx = url.indexOf(uploadMarker);
  if (uploadIdx === -1) return url;

  const prefix = url.substring(0, uploadIdx + uploadMarker.length);
  const remainder = url.substring(uploadIdx + uploadMarker.length);

  const segments = remainder.split('/');
  if (
    segments[0] &&
    (segments[0].includes('_') || segments[0].includes(',')) &&
    !segments[0].startsWith('v1') &&
    !segments[0].startsWith('v2')
  ) {
    segments[0] = transforms;
    return `${prefix}${segments.join('/')}`;
  }

  return `${prefix}${transforms}/${remainder}`;
};

const preloadedUrls = new Set<string>();

// Preloads an image into the browser cache
export const preloadImage = (url: string): Promise<void> => {
  if (!url || preloadedUrls.has(url)) return Promise.resolve();
  preloadedUrls.add(url);

  return new Promise((resolve) => {
    const img = new Image();
    img.src = url;
    img.onload = () => resolve();
    img.onerror = () => resolve();
  });
};

// Warms top images of a collection in background idle time
export const preloadCollectionImages = (
  imageUrls: (string | undefined)[],
  maxCount = 4
) => {
  if (!imageUrls || imageUrls.length === 0) return;
  const targets = imageUrls.filter(Boolean).slice(0, maxCount) as string[];

  targets.forEach((rawUrl) => {
    const optimized = getOptimizedImageUrl(rawUrl, { width: 500, quality: 'auto:good' });
    preloadImage(optimized);
  });
};
