import { beforeEach, describe, expect, it, vi } from 'vitest';
import { NextFunction, Request, Response } from 'express';
import { AppError } from '@/middlewares/error.middleware';
import { venueController } from '@/components/venue/venue.controller';

const mocks = vi.hoisted(() => ({
  venueService: {
    create: vi.fn(),
    findOne: vi.fn(),
    search: vi.fn(),
  },
}));

vi.mock('@/components/venue/venue.service', () => ({
  venueService: mocks.venueService,
}));

const createRes = () => {
  const res = {
    status: vi.fn(),
    json: vi.fn(),
  };
  res.status.mockReturnValue(res);
  res.json.mockReturnValue(res);
  return res;
};

describe('VenueController', () => {
  beforeEach(() => {
    mocks.venueService.create.mockReset();
    mocks.venueService.findOne.mockReset();
    mocks.venueService.search.mockReset();
  });

  it('create returns 201 with created venue', async () => {
    const req = {
      body: {
        name: 'Main Concert Hall',
        capacity: 1200,
        google_maps_url: 'https://maps.google.com/?q=main+hall',
      },
    };
    const res = createRes();
    const next = vi.fn();
    const venue = { id: 1, ...req.body };

    mocks.venueService.create.mockResolvedValue(venue);

    await venueController.create(
      req as unknown as Request,
      res as unknown as Response,
      next as unknown as NextFunction,
    );

    expect(mocks.venueService.create).toHaveBeenCalledWith(req.body);
    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith(venue);
    expect(next).not.toHaveBeenCalled();
  });

  it('getById returns 404 AppError when venue is missing', async () => {
    const req = { params: { id: '99' } };
    const res = createRes();
    const next = vi.fn();

    mocks.venueService.findOne.mockResolvedValue(null);

    await venueController.getById(
      req as unknown as Request<{ id: string }>,
      res as unknown as Response,
      next as unknown as NextFunction,
    );

    expect(next).toHaveBeenCalledTimes(1);
    const error = next.mock.calls[0][0] as AppError;
    expect(error).toBeInstanceOf(AppError);
    expect(error.status).toBe(404);
    expect(error.message).toBe('venue not found');
  });

  it('search returns paginated result', async () => {
    const req = { query: { name: 'hall', page: '1', limit: '10' } };
    const res = createRes();
    const next = vi.fn();
    const data = [{ id: 1, name: 'Main Hall', capacity: 1000, google_maps_url: null }];

    mocks.venueService.search.mockResolvedValue([data, 1]);

    await venueController.search(
      req as unknown as Request,
      res as unknown as Response,
      next as unknown as NextFunction,
    );

    expect(mocks.venueService.search).toHaveBeenCalledWith(req.query);
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({ data, totalCount: 1 });
    expect(next).not.toHaveBeenCalled();
  });
});
