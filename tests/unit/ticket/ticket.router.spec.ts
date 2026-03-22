import express from 'express';
import request from 'supertest';
import { beforeEach, describe, expect, it, vi } from 'vitest';

const mocks = vi.hoisted(() => ({
  authMiddleware: vi.fn((req, _res, next) => next()),
  createBatch: vi.fn((_req, res) => res.status(201).json([{ id: 1 }])),
  search: vi.fn((_req, res) => res.status(200).json({ data: [], totalCount: 0 })),
  getById: vi.fn((_req, res) => res.status(200).json({ id: 1 })),
}));

vi.mock('@/middlewares/auth.middleware', () => ({ authMiddleware: mocks.authMiddleware }));
vi.mock('@/components/ticket/ticket.controller', () => ({
  ticketController: {
    createBatch: mocks.createBatch,
    search: mocks.search,
    getById: mocks.getById,
  },
}));

import { ticketRouter } from '@/components/ticket/ticket.router';

describe('ticketRouter', () => {
  beforeEach(() => {
    mocks.createBatch.mockClear();
    mocks.search.mockClear();
    mocks.getById.mockClear();
  });

  it('routes GET /search', async () => {
    const app = express();
    app.use('/ticket', ticketRouter);

    const response = await request(app).get('/ticket/search');

    expect(response.status).toBe(200);
    expect(mocks.search).toHaveBeenCalledTimes(1);
  });

  it('routes GET /:id', async () => {
    const app = express();
    app.use('/ticket', ticketRouter);

    const response = await request(app).get('/ticket/1');

    expect(response.status).toBe(200);
    expect(mocks.getById).toHaveBeenCalledTimes(1);
  });

  it('routes POST /batch', async () => {
    const app = express();
    app.use('/ticket', ticketRouter);

    const response = await request(app).post('/ticket/batch').send({});

    expect(response.status).toBe(201);
    expect(mocks.createBatch).toHaveBeenCalledTimes(1);
  });
});
