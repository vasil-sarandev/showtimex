import { Request, Response, NextFunction } from 'express';

const DEFAULT_ERROR_STATUS = 500;
const DEFAULT_ERROR_MSG = 'An unexpected error has ocurred.';

export interface IAppError extends Error {
  status: number;
}

export class AppError extends Error implements IAppError {
  status: number;
  constructor(status?: number, message?: string) {
    super(message);
    this.status = status ?? DEFAULT_ERROR_STATUS;
    this.message = message ?? DEFAULT_ERROR_MSG;
  }
}

export const errorMiddleware = (err: AppError, req: Request, res: Response, next: NextFunction) => {
  if (!err) {
    next();
  }
  if (err instanceof AppError) {
    return res.status(err.status).json({ message: err.message });
  }
  // unexpected/uncaught errors
  console.error(err);
  return res.status(DEFAULT_ERROR_STATUS).json({ message: err || DEFAULT_ERROR_MSG });
};
