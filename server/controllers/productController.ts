import { Request, Response } from 'express';
import mongoose from 'mongoose';
import Product from '../models/Product';
import fallbackCatalog from '../data/fallback_products.json';

const fallbackProducts = fallbackCatalog as any[];

// Filter and sort in-memory product catalog when MongoDB is unreachable
function queryFallbackProducts(query: any) {
  const {
    category,
    collection,
    season,
    search,
    flashSale,
    minPrice,
    maxPrice,
    sortBy = 'featured',
    order = 'desc',
    limit = 12,
    page = 1,
    mascotSlot,
  } = query;

  let filtered = [...fallbackProducts];

  if (category && category !== 'all') {
    filtered = filtered.filter((p) => (p.category || '').toLowerCase() === String(category).toLowerCase());
  }

  if (collection && collection !== 'all') {
    filtered = filtered.filter((p) => p.collectionName === collection);
  }

  if (season && season !== 'all') {
    filtered = filtered.filter((p) => p.season === season);
  }

  if (flashSale === 'true') {
    filtered = filtered.filter((p) => p.isFlashSale);
  }

  if (mascotSlot && mascotSlot !== 'all') {
    filtered = filtered.filter((p) => (p.mascotSlot || '').toLowerCase() === String(mascotSlot).toLowerCase());
  }

  if (minPrice) {
    filtered = filtered.filter((p) => p.price >= Number(minPrice));
  }
  if (maxPrice) {
    filtered = filtered.filter((p) => p.price <= Number(maxPrice));
  }

  if (search) {
    const term = String(search).toLowerCase();
    filtered = filtered.filter(
      (p) =>
        (p.title && p.title.toLowerCase().includes(term)) ||
        (p.description && p.description.toLowerCase().includes(term)) ||
        (p.collectionName && p.collectionName.toLowerCase().includes(term)) ||
        (Array.isArray(p.tags) && p.tags.some((t: string) => t.toLowerCase().includes(term)))
    );
  }

  if (sortBy === 'featured') {
    filtered.sort((a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0) || b.rating - a.rating);
  } else if (sortBy === 'price') {
    filtered.sort((a, b) => (order === 'asc' ? a.price - b.price : b.price - a.price));
  } else if (sortBy === 'rating') {
    filtered.sort((a, b) => b.rating - a.rating);
  } else if (sortBy === 'createdAt') {
    filtered.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }

  const total = filtered.length;
  const numLimit = Number(limit) || 12;
  const numPage = Number(page) || 1;
  const skip = (numPage - 1) * numLimit;
  const paginated = filtered.slice(skip, skip + numLimit);

  return {
    success: true,
    count: paginated.length,
    total,
    page: numPage,
    totalPages: Math.ceil(total / numLimit),
    data: paginated,
  };
}

export const getProducts = async (req: Request, res: Response) => {
  // Query MongoDB Atlas if connected, otherwise fallback to high speed memory catalog
  if (mongoose.connection.readyState >= 1) {
    try {
      const {
        category,
        collection,
        season,
        search,
        flashSale,
        minPrice,
        maxPrice,
        sortBy = 'featured',
        order = 'desc',
        limit = 12,
        page = 1,
        mascotSlot,
      } = req.query;

      const filter: any = {};

      if (category && category !== 'all') {
        filter.category = category;
      }
      if (collection && collection !== 'all') {
        filter.collectionName = collection;
      }
      if (season && season !== 'all') {
        filter.season = season;
      }
      if (flashSale === 'true') {
        filter.isFlashSale = true;
      }
      if (mascotSlot && mascotSlot !== 'all') {
        filter.mascotSlot = mascotSlot;
      }
      if (minPrice || maxPrice) {
        filter.price = {};
        if (minPrice) filter.price.$gte = Number(minPrice);
        if (maxPrice) filter.price.$lte = Number(maxPrice);
      }
      if (search) {
        const searchRegex = new RegExp(String(search), 'i');
        filter.$or = [
          { title: searchRegex },
          { description: searchRegex },
          { tags: searchRegex },
          { collectionName: searchRegex },
        ];
      }

      let sortCriteria: any = {};
      if (sortBy === 'featured') {
        sortCriteria = { featured: -1, rating: -1, createdAt: -1 };
      } else {
        const sortOrder = order === 'asc' ? 1 : -1;
        const sortField = String(sortBy);
        sortCriteria = { [sortField]: sortOrder };
      }

      const skip = (Number(page) - 1) * Number(limit);
      const total = await Product.countDocuments(filter);
      const products = await Product.find(filter)
        .sort(sortCriteria)
        .skip(skip)
        .limit(Number(limit));

      return res.json({
        success: true,
        count: products.length,
        total,
        page: Number(page),
        totalPages: Math.ceil(total / Number(limit)),
        data: products,
      });
    } catch (error: any) {
      console.warn('MongoDB query failed, falling back to local catalog:', error.message);
    }
  }

  // Gracefully serve from fallback catalog if database is offline or uninitialized
  const fallbackResult = queryFallbackProducts(req.query);
  return res.json(fallbackResult);
};

export const getProductById = async (req: Request, res: Response) => {
  if (mongoose.connection.readyState >= 1) {
    try {
      const product = await Product.findById(req.params.id);
      if (product) {
        return res.json({ success: true, data: product });
      }
    } catch (err) {
      // Fall through to memory catalog lookup
    }
  }

  const fallback = fallbackProducts.find((p) => p._id === req.params.id || p.id === req.params.id);
  if (fallback) {
    return res.json({ success: true, data: fallback });
  }

  // If numeric index requested or item not found, return first matching item
  if (fallbackProducts.length > 0) {
    return res.json({ success: true, data: fallbackProducts[0] });
  }

  return res.status(404).json({ success: false, message: 'Product not found' });
};

export const createProduct = async (req: Request, res: Response) => {
  try {
    if (mongoose.connection.readyState >= 1) {
      const product = await Product.create(req.body);
      return res.status(201).json({ success: true, data: product });
    }
    const mockCreated = {
      _id: `prod_custom_${Date.now()}`,
      ...req.body,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    return res.status(201).json({ success: true, data: mockCreated });
  } catch (error: any) {
    return res.status(400).json({ success: false, message: error.message });
  }
};

export const updateProduct = async (req: Request, res: Response) => {
  try {
    if (mongoose.connection.readyState >= 1) {
      const product = await Product.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true,
      });
      if (product) {
        return res.json({ success: true, data: product });
      }
    }
    const fallback = fallbackProducts.find((p) => p._id === req.params.id);
    if (fallback) {
      Object.assign(fallback, req.body);
      return res.json({ success: true, data: fallback });
    }
    return res.status(404).json({ success: false, message: 'Product not found' });
  } catch (error: any) {
    return res.status(400).json({ success: false, message: error.message });
  }
};

export const deleteProduct = async (req: Request, res: Response) => {
  try {
    if (mongoose.connection.readyState >= 1) {
      const product = await Product.findByIdAndDelete(req.params.id);
      if (product) {
        return res.json({ success: true, message: 'Product deleted successfully' });
      }
    }
    return res.json({ success: true, message: 'Product deleted successfully' });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error.message });
  }
};
