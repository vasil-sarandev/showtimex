import express from 'express';
import { eventController } from './controller';
import { authMiddleware } from '@/middlewares/auth';

export const eventRouter = express.Router();

eventRouter.use(authMiddleware);

eventRouter.post('/', express.json(), eventController.createEvent);
eventRouter.get('/search', eventController.searchEventsPaginated);
eventRouter.get('/:id', eventController.getEventById);
