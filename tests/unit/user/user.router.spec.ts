import express from 'express';
import request from 'supertest';
import { beforeEach, describe, expect, it, vi } from 'vitest';

const mocks = vi.hoisted(() => ({
  authMiddleware: vi.fn((req, _res, next) => next()),
  create: vi.fn((_req, res) => res.status(201).json({ id: 1 })),
  getCurrentUser: vi.fn((_req, res) => res.status(200).json({ id: 1 })),
  findById: vi.fn((_req, res) => res.status(200).json({ id: 1 })),
}));

vi.mock('@/middlewares/auth.middleware', () => ({ authMiddleware: mocks.authMiddleware }));
vi.mock('@/components/user/user.controller', () => ({
  userController: {
    create: mocks.create,
    getCurrentUser: mocks.getCurrentUser,
    findById: mocks.findById,
  },
}));

import { userRouter } from '@/components/user/user.router';

describe('userRouter', () => {
  beforeEach(() => {
    mocks.create.mockClear();
    mocks.getCurrentUser.mockClear();
    mocks.findById.mockClear();
  });

  it('routes GET /me', async () => {
    const app = express();
    app.use('/user', userRouter);

    const response = await request(app).get('/user/me');

    expect(response.status).toBe(200);
    expect(mocks.getCurrentUser).toHaveBeenCalledTimes(1);
  });

  it('routes GET /:id', async () => {
    const app = express();
    app.use('/user', userRouter);

    const response = await request(app).get('/user/1');

    expect(response.status).toBe(200);
    expect(mocks.findById).toHaveBeenCalledTimes(1);
  });

  it('routes POST /', async () => {
    const app = express();
    app.use('/user', userRouter);

    const response = await request(app).post('/user').send({});

    expect(response.status).toBe(201);
    expect(mocks.create).toHaveBeenCalledTimes(1);
  });
});
