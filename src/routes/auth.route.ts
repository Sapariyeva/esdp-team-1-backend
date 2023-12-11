import { Router } from 'express';
import { AuthController } from '@/controllers/auth.controller';
import { checkAuth } from '@/middleware/auth.middleware';

export class AuthRoute {
    public path = '/auth';
    public router = Router();
    private controller: AuthController;

    constructor() {
        this.controller = new AuthController();
        this.init();
    }

    private init() {
        this.router.post('/register', checkAuth, this.controller.register);
        this.router.post('/signin', this.controller.signIn)
    }
}