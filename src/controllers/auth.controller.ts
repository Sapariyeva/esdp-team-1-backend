import { RegisterUserDTO, SignInUserDTO } from "@/DTO/user.DTO";
import { AuthService } from '@/services/auth.service';
import { plainToInstance } from 'class-transformer';
import { validate } from "class-validator";
import { RequestHandler } from "express";

export class AuthController {
  private service: AuthService;
  constructor() {
    this.service = new AuthService();
  }

  register: RequestHandler = async (req, res, next): Promise<void> => {
    try {
        const newUser = plainToInstance(RegisterUserDTO, req.body);
        const DTOErr = await validate(newUser);
        if (DTOErr.length > 0) throw DTOErr;
        const result = await this.service.register(newUser);
        if (result) {
          res.status(201).send({
            success: true,
          });
        } else {
          res.status(500).send({
            success: false,
            error: "unknown internal server error",
          });
        }
    } catch (err) {
        next(err);
    }
  };

  signIn: RequestHandler = async (req, res, next): Promise<void> => {
    try {
        const credentials = plainToInstance(SignInUserDTO, req.body);
        const DTOErr = await validate(credentials);
        if (DTOErr.length > 0) throw DTOErr;
        const result = await this.service.signIn(credentials);
        res.status(200).send({
            success: true,
            ...result
        })
    } catch (err) {
        next(err);
    }
  }

  // setAllowedCreateQr: RequestHandler = async (req, res): Promise<void> => {
  // }
  //
  // authorizeUser: RequestHandler = async (req, res): Promise<void> => {
  // }
  //
  // logOut: RequestHandler = async (req, res): Promise<void> => {
  // }
}

