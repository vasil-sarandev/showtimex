import { NextFunction, Request, Response } from 'express';
import { bffService } from './bff.service';
import { EventPageResponseDTO, PerformerPageResponseDTO, VenuePageResponseDTO } from './bff.dto';

class BackendForFrontEndController {
  constructor() {}

  getEventPageData = async (
    req: Request<{ id: string }>,
    res: Response<EventPageResponseDTO>,
    next: NextFunction,
  ) => {
    try {
      const eventPageData = await bffService.getEventPageData(parseInt(req.params.id, 10));
      return res.status(200).json(eventPageData);
    } catch (err) {
      next(err);
    }
  };

  getPerformerPageData = async (
    req: Request<{ id: string }>,
    res: Response<PerformerPageResponseDTO>,
    next: NextFunction,
  ) => {
    try {
      const performerPageData = await bffService.getPerformerPageData(parseInt(req.params.id, 10));
      return res.status(200).json(performerPageData);
    } catch (err) {
      next(err);
    }
  };

  getVenuePageData = async (
    req: Request<{ id: string }>,
    res: Response<VenuePageResponseDTO>,
    next: NextFunction,
  ) => {
    try {
      const venuePageData = await bffService.getVenuePageData(parseInt(req.params.id, 10));
      return res.status(200).json(venuePageData);
    } catch (err) {
      next(err);
    }
  };
}

export const bffController = new BackendForFrontEndController();
