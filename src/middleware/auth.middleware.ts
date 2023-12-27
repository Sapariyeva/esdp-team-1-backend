import { envConfig } from "@/env";
import { RequestWithUser } from "@/interfaces/IRequest.interface";
import { ITokenPayload } from "@/interfaces/ITokenPayload.interface";
import { AuthService } from "@/services/auth.service";
import { RequestHandler } from "express-serve-static-core";
import * as jwt from "jsonwebtoken";

const authService = new AuthService();

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
    const user = await authService.getUserById(decoded.sub);
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
    const user = await authService.getUserById(decoded.sub);
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