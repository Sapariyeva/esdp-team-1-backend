import { UpdateUserDTO } from "@/DTO/user.DTO";
import { IUserFindOptions } from "@/interfaces/IFindOptions.interface";
import { RequestWithFindOptions, RequestWithUser } from "@/interfaces/IRequest.interface";
import { ErrorWithStatus } from "@/interfaces/customErrors";
import { UserService } from "@/services/user.service";
import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
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
      res.status(400).send({
        success: true,
        payload: users,
      });
    } catch (err) {
      next(err);
    }
  };

  updateUser: RequestHandler = async (req, res, next): Promise<void> => {
    try {
      const { id } = req.params;
      const updatedData = plainToInstance(UpdateUserDTO, req.body);
      const DTOerr = await validate(updatedData, { whitelist: true });
      const isDtoEmpty = Object.values(updatedData).every(v => v === undefined);
      if (isDtoEmpty) {
        throw new ErrorWithStatus('Data for user update not provided', 400);
      }
      if (DTOerr && DTOerr.length > 0) throw DTOerr;
      const result = await this.service.updateUser(id, updatedData);
      if (result) {
        res.status(201).send({
          success: true,
        });
      } else {
        throw new ErrorWithStatus("Update failed. Unknown server error", 500);
      }
    } catch (err) {
      next(err);
    }
  };
}
