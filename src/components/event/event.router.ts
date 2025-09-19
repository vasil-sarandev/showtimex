import { Router, json } from 'express';
import { eventController } from './event.controller';
import { authMiddleware } from '@/middlewares/auth';

export const eventRouter = Router();

eventRouter.use(authMiddleware);

eventRouter.post('/', json(), eventController.create);
eventRouter.get('/search', eventController.search);
eventRouter.get('/:id', eventController.getById);
