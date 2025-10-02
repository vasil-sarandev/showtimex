import { NextFunction, Request, Response } from 'express';
import { bffService } from './bff.service';
import { EventPageDataResponseDTO } from './dto/event-page.dto';
import { PerformerPageDTO } from './dto/performer-page.dto';
import { VenuePageDTO } from './dto/venue-page.dto';

class BackendForFrontEndController {
  constructor() {}

  getEventPageData = async (
    req: Request<{ id: string }>,
    res: Response<EventPageDataResponseDTO>,
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
    res: Response<PerformerPageDTO>,
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
    res: Response<VenuePageDTO>,
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
