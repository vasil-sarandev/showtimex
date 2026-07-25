import { Request, Response } from 'express';

class SystemController {
  constructor() {}

  health = (req: Request, res: Response) => {
    res.status(200).json({ status: 'ok' });
  };
}

export const systemController = new SystemController();
