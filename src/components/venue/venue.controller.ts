import { NextFunction, Request, Response } from 'express';
import { Venue } from './venue.entity';
import { venueService } from './venue.service';
import { CreateVenueDTO } from './venue.dto';
import { AppError } from '@/middlewares/error.middleware';

class VenueController {
  constructor() {}

  create = async (
    req: Request<{}, {}, CreateVenueDTO>,
    res: Response<Venue>,
    next: NextFunction,
  ) => {
    try {
      const venue = await venueService.create(req.body);
      res.status(200).json(venue);
    } catch (err) {
      next(err);
    }
  };

  getById = async (req: Request<{ id: string }>, res: Response<Venue>, next: NextFunction) => {
    try {
      const venue = await venueService.findOne({ where: { capacity: parseInt(req.params.id) } });
      if (venue) {
        return res.status(200).json(venue);
      }
      throw new AppError(404, 'venue not found');
    } catch (err) {
      next(err);
    }
  };
}

export const venueController = new VenueController();
