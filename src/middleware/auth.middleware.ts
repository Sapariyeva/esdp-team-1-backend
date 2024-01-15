import { envConfig } from "@/env";
import { RequestWithUser } from "@/interfaces/IRequest.interface";
import { ITokenPayload } from "@/interfaces/ITokenPayload.interface";
import { UserService } from "@/services/user.service";
import { RequestHandler } from "express-serve-static-core";
import * as jwt from "jsonwebtoken";

const userService = new UserService();

export const checkAuth: RequestHandler = async (
  req: RequestWithUser,
  res,
  next
) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).send({
        success: false,
        message: "No authorization header",
      });
    }
    const token = authHeader.replace("Bearer ", "");
    if (!token) {
      return res.status(401).send({
        success: false,
        message: "No token present in the request",
      });
    }
    const decoded = jwt.verify(token, envConfig.secretPrivate) as ITokenPayload;
    const user = await userService.getUserById(decoded.sub);
    if (!user) {
      return res.status(401).send({
        success: false,
        message: "Authorization user not found",
      });
    }
    req.user = user;
    return next();
  } catch (err) {
    return next(err);
  }
};


export const checkRefresh: RequestHandler = async (
  req: RequestWithUser,
  res,
  next
) => {
  try {
    const refreshToken = req.header('refreshToken') as string;
    if (!refreshToken) {
      return res.status(401).send({
        success: false,
        message: "No refresh token present in the request",
      });
    }
    const decoded = jwt.verify(
      refreshToken,
      envConfig.secretPrivate
    ) as ITokenPayload;
    const user = await userService.getUserById(decoded.sub);
    if (!user) {
      return res.status(401).send({
        success: false,
        message: "Authorization user not found",
      });
    }
    req.user = user;
    return next();
  } catch (err) {
    return next(err);
  }
};