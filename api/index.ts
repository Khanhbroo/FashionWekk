import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { connectDB } from '../server/config/db';
import productRoutes from '../server/routes/productRoutes';
import orderRoutes from '../server/routes/orderRoutes';
import couponRoutes from '../server/routes/couponRoutes';

dotenv.config();

const app = express();

app.use(cors({
  origin: '*',
  credentials: true,
}));
app.use(express.json());

// Ensure MongoDB connection before processing any request
app.use(async (_req: Request, _res: Response, next: NextFunction) => {
  try {
    await connectDB();
  } catch (err) {
    console.error('Failed to establish MongoDB connection in Vercel serverless function:', err);
  }
  next();
});

// Mount API routes
app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/coupons', couponRoutes);

app.get('/api/health', (_req: Request, res: Response) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    service: 'FashionWekk Vercel Serverless API',
    environment: 'production',
  });
});

app.use('/api/*', (_req: Request, res: Response) => {
  res.status(404).json({ success: false, message: 'API endpoint not found' });
});

app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
  console.error('Vercel API Unhandled Error:', err);
  res.status(500).json({
    success: false,
    message: err.message || 'Internal Server Error',
  });
});

export default app;
