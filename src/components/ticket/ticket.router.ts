import { json, Router } from 'express';
import { ticketController } from './ticket.controller';
import { authMiddleware } from '@/middlewares/auth.middleware';

export const ticketRouter = Router();

ticketRouter.use(authMiddleware);
ticketRouter.post('/batch', json(), ticketController.createBatch);
ticketRouter.get('/search', ticketController.search);
ticketRouter.get('/:id', ticketController.getById);
