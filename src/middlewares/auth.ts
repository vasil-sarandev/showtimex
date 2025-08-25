import { Request, Response, NextFunction } from 'express';
import jwt, { JwtPayload } from 'jsonwebtoken';
import { AppError } from './error';
import { userService } from '@/components/user/service';
import { APP_MOCK_AUTH } from '@/config';

const JWT_SECRET = process.env.JWT_SECRET as string;

const mockMiddleware = async (req: Request, res: Response, next: NextFunction) => {
  const user = await userService.findOne({});
  if (!user) {
    throw new AppError(500, 'mock auth: no user exists in database.');
  }
  req.user = { sub: user.id.toString() };
  next();
};

const middleware = async (req: Request, res: Response, next: NextFunction) => {
  if (!req.headers.authorization) {
    throw new AppError(400, 'Missing authorization header');
  }
  const user = jwt.verify(req.headers.authorization, JWT_SECRET);
  req.user = user as JwtPayload;
  next();
};

export const authMiddleware = APP_MOCK_AUTH ? mockMiddleware : middleware;
