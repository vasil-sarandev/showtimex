import { Router } from 'express';
import { userRouter } from './user/router';

export const appRouter = Router();

appRouter.use('/users', userRouter);
