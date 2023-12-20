import { Router } from 'express';
import { OrganizationController } from '@/controllers/organization.controller';

export class OrganizationRoute {
    public path = '/organizations';
    public router = Router();
    private controller: OrganizationController;

    constructor() {
        this.controller = new OrganizationController();
        this.init();
    }

    private init() {
        this.router.post('/', this.controller.createOrganizationEntry);
        this.router.get('/:id', this.controller.getOrganizationById);
        this.router.get('/', this.controller.getAllOrganizations);
    }
}
