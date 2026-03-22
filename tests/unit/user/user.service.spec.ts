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
});
