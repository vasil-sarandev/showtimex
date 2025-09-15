import { Router } from 'express';
import { authMiddleware } from '@/middlewares/auth';

export const paymentsRouter = Router();

paymentsRouter.use(authMiddleware);

paymentsRouter.post('/initiate');
