import { Router } from 'express';
import { AuthController } from '@/controllers/auth.controller';

export class AuthRoute {
    public path = '/';
    public router = Router();
    private controller: AuthController;

    constructor() {
        this.controller = new AuthController();
        this.init();
    }

    private init() {
        this.router.post('/users', this.controller.createUserEntry);
        this.router.post('/users/sessions', this.controller.authorizeUser);
        this.router.delete('/users/sessions', this.controller.logOut);
    }
}