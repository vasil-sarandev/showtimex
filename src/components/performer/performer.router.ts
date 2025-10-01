import { json, Router } from 'express';
import { performerConroller } from './performer.controller';
import { authMiddleware } from '@/middlewares/auth.middleware';

export const performerRouter = Router();

performerRouter.use(authMiddleware);

performerRouter.post('/', json(), performerConroller.create);
performerRouter.get('/search', performerConroller.search);
performerRouter.get('/:id', performerConroller.getById);
