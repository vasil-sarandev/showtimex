import { Request, Response, NextFunction } from 'express';

export const loggerMiddleware = (req: Request, res: Response, next: NextFunction) => {
  const msg = `RECEIVED ${req.method} @ ${req.url} / ${Date.now()}`;
  console.log(msg);
  next();
};
