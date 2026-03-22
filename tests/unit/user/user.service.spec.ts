import { beforeEach, describe, expect, it, vi } from 'vitest';
import { CreateUserDTO } from '@/components/user/user.dto';

const mocks = vi.hoisted(() => ({
  repository: {
    create: vi.fn(),
    save: vi.fn(),
    findOne: vi.fn(),
  },
  validateOrReject: vi.fn(),
}));

vi.mock('@/components/user/user.repository', () => ({
  userRepository: mocks.repository,
}));

vi.mock('class-validator', async importOriginal => {
  const actual = await importOriginal<typeof import('class-validator')>();
  return {
    ...actual,
    validateOrReject: mocks.validateOrReject,
  };
});

import { userService } from '@/components/user/user.service';

describe('UserService', () => {
  beforeEach(() => {
    mocks.repository.create.mockReset();
    mocks.repository.save.mockReset();
    mocks.repository.findOne.mockReset();
    mocks.validateOrReject.mockReset();
  });

  it('creates user', async () => {
    const payload: CreateUserDTO = {
      first_name: 'John',
      last_name: 'Doe',
      email: 'john@example.com',
      phone_number: '+359888123456',
    };
    const entity = { id: 1, ...payload };

    mocks.repository.create.mockReturnValue(entity);
    mocks.repository.save.mockResolvedValue(entity);

    const result = await userService.create(payload);

    expect(mocks.repository.create).toHaveBeenCalledWith(payload);
    expect(mocks.validateOrReject).toHaveBeenCalledWith(entity);
    expect(result).toEqual(entity);
  });

  it('delegates findOne', async () => {
    mocks.repository.findOne.mockResolvedValue({ id: 4 });

    const result = await userService.findOne({ where: { id: 4 } });

    expect(mocks.repository.findOne).toHaveBeenCalledWith({ where: { id: 4 } });
    expect(result).toEqual({ id: 4 });
  });

  it('loads current user tickets with event and payment details', async () => {
    const user = {
      id: 4,
      tickets: [
        { id: 11, event: { date: '2026-05-10' }, payment: { id: 100 } },
        { id: 10, event: { date: '2026-04-01' }, payment: { id: 99 } },
      ],
    };
    mocks.repository.findOne.mockResolvedValue(user);

    const result = await userService.getCurrentUserTickets(4);

    expect(mocks.repository.findOne).toHaveBeenCalledWith({
      where: { id: 4 },
      relations: ['tickets', 'tickets.event', 'tickets.payment'],
    });
    expect(result).toEqual([
      { id: 10, event: { date: '2026-04-01' }, payment: { id: 99 } },
      { id: 11, event: { date: '2026-05-10' }, payment: { id: 100 } },
    ]);
  });
});
