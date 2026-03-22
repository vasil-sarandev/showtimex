import express from 'express';
import request from 'supertest';
import { beforeEach, describe, expect, it, vi } from 'vitest';

const mocks = vi.hoisted(() => ({
  authMiddleware: vi.fn((req, _res, next) => next()),
  create: vi.fn((_req, res) => res.status(201).json({ id: 1 })),
  search: vi.fn((_req, res) => res.status(200).json({ data: [], totalCount: 0 })),
  getById: vi.fn((_req, res) => res.status(200).json({ id: 1 })),
}));

vi.mock('@/middlewares/auth.middleware', () => ({ authMiddleware: mocks.authMiddleware }));
vi.mock('@/components/performer/performer.controller', () => ({
  performerConroller: {
    create: mocks.create,
    search: mocks.search,
    getById: mocks.getById,
  },
}));

import { performerRouter } from '@/components/performer/performer.router';

describe('performerRouter', () => {
  beforeEach(() => {
    mocks.create.mockClear();
    mocks.search.mockClear();
    mocks.getById.mockClear();
  });

  it('routes GET /search', async () => {
    const app = express();
    app.use('/performer', performerRouter);

    const response = await request(app).get('/performer/search');

    expect(response.status).toBe(200);
    expect(mocks.search).toHaveBeenCalledTimes(1);
  });

  it('routes GET /:id', async () => {
    const app = express();
    app.use('/performer', performerRouter);

    const response = await request(app).get('/performer/1');

    expect(response.status).toBe(200);
    expect(mocks.getById).toHaveBeenCalledTimes(1);
  });

  it('routes POST /', async () => {
    const app = express();
    app.use('/performer', performerRouter);

    const response = await request(app).post('/performer').send({});

    expect(response.status).toBe(201);
    expect(mocks.create).toHaveBeenCalledTimes(1);
  });
});
