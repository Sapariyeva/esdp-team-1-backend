import { plainToInstance } from 'class-transformer';
import { AuthService } from '../services/auth.service';
import { RequestHandler } from 'express';
import { userDTO } from '@/DTO/user.DTO';
import { validate } from 'class-validator';
import { DTOerrExtractor } from '@/utils/DTOErrorExtractor';

export class AuthController {
    private service: AuthService
    constructor() {
        this.service = new AuthService();
    }

    createUserEntry: RequestHandler = async (req, res): Promise<void> => {
        const newUser = plainToInstance(userDTO, req.body)
        const DTOerr = await validate(newUser)
        if (DTOerr && DTOerr.length > 0) {
            res.status(400).send({
                success: false,
                error: DTOerrExtractor(DTOerr)
            })
        }
        else {
            const result = await this.service.createUserEntry(newUser)
            if (result) {
                res.send({
                    success: true
                })
            }
            else {
                res.status(500).send({
                    success: false,
                    errror: 'unknown internal server error'
                })
            }
        }
    }

    setAllowedCreateQr: RequestHandler = async (req, res): Promise<void> => {
    }

    authorizeUser: RequestHandler = async (req, res): Promise<void> => {
    }

    logOut: RequestHandler = async (req, res): Promise<void> => {
    }
}

