import express from 'express';
import request from 'supertest';
import { beforeEach, describe, expect, it, vi } from 'vitest';

const mocks = vi.hoisted(() => ({
  getEventPageData: vi.fn((_req, res) => res.status(200).json({ event: {} })),
  getPerformerPageData: vi.fn((_req, res) => res.status(200).json({ performer: {} })),
  getVenuePageData: vi.fn((_req, res) => res.status(200).json({ venue: {} })),
}));

vi.mock('@/components/backend-for-frontend/bff.controller', () => ({
  bffController: {
    getEventPageData: mocks.getEventPageData,
    getPerformerPageData: mocks.getPerformerPageData,
    getVenuePageData: mocks.getVenuePageData,
  },
}));

import { bffRouter } from '@/components/backend-for-frontend/bff.router';

describe('bffRouter', () => {
  beforeEach(() => {
    mocks.getEventPageData.mockClear();
    mocks.getPerformerPageData.mockClear();
    mocks.getVenuePageData.mockClear();
  });

  it('routes /event-page/:id', async () => {
    const app = express();
    app.use('/bff', bffRouter);

    const response = await request(app).get('/bff/event-page/1');

    expect(response.status).toBe(200);
    expect(mocks.getEventPageData).toHaveBeenCalledTimes(1);
  });

  it('routes /performer-page/:id', async () => {
    const app = express();
    app.use('/bff', bffRouter);

    const response = await request(app).get('/bff/performer-page/1');

    expect(response.status).toBe(200);
    expect(mocks.getPerformerPageData).toHaveBeenCalledTimes(1);
  });

  it('routes /venue-page/:id', async () => {
    const app = express();
    app.use('/bff', bffRouter);

    const response = await request(app).get('/bff/venue-page/1');

    expect(response.status).toBe(200);
    expect(mocks.getVenuePageData).toHaveBeenCalledTimes(1);
  });
});
