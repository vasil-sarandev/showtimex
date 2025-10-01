import { Request, Response, NextFunction } from 'express';
import { Event } from './event.entity';
import { eventService } from './event.service';
import { CreateEventDTO, EventResponseDTO } from './event.dto';
import { AppError } from '@/middlewares/error.middleware';
import { PaginatedEndpointResponse, PaginationParams } from '@/lib/shared';

export interface EventSearchParams extends PaginationParams {
  term?: string;
  venueId?: string;
  date?: string;
}

class EventController {
  constructor() {}

  create = async (
    req: Request<{}, {}, CreateEventDTO>,
    res: Response<Event>,
    next: NextFunction,
  ) => {
    try {
      const event = await eventService.create(req.body);
      res.status(201).json(event);
    } catch (err) {
      next(err);
    }
  };

  getById = async (
    req: Request<{ id: string }>,
    res: Response<EventResponseDTO>,
    next: NextFunction,
  ) => {
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
    res: Response<PaginatedEndpointResponse<EventResponseDTO>>,
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
