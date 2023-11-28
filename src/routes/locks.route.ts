import { Router } from 'express';
import { LocksController } from '@/controllers/lock.controller';

export class LocksRoute {
    public path = '/locks';
    public router = Router();
    private controller: LocksController;

    constructor() {
        this.controller = new LocksController();
        this.init();
    }

    private init() {
        this.router.post('/', this.controller.createLockEntry);
        this.router.get('/', this.controller.getAllLocks)
    }
}