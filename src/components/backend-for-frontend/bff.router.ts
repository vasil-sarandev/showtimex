import { Router } from 'express';
import { backendForFrontEndController } from './bff.controller';

export const backendForFrontEndRouter = Router();

backendForFrontEndRouter.get('/event-page/:id', backendForFrontEndController.getEventPageData);
