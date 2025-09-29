import express, { json } from 'express';
import { venueController } from './venue.controller';
import { authMiddleware } from '@/middlewares/auth.middleware';

export const venueRouter = express.Router();

venueRouter.use(authMiddleware);

venueRouter.post('/', json(), venueController.create);
venueRouter.get(':id', venueController.getById);
