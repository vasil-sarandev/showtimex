import { NextFunction, Request, Response } from 'express';
import { userService } from './service';
import { AppError } from '@/middlewares/error';

interface ICreateUserRequestBody {
  first_name: string;
  last_name: string;
  email: string;
  phone_number?: string | undefined;
}

class UserController {
  createUser = async (
    req: Request<{}, {}, ICreateUserRequestBody>,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      const user = await userService.createUser(req.body);
      return res.status(200).json(user);
    } catch (err) {
      next(err);
    }
  };
  getCurrentUser = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const id = parseInt(req.user!.sub as string);
      const user = await userService.findOne({ where: { id } });
      if (user) {
        return res.status(200).json(user);
      }
      throw new AppError(404, 'no record in db for current user');
    } catch (err) {
      next(err);
    }
  };
  findUserById = async (req: Request<{ id: string }>, res: Response, next: NextFunction) => {
    try {
      const id = parseInt(req.params.id);
      const user = await userService.findOne({ where: { id } });
      if (user) {
        return res.status(200).json(user);
      }
      throw new AppError(404, `user not found`);
    } catch (err) {
      next(err);
    }
  };
}

export const userController = new UserController();
