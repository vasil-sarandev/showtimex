import express, { Router } from 'express';
import { userController } from './controller';
import { authMiddleware } from '@/middlewares/auth';

export const userRouter = Router();

userRouter.use(authMiddleware);

userRouter.post('/', express.json(), userController.createUser);
userRouter.get('/me', userController.getCurrentUser);
userRouter.get('/:id', userController.findUserById);
