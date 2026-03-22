import { beforeEach, describe, expect, it, vi } from 'vitest';
import { AppError } from '@/middlewares/error.middleware';
import { userController } from '@/components/user/user.controller';

type CreateArgs = Parameters<typeof userController.create>;
type CurrentArgs = Parameters<typeof userController.getCurrentUser>;
type ByIdArgs = Parameters<typeof userController.findById>;

const mocks = vi.hoisted(() => ({
  userService: {
    create: vi.fn(),
    findOne: vi.fn(),
  },
}));

vi.mock('@/components/user/user.service', () => ({
  userService: mocks.userService,
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

describe('UserController', () => {
  beforeEach(() => {
    mocks.userService.create.mockReset();
    mocks.userService.findOne.mockReset();
  });

  it('create returns 201', async () => {
    const req = {
      body: {
        first_name: 'John',
        last_name: 'Doe',
        email: 'john@example.com',
        phone_number: null,
      },
    };
    const res = createRes();
    const next = vi.fn();

    mocks.userService.create.mockResolvedValue({ id: 1, ...req.body });

    await userController.create(
      req as unknown as CreateArgs[0],
      res as unknown as CreateArgs[1],
      next as unknown as CreateArgs[2],
    );

    expect(res.status).toHaveBeenCalledWith(201);
  });

  it('getCurrentUser returns user by token sub', async () => {
    const req = { user: { sub: '8' } };
    const res = createRes();
    const next = vi.fn();

    mocks.userService.findOne.mockResolvedValue({ id: 8 });

    await userController.getCurrentUser(
      req as unknown as CurrentArgs[0],
      res as unknown as CurrentArgs[1],
      next as unknown as CurrentArgs[2],
    );

    expect(mocks.userService.findOne).toHaveBeenCalledWith({ where: { id: 8 } });
    expect(res.status).toHaveBeenCalledWith(200);
  });

  it('findById forwards not found', async () => {
    const req = { params: { id: '77' } };
    const res = createRes();
    const next = vi.fn();

    mocks.userService.findOne.mockResolvedValue(null);

    await userController.findById(
      req as unknown as ByIdArgs[0],
      res as unknown as ByIdArgs[1],
      next as unknown as ByIdArgs[2],
    );

    const err = next.mock.calls[0][0] as AppError;
    expect(err.status).toBe(404);
    expect(err.message).toBe('user not found');
  });
});
