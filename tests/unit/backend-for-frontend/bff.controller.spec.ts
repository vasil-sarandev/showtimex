import { beforeEach, describe, expect, it, vi } from 'vitest';
import { bffController } from '@/components/backend-for-frontend/bff.controller';

type EventArgs = Parameters<typeof bffController.getEventPageData>;
type PerformerArgs = Parameters<typeof bffController.getPerformerPageData>;
type VenueArgs = Parameters<typeof bffController.getVenuePageData>;

const mocks = vi.hoisted(() => ({
  bffService: {
    getEventPageData: vi.fn(),
    getPerformerPageData: vi.fn(),
    getVenuePageData: vi.fn(),
  },
}));

vi.mock('@/components/backend-for-frontend/bff.service', () => ({
  bffService: mocks.bffService,
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

describe('BackendForFrontEndController', () => {
  beforeEach(() => {
    mocks.bffService.getEventPageData.mockReset();
    mocks.bffService.getPerformerPageData.mockReset();
    mocks.bffService.getVenuePageData.mockReset();
  });

  it('returns event page data', async () => {
    const req = { params: { id: '1' } };
    const res = createRes();
    const next = vi.fn();

    mocks.bffService.getEventPageData.mockResolvedValue({ event: { id: 1 } });

    await bffController.getEventPageData(
      req as unknown as EventArgs[0],
      res as unknown as EventArgs[1],
      next as unknown as EventArgs[2],
    );

    expect(mocks.bffService.getEventPageData).toHaveBeenCalledWith(1);
    expect(res.status).toHaveBeenCalledWith(200);
  });

  it('returns performer page data', async () => {
    const req = { params: { id: '2' } };
    const res = createRes();
    const next = vi.fn();

    mocks.bffService.getPerformerPageData.mockResolvedValue({ performer: { id: 2 } });

    await bffController.getPerformerPageData(
      req as unknown as PerformerArgs[0],
      res as unknown as PerformerArgs[1],
      next as unknown as PerformerArgs[2],
    );

    expect(mocks.bffService.getPerformerPageData).toHaveBeenCalledWith(2);
    expect(res.status).toHaveBeenCalledWith(200);
  });

  it('returns venue page data', async () => {
    const req = { params: { id: '3' } };
    const res = createRes();
    const next = vi.fn();

    mocks.bffService.getVenuePageData.mockResolvedValue({ venue: { id: 3 } });

    await bffController.getVenuePageData(
      req as unknown as VenueArgs[0],
      res as unknown as VenueArgs[1],
      next as unknown as VenueArgs[2],
    );

    expect(mocks.bffService.getVenuePageData).toHaveBeenCalledWith(3);
    expect(res.status).toHaveBeenCalledWith(200);
  });
});
