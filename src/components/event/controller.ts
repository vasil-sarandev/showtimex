import { Request, Response, NextFunction } from 'express';
import { DeepPartial } from 'typeorm';
import { Event } from './entity';
import { eventService } from './service';
import { AppError } from '@/middlewares/error';

class EventController {
  constructor() {}

  createEvent = async (req: Request<{}, DeepPartial<Event>>, res: Response, next: NextFunction) => {
    try {
      const event = await eventService.createEvent(req.body);
      return res.status(200).json(event);
    } catch (err) {
      next(err);
    }
  };

  getEventById = async (req: Request<{ id: string }>, res: Response, next: NextFunction) => {
    try {
      const event = await eventService.getEventById({ where: { id: parseInt(req.params.id) } });
      if (event) {
        return res.status(200).json(event);
      }
      throw new AppError(404, 'event not found');
    } catch (err) {
      next(err);
    }
  };
}

export const eventController = new EventController();
