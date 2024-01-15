import { RequestWithUser } from "@/interfaces/IRequest.interface";
import { IUser } from "@/interfaces/IUser";
import { ErrorWithStatus } from "@/interfaces/customErrors";
import { RequestHandler } from "express";

export const checkUserUpdate: RequestHandler = async (
  req: RequestWithUser,
  res,
  next
) => {
  try {
    const user = req.user!;
    const { id } = req.params;
    const updatedData = req.body as Partial<IUser>;
    if (user.id === id) {
      if (
        updatedData.isActive ||
        updatedData.role ||
        updatedData.canCreateQR ||
        updatedData.locks
      ) {
        throw new ErrorWithStatus('User can only update username or password', 403);
      } else {
        return next();
      }
    } else {
      return next();
    }
  } catch (err) {
    return next(err);
  }
}