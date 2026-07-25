import { Router } from 'express';
import { systemController } from './system.controller';

export const systemRouter = Router();

systemRouter.get('/health', systemController.health);
