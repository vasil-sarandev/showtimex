import { Request, Response, NextFunction } from 'express';
import jwt, { JwtPayload } from 'jsonwebtoken';
import { AppError } from './error';
import { userService } from '@/components/user/service';
import { APP_MOCK_AUTH } from '@/config';

const JWT_SECRET = process.env.JWT_SECRET as string;

export interface IAuthenticatedRequest extends Request {
  user?: JwtPayload;
}

const mockMiddleware = async (req: IAuthenticatedRequest, res: Response, next: NextFunction) => {
  const user = await userService.findOne({});
  if (!user) {
    throw new AppError(500, 'mocked auth user does not exist');
  }
  req.user = user;
  next();
};

const middleware = async (req: IAuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const headerToken = req.headers.authorization;
    if (!headerToken) {
      throw new AppError(401, 'Unauthenticated');
    }
    const token = jwt.verify(headerToken as string, JWT_SECRET) as JwtPayload;

    const userMatch = await userService.findOne({
      where: { id: parseInt(token.sub as string) },
    });
    if (!userMatch) {
      throw new AppError(401, 'Unauthorized');
    }
    req.user = userMatch;
    next();
  } catch (err) {
    if (err instanceof AppError) throw err; // 401 thrown err
    throw new AppError(403, 'Failed to authenticate');
  }
};

export const authMiddleware = APP_MOCK_AUTH ? mockMiddleware : middleware;
