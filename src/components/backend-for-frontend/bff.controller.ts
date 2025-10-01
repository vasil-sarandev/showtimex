import { NextFunction, Request, Response } from 'express';
import { backendForFrontEndService } from './bff.service';
import { EventPageDataResponseDTO } from './bff.dto';
import { AppError } from '@/middlewares/error.middleware';

class BackendForFrontEndController {
  constructor() {}

  getEventPageData = async (
    req: Request<{ id: string }>,
    res: Response<EventPageDataResponseDTO>,
    next: NextFunction,
  ) => {
    try {
      const eventPageData = await backendForFrontEndService.getEventPageData(
        parseInt(req.params.id, 10),
      );
      res.status(200).json(eventPageData);
      throw new AppError(404, 'event not found');
    } catch (err) {
      next(err);
    }
  };
}

export const backendForFrontEndController = new BackendForFrontEndController();
