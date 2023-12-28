import { Router } from 'express';
import { TenantController } from '@/controllers/tenant.controller';

export class TenantRoute {
    public path = '/tenants';
    public router = Router();
    private controller: TenantController;

    constructor() {
        this.controller = new TenantController();
        this.init();
    }

    private init() {
        this.router.post('/', this.controller.createTenantEntry);
        this.router.get('/:id', this.controller.getTenantById);
        this.router.get('/', this.controller.getAllTenants);
        this.router.put('/:id', this.controller.updateTenant);
    }
}
