import { plainToInstance } from 'class-transformer';
import { AuthService } from '../services/auth.service';
import { RequestHandler } from 'express';
import { userDTO } from '@/DTO/user.DTO';
// import { plainToInstance } from 'class-transformer';
// import { validate } from 'class-validator';

// import { ERole } from '@/types/roles';

export class AuthController {

    private service: AuthService
    constructor() {
        this.service = new AuthService();
    }

    createUserEntry: RequestHandler = async (req, res): Promise<void> => {
        const newUser = plainToInstance(userDTO, req.body)
        const result = await this.service.createUserEntry(newUser)
        res.send(result)
    }

    setAllowedCreateQr: RequestHandler = async (req, res): Promise<void> => {
    }

    authorizeUser: RequestHandler = async (req, res): Promise<void> => {
    }

    logOut: RequestHandler = async (req, res): Promise<void> => {
    }
}

