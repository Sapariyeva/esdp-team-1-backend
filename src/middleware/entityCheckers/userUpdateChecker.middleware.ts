import { RequestWithUser } from "@/interfaces/IRequest.interface";
import { IUser } from "@/interfaces/IUser";
import { ErrorWithStatus } from "@/interfaces/customErrors";
import { UserRepository } from "@/repositories/user.repository";
import { ERole } from "@/types/roles";
import { RequestHandler } from "express";

export const checkUserUpdate: RequestHandler = async (
  req: RequestWithUser,
  res,
  next
) => {
  try {
    const userRepo = new UserRepository();
    const user = req.user!;
    const { id } = req.params;
    const prefindedUser = await userRepo.findOne({ where: { id } });
    const updatedData = req.body as Partial<IUser>;
    if (user.id === id) {
      if (
        updatedData.isActive ||
        updatedData.canCreateQR ||
        updatedData.locks
      ) {
        throw new ErrorWithStatus('User can only update username or password', 403);
      } else {
        return next();
      }
    } else {
      if (updatedData.locks) {
        switch (prefindedUser!.role) {
          case ERole.umanuAdmin:
          case ERole.buildingAdmin:
          case ERole.organizationAdmin:
            throw new ErrorWithStatus('Cannot add locks due to the user role', 400);
          default:
            return next();;
        }
      } else {
        return next();
      }
    }
  } catch (err) {
    return next(err);
  }
}