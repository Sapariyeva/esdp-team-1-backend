import { IUserFindOptions } from "@/interfaces/IFindOptions.interface";
import { RequestWithFindOptions, RequestWithUser } from "@/interfaces/IRequest.interface";
import { ErrorWithStatus } from "@/interfaces/customErrors";
import { UserService } from "@/services/user.service";
import { RequestHandler } from "express";

export class UserController {
  private service: UserService;

  constructor() {
    this.service = new UserService();
  }

  getCurrentUser: RequestHandler = async (req: RequestWithUser, res, next) => {
    try {
      const user = req.user;
      if (!user) {
        throw new ErrorWithStatus("Unauthorized", 403);
      }
      res.status(200).send({
        success: true,
        payload: user,
      });
    } catch (err) {
      next(err);
    }
  };

  getUserById: RequestHandler = async (req, res, next): Promise<void> => {
    const { id } = req.params;
    try {
      const user = await this.service.getUserById(id);
      if (!user) {
        throw new ErrorWithStatus("Error getting user", 500);
      } else {
        res.status(200).send({
          success: true,
          payload: user,
        });
      }
    } catch (err) {
      next(err);
    }
  };

  getUsers: RequestHandler = async (
    req: RequestWithFindOptions<IUserFindOptions>,
    res,
    next
  ): Promise<void> => {
    try {
      const user = req.user;
      if (!user) {
        throw new ErrorWithStatus("Unauthorized", 403);
      }
      const findOptions = req.findOptions;
      const users = await this.service.getUsersQuery(user, findOptions);
      if (!users) {
        throw new ErrorWithStatus("Error getting QR access entries", 500);
      }
      res.status(200).send({
        success: true,
        payload: users,
      });
    } catch (err) {
      next(err);
    }
  };
}
