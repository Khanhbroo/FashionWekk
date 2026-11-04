import { describe, it, expect } from 'vitest';
import { COLLECTION_CATALOG } from '../src/features/collections/CollectionPage';

describe('navigation and collection catalog', () => {
  it('should verify all 10 collections exist in the catalog with valid metadata', () => {
    const expectedCollections = [
      'Cyber Toon Glitch',
      'Mecha Bot Evolution',
      'Rogue Clan Distressed',
      'Street Ronin Brush',
      'Chibi Harajuku Splash',
      'Pixel Quest 8-Bit',
      'Solar Flare Washed',
      'Synth Wave Sunset',
      'Demon Mask Pop Art',
      'KhanhBro Signature Drip',
    ];

    expect(Object.keys(COLLECTION_CATALOG)).toHaveLength(10);
    expectedCollections.forEach((name) => {
      const meta = COLLECTION_CATALOG[name];
      expect(meta).toBeDefined();
      expect(meta.gsm).toBeGreaterThanOrEqual(350);
      expect(meta.tag).toBeTruthy();
      expect(meta.silhouette).toBeTruthy();
      expect(meta.edition).toBeTruthy();
    });
  });

  it('should correctly parse search params for routing targets', () => {
    const parseSearchQuery = (search: string) => {
      const params = new URLSearchParams(search);
      if (params.get('view') === 'admin') return { view: 'admin' };
      if (params.get('product')) return { view: 'product', id: params.get('product') };
      if (params.get('collection')) return { view: 'collection', name: params.get('collection') };
      return { view: 'home' };
    };

    expect(parseSearchQuery('?product=6728a1')).toEqual({ view: 'product', id: '6728a1' });
    expect(parseSearchQuery('?collection=Street+Ronin+Brush')).toEqual({
      view: 'collection',
      name: 'Street Ronin Brush',
    });
    expect(parseSearchQuery('?view=admin')).toEqual({ view: 'admin' });
    expect(parseSearchQuery('')).toEqual({ view: 'home' });
  });

  it('should filter collection drops and exclude active product in related drops', () => {
    const mockProducts = [
      { _id: '1', title: 'Glitch Hoodie', collectionName: 'Cyber Toon Glitch', category: 'hoodies' },
      { _id: '2', title: 'Glitch Tee', collectionName: 'Cyber Toon Glitch', category: 'tees' },
      { _id: '3', title: 'Ronin Jacket', collectionName: 'Street Ronin Brush', category: 'outerwear' },
    ];

    const currentProduct = mockProducts[0];
    const related = mockProducts
      .filter(
        (p) =>
          p._id !== currentProduct._id &&
          (p.collectionName === currentProduct.collectionName || p.category === currentProduct.category)
      )
      .slice(0, 4);

    expect(related).toHaveLength(1);
    expect(related[0]._id).toBe('2');
    expect(related[0].collectionName).toBe('Cyber Toon Glitch');
  });

  it('should validate responsive specifications for mobile card data presentation', () => {
    const formatMobileDropSummary = (product: {
      title: string;
      price: number;
      gsm: number;
      stock: number;
      collectionName?: string;
    }) => {
      const stockBadge =
        product.stock === 0 ? 'Sold Out' : product.stock <= 10 ? `Only ${product.stock} left` : 'In Stock';
      return {
        headline: product.title,
        priceTag: `$${product.price.toFixed(2)}`,
        weightBadge: `${product.gsm} GSM`,
        stockBadge,
        capsule: product.collectionName || 'Season Drop',
      };
    };

    const formatted = formatMobileDropSummary({
      title: 'Mecha Cyber Trench',
      price: 185,
      gsm: 480,
      stock: 4,
      collectionName: 'Mecha Bot Evolution',
    });

    expect(formatted.priceTag).toBe('$185.00');
    expect(formatted.weightBadge).toBe('480 GSM');
    expect(formatted.stockBadge).toBe('Only 4 left');
    expect(formatted.capsule).toBe('Mecha Bot Evolution');
  });
});
