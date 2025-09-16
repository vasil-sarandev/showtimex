import { Router } from 'express';
import { paymentController } from './controller';
import { authMiddleware } from '@/middlewares/auth';

export const paymentsRouter = Router();

paymentsRouter.use(authMiddleware);

paymentsRouter.post('/initiate', paymentController.initiatePayment);
