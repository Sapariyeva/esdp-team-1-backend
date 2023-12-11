import { Router } from 'express';
import { AuthController } from '@/controllers/auth.controller';

export class AuthRoute {
    public path = '/auth';
    public router = Router();
    private controller: AuthController;

    constructor() {
        this.controller = new AuthController();
        this.init();
    }

    private init() {
        this.router.post('/register', this.controller.register);
        this.router.post('/signin', this.controller.signIn)
        this.router.post('/signout')
    }
}