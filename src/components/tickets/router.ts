import { Router } from 'express';
import { ticketsController } from './controller';

export const ticketsRouter = Router();

ticketsRouter.get('/', ticketsController.getAll);
ticketsRouter.get('/:id', ticketsController.getById);
ticketsRouter.post('/', ticketsController.createTicket);
