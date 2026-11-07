import { describe, it, expect } from 'vitest';
import app from '../api/index';

describe('Vercel Serverless API handler', () => {
  it('should export a valid express application instance', () => {
    expect(app).toBeDefined();
    expect(typeof app).toBe('function');
  });

  it('handles health check endpoint successfully', async () => {
    const mockReq: any = { method: 'GET', url: '/api/health', headers: {} };
    let responseData: any = null;
    let statusCode = 200;

    await new Promise<void>((resolve) => {
      const mockRes: any = {
        status(code: number) {
          statusCode = code;
          return this;
        },
        json(data: any) {
          responseData = data;
          resolve();
          return this;
        },
        setHeader() {
          return this;
        },
        end() {
          resolve();
          return this;
        },
      };
      app(mockReq, mockRes, resolve);
    });

    expect(statusCode).toBe(200);
    expect(responseData?.status).toBe('ok');
    expect(responseData?.service).toContain('Vercel Serverless API');
  });

  it('gracefully serves product catalog with fallback when MongoDB is uninitialized', async () => {
    const mockReq: any = {
      method: 'GET',
      url: '/api/products?limit=10',
      query: { limit: '10' },
      headers: {},
    };
    let responseData: any = null;
    let statusCode = 200;

    await new Promise<void>((resolve) => {
      const mockRes: any = {
        status(code: number) {
          statusCode = code;
          return this;
        },
        json(data: any) {
          responseData = data;
          resolve();
          return this;
        },
        setHeader() {
          return this;
        },
        end() {
          resolve();
          return this;
        },
      };
      app(mockReq, mockRes, resolve);
    });

    expect(statusCode).toBe(200);
    expect(responseData?.success).toBe(true);
    expect(Array.isArray(responseData?.data)).toBe(true);
    expect(responseData?.data.length).toBeGreaterThan(0);
    expect(responseData?.data[0].title).toBeDefined();
    expect(responseData?.data[0].price).toBeGreaterThan(0);
  });
});
