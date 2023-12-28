import { Router } from 'express';
import { TenantController } from '@/controllers/tenant.controller';
import { checkAuth } from '@/middleware/auth.middleware';
import { checkRole } from '@/middleware/roleChecker.middleware';
import { ERole } from '@/types/roles';

export class TenantRoute {
    public path = '/tenants';
    public router = Router();
    private controller: TenantController;

    constructor() {
        this.controller = new TenantController();
        this.init();
    }

    private init() {
        this.router.post('/', checkAuth, checkRole([ERole.umanuAdmin, ERole.organizationAdmin]), this.controller.createTenantEntry);
        this.router.get('/:id', checkAuth, this.controller.getTenantById);
        this.router.get('/', checkAuth, this.controller.getAllTenants);
        this.router.put('/:id', checkAuth, this.controller.updateTenant);
    }
}
