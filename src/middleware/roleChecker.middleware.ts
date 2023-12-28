import { RequestWithUser } from '@/interfaces/IRequest.interface';
import { ErrorWithStatus } from '@/interfaces/customErrors';
import { NextFunction, Response } from 'express';

export function checkRole(roles: string[]) {
  return (req: RequestWithUser, res: Response, next: NextFunction) => {
    try {
      const user = req.user;
      if (user && roles.includes(user.role)) {
        next();
      } else {
        throw new ErrorWithStatus("Access denied", 403);
      }
    } catch (err) {
      next(err);
    }
  };
}