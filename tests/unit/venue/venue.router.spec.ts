import express from 'express';
import request from 'supertest';
import { beforeEach, describe, expect, it, vi } from 'vitest';

const mocks = vi.hoisted(() => ({
  authMiddleware: vi.fn((req, _res, next) => next()),
  create: vi.fn((_req, res) => res.status(201).json({ id: 1 })),
  search: vi.fn((_req, res) => res.status(200).json({ data: [], totalCount: 0 })),
  getById: vi.fn((_req, res) => res.status(200).json({ id: 1 })),
}));

vi.mock('@/middlewares/auth.middleware', () => ({
  authMiddleware: mocks.authMiddleware,
}));

vi.mock('@/components/venue/venue.controller', () => ({
  venueController: {
    create: mocks.create,
    search: mocks.search,
    getById: mocks.getById,
  },
}));

import { venueRouter } from '@/components/venue/venue.router';

describe('venueRouter', () => {
  beforeEach(() => {
    mocks.authMiddleware.mockClear();
    mocks.create.mockClear();
    mocks.search.mockClear();
    mocks.getById.mockClear();
  });

  it('routes GET /search to search handler', async () => {
    const app = express();
    app.use('/venue', venueRouter);

    const response = await request(app).get('/venue/search');

    expect(response.status).toBe(200);
    expect(mocks.search).toHaveBeenCalledTimes(1);
    expect(mocks.getById).not.toHaveBeenCalled();
  });

  it('routes GET /:id to getById handler', async () => {
    const app = express();
    app.use('/venue', venueRouter);

    const response = await request(app).get('/venue/123');

    expect(response.status).toBe(200);
    expect(mocks.getById).toHaveBeenCalledTimes(1);
  });

  it('routes POST / to create handler', async () => {
    const app = express();
    app.use('/venue', venueRouter);

    const response = await request(app).post('/venue').send({
      name: 'Main Hall',
      capacity: 1000,
      google_maps_url: 'https://maps.google.com/?q=main+hall',
    });

    expect(response.status).toBe(201);
    expect(mocks.create).toHaveBeenCalledTimes(1);
  });
});
