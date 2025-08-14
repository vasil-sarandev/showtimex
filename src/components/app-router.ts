import { Router } from 'express';
import { userRouter } from './user';

export const appRouter = Router();

appRouter.use('/users', userRouter);
