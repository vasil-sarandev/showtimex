import { Router } from 'express';
import { userController } from './controller';
import { authMiddleware } from '@/middlewares/auth';

export const userRouter = Router();

userRouter.use(authMiddleware);
userRouter.get('/me', userController.getCurrentUser);
userRouter.get('/:id', userController.findUserById);
