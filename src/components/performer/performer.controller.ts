import { NextFunction, Request, Response } from 'express';
import { CreatePerformerDTO, PerformerResponseDTO } from './performer.dto';
import { performerService } from './performer.service';
import { AppError } from '@/middlewares/error.middleware';
import { PaginatedEndpointResponse, PaginationParams } from '@/lib/shared';

export interface PerformerSearchParams extends PaginationParams {
  name?: string;
}

class PerformerController {
  constructor() {}

  create = async (
    req: Request<{}, {}, CreatePerformerDTO>,
    res: Response<PerformerResponseDTO>,
    next: NextFunction,
  ) => {
    try {
      const performer = await performerService.create(req.body);
      res.status(201).json(performer);
    } catch (err) {
      next(err);
    }
  };

  getById = async (
    req: Request<{ id: string }>,
    res: Response<PerformerResponseDTO>,
    next: NextFunction,
  ) => {
    try {
      const performer = await performerService.findOne({ where: { id: parseInt(req.params.id) } });
      if (performer) {
        return res.status(200).json(performer);
      }
      throw new AppError(404, 'performer not found');
    } catch (err) {
      next(err);
    }
  };

  search = async (
    req: Request<{}, {}, {}, PerformerSearchParams>,
    res: Response<PaginatedEndpointResponse<PerformerResponseDTO>>,
    next: NextFunction,
  ) => {
    try {
      const [data, totalCount] = await performerService.search(req.query);
      return res.status(200).json({ data, totalCount });
    } catch (err) {
      next(err);
    }
  };
}

export const performerConroller = new PerformerController();
