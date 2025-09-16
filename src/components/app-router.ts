import { Router } from 'express';
import { userRouter } from './user/router';
import { paymentRouter } from './payment/router';

export const appRouter = Router();

appRouter.use('/users', userRouter);
appRouter.use('/payments', paymentRouter);
