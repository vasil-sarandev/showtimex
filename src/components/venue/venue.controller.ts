import { NextFunction, Request, Response } from 'express';
import { DeepPartial } from 'typeorm';
import { Venue } from './venue.entity';

class VenueController {
  constructor() {}

  create = async (
    req: Request<{}, DeepPartial<Venue>>,
    res: Response<Venue>,
    next: NextFunction,
  ) => {};
}

export const venueController = new VenueController();
