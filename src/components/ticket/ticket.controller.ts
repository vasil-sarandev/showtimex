import { NextFunction, Request, Response } from 'express';
import { CreateTicketBatchDTO } from './ticket.dto';
import { Ticket, TicketStatus } from './ticket.entity';
import { ticketService } from './ticket.service';
import { AppError } from '@/middlewares/error.middleware';
import { PaginatedEndpointResponse, PaginationParams } from '@/lib/shared';

export interface TicketSearchParams extends PaginationParams {
  eventId: string;
  status?: TicketStatus;
}

class TicketController {
  constructor() {}

  createBatch = async (
    req: Request<{}, {}, CreateTicketBatchDTO>,
    res: Response<Ticket[]>,
    next: NextFunction,
  ) => {
    try {
      const tickets = await ticketService.createBatchTransaction(req.body);
      res.status(201).json(tickets);
    } catch (err) {
      next(err);
    }
  };

  getById = async (req: Request<{ id: string }>, res: Response<Ticket>, next: NextFunction) => {
    try {
      const ticket = await ticketService.findOne({ where: { id: parseInt(req.params.id) } });
      if (ticket) {
        return res.status(200).json(ticket);
      }
      throw new AppError(404, 'ticket not found');
    } catch (err) {
      next(err);
    }
  };

  search = async (
    req: Request<{}, {}, {}, TicketSearchParams>,
    res: Response<PaginatedEndpointResponse<Ticket>>,
    next: NextFunction,
  ) => {
    try {
      const [data, totalCount] = await ticketService.search(req.query);
      return res.status(200).json({ data, totalCount });
    } catch (err) {
      next(err);
    }
  };
}

export const ticketController = new TicketController();
