import { NextFunction, Request, Response } from 'express';

class TicketsController {
  getAll = async (req: Request, res: Response, next: NextFunction) => {
    try {
      res.status(200).json([]);
    } catch (e) {
      next(e);
    }
  };

  getById = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const ticket = {};
      res.status(200).json(ticket);
    } catch (err) {
      next(err);
    }
  };

  createTicket = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const ticketObj = req.body;
      res.status(200).json(ticketObj);
    } catch (err) {
      next(err);
    }
  };
}

export const ticketsController = new TicketsController();
