import { Request, Response, NextFunction } from 'express';
import { Event } from './event.entity';
import { eventService } from './event.service';
import { CreateEventDTO, EventSearchParams } from './event.dto';
import { AppError } from '@/middlewares/error.middleware';
import { PaginatedEndpointResponse } from '@/lib/shared';

class EventController {
  constructor() {}

  create = async (
    req: Request<{}, {}, CreateEventDTO>,
    res: Response<Event>,
    next: NextFunction,
  ) => {
    try {
      const { title, description, venueId, performerIds } = req.body;
      const event = await eventService.create({
        title,
        description,
        venue: { id: venueId },
        performers: performerIds.map(p => ({ id: p })),
      });
      res.status(201).json(event);
    } catch (err) {
      next(err);
    }
  };

  getById = async (req: Request<{ id: string }>, res: Response<Event>, next: NextFunction) => {
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

  search = async (
    req: Request<{}, {}, {}, EventSearchParams>,
    res: Response<PaginatedEndpointResponse<Event>>,
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
