import { Request, Response } from 'express';
import Product from '../models/Product';

export const getProducts = async (req: Request, res: Response) => {
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

    res.json({
      success: true,
      count: products.length,
      total,
      page: Number(page),
      totalPages: Math.ceil(total / Number(limit)),
      data: products,
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getProductById = async (req: Request, res: Response) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }
    res.json({ success: true, data: product });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const createProduct = async (req: Request, res: Response) => {
  try {
    const product = await Product.create(req.body);
    res.status(201).json({ success: true, data: product });
  } catch (error: any) {
    res.status(400).json({ success: false, message: error.message });
  }
};

export const updateProduct = async (req: Request, res: Response) => {
  try {
    const product = await Product.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }
    res.json({ success: true, data: product });
  } catch (error: any) {
    res.status(400).json({ success: false, message: error.message });
  }
};

export const deleteProduct = async (req: Request, res: Response) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }
    res.json({ success: true, message: 'Product deleted successfully' });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};
