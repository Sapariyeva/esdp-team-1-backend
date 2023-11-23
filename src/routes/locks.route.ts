import { Router } from 'express';
import { LocksController } from '@/controllers/lock.controller';

export class LocksRoute {
    public path = '/';
    public router = Router();
    private controller: LocksController;

    constructor() {
        this.controller = new LocksController();
        this.init();
    }

    private init() {
        this.router.post('/locks', this.controller.createLockEntry);
    }
}