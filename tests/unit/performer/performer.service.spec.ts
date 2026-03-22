import { beforeEach, describe, expect, it, vi } from 'vitest';
import { ILike } from 'typeorm';
import { CreatePerformerDTO } from '@/components/performer/performer.dto';

const mocks = vi.hoisted(() => ({
  repository: {
    create: vi.fn(),
    save: vi.fn(),
    findOne: vi.fn(),
    findOneOrFail: vi.fn(),
    find: vi.fn(),
    findAndCount: vi.fn(),
  },
  validateOrReject: vi.fn(),
}));

vi.mock('@/components/performer/performer.repository', () => ({
  performerRepository: mocks.repository,
}));

vi.mock('class-validator', async importOriginal => {
  const actual = await importOriginal<typeof import('class-validator')>();
  return {
    ...actual,
    validateOrReject: mocks.validateOrReject,
  };
});

import { performerService } from '@/components/performer/performer.service';

describe('PerformerService', () => {
  beforeEach(() => {
    mocks.repository.create.mockReset();
    mocks.repository.save.mockReset();
    mocks.repository.findOne.mockReset();
    mocks.repository.findOneOrFail.mockReset();
    mocks.repository.find.mockReset();
    mocks.repository.findAndCount.mockReset();
    mocks.validateOrReject.mockReset();
  });

  it('creates performer', async () => {
    const payload: CreatePerformerDTO = {
      name: 'New Artist',
      social_url: 'https://instagram.com/newartist',
      label: 'Independent',
    };
    const entity = { id: 1, ...payload };

    mocks.repository.create.mockReturnValue(entity);
    mocks.repository.save.mockResolvedValue(entity);

    const result = await performerService.create(payload);

    expect(mocks.repository.create).toHaveBeenCalledWith(payload);
    expect(mocks.validateOrReject).toHaveBeenCalledWith(entity);
    expect(result).toEqual(entity);
  });

  it('delegates find', async () => {
    mocks.repository.find.mockResolvedValue([{ id: 1 }]);

    const result = await performerService.find({ where: { id: 1 } });

    expect(mocks.repository.find).toHaveBeenCalledWith({ where: { id: 1 } });
    expect(result).toEqual([{ id: 1 }]);
  });

  it('searches by name', async () => {
    mocks.repository.findAndCount.mockResolvedValue([[], 0]);

    await performerService.search({ name: 'rock', page: '2', limit: '5' });

    expect(mocks.repository.findAndCount).toHaveBeenCalledWith({
      where: { name: ILike('%rock%') },
      skip: 5,
      take: 5,
    });
  });
});
