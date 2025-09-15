import { NextFunction, Request, Response } from 'express';
import { paymentService } from './service';

class PaymentController {
  initiatePayment = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = parseInt(req.user!.sub as string);
      const intent = await paymentService.initiatePayment({ userId, ticketId: req.body.ticketId });
      res.status(200).json({ intent_id: intent.id, secret: intent.client_secret });
    } catch (err) {
      next(err);
    }
  };
}

export const paymentController = new PaymentController();
