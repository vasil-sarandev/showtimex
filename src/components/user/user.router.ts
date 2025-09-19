import { Router, json } from 'express';
import { userController } from './user.controller';
import { authMiddleware } from '@/middlewares/auth';

export const userRouter = Router();

userRouter.use(authMiddleware);

userRouter.post('/', json(), userController.create);
userRouter.get('/me', userController.getCurrentUser);
userRouter.get('/:id', userController.findById);
