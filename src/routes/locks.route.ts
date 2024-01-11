import { Router } from 'express';
import { LocksController } from '@/controllers/lock.controller';
import { checkAuth } from '@/middleware/auth.middleware';
import { checkRole } from '@/middleware/roleChecker.middleware';
import { ERole } from '@/types/roles';
import { buildUpdateEntity } from '@/middleware/updateEntitiesMerger.middleware copy';

export class LocksRoute {
    public path = '/locks';
    public router = Router();
    private controller: LocksController;

    constructor() {
        this.controller = new LocksController();
        this.init();
    }

    private init() {
        this.router.post('/', checkAuth, checkRole([ERole.umanuAdmin]), this.controller.createLockEntry);
        this.router.get('/', checkAuth, this.controller.getAllLocksQuery)
        this.router.put('/:id', checkAuth, 
        checkRole([ERole.umanuAdmin]), 
        buildUpdateEntity('lock'), 
        this.controller.updateLock);
    }
}