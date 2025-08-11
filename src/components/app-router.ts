import { Router } from 'express';
import { ticketsRouter } from './tickets/router';

export const appRouter = Router();

appRouter.use('/tickets', ticketsRouter);
