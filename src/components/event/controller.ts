import { Request, Response, NextFunction } from 'express';
import { DeepPartial } from 'typeorm';
import { Event } from './entity';
import { eventService, IEventSearchParams } from './service';
import { AppError } from '@/middlewares/error';
import { IPaginatedEndpointResponse } from '@/lib/common';

class EventController {
  constructor() {}

  createEvent = async (
    req: Request<{}, DeepPartial<Event>>,
    res: Response<Event>,
    next: NextFunction,
  ) => {
    try {
      const event = await eventService.create(req.body);
      return res.status(200).json(event);
    } catch (err) {
      next(err);
    }
  };

  getEventById = async (req: Request<{ id: string }>, res: Response<Event>, next: NextFunction) => {
    try {
      const event = await eventService.findOne({ where: { id: parseInt(req.params.id) } });
      if (event) {
        return res.status(200).json(event);
      }
      throw new AppError(404, 'event not found');
    } catch (err) {
      next(err);
    }
  };

  searchEventsPaginated = async (
    req: Request<{}, {}, {}, IEventSearchParams>,
    res: Response<IPaginatedEndpointResponse<Event>>,
    next: NextFunction,
  ) => {
    try {
      const [data, totalCount] = await eventService.search(req.query);
      res.status(200).json({ data, totalCount });
    } catch (err) {
      next(err);
    }
  };
}

export const eventController = new EventController();
