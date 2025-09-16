import { Router } from 'express';
import { paymentService } from './service';
import { authMiddleware } from '@/middlewares/auth';

export const paymentsRouter = Router();

paymentsRouter.use(authMiddleware);

paymentsRouter.post('/initiate', paymentService.initiatePaymentTransaction);
