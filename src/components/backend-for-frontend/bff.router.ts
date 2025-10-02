import { Router } from 'express';
import { bffController } from './bff.controller';

export const bffRouter = Router();

bffRouter.get('/event-page/:id', bffController.getEventPageData);
bffRouter.get('/performer-page/:id', bffController.getPerformerPageData);
bffRouter.get('/venue-page/:id', bffController.getVenuePageData);
