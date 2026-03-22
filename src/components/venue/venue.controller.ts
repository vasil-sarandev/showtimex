import { NextFunction, Request, Response } from 'express';
import { venueService } from './venue.service';
import { CreateVenueDTO, VenueResponseDTO } from './venue.dto';
import { AppError } from '@/middlewares/error.middleware';
import { PaginatedEndpointResponse, PaginationParams } from '@/lib/shared';

export interface VenueSearchParams extends PaginationParams {
  name?: string;
}

class VenueController {
  constructor() {}

  create = async (
    req: Request<{}, {}, CreateVenueDTO>,
    res: Response<VenueResponseDTO>,
    next: NextFunction,
  ) => {
    try {
      const venue = await venueService.create(req.body);
      res.status(201).json(venue);
    } catch (err) {
      next(err);
    }
  };

  getById = async (
    req: Request<{ id: string }>,
    res: Response<VenueResponseDTO>,
    next: NextFunction,
  ) => {
    try {
      const venue = await venueService.findOne({ where: { id: parseInt(req.params.id) } });
      if (venue) {
        return res.status(200).json(venue);
      }
      throw new AppError(404, 'venue not found');
    } catch (err) {
      next(err);
    }
  };

  search = async (
    req: Request<{}, {}, {}, VenueSearchParams>,
    res: Response<PaginatedEndpointResponse<VenueResponseDTO>>,
    next: NextFunction,
  ) => {
    try {
      const [data, totalCount] = await venueService.search(req.query);
      return res.status(200).json({ data, totalCount });
    } catch (err) {
      next(err);
    }
  };
}

export const venueController = new VenueController();
