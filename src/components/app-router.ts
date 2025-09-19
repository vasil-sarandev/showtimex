import { Router } from 'express';
import { userRouter } from './user/user.router';
import { paymentRouter } from './payment/payment.router';
import { eventRouter } from './event/event.router';

export const appRouter = Router();

appRouter.use('/users', userRouter);
appRouter.use('/payments', paymentRouter);
appRouter.use('/events', eventRouter);
