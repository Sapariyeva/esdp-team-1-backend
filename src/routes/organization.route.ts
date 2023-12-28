import { Router } from 'express';
import { OrganizationController } from '@/controllers/organization.controller';
import { checkAuth } from '@/middleware/auth.middleware';
import { checkRole } from '@/middleware/roleChecker.middleware';
import { ERole } from '@/types/roles';

export class OrganizationRoute {
    public path = '/organizations';
    public router = Router();
    private controller: OrganizationController;

    constructor() {
        this.controller = new OrganizationController();
        this.init();
    }

    private init() {
        this.router.post('/', checkAuth, checkRole([ERole.umanuAdmin]), this.controller.createOrganizationEntry);
        this.router.get('/:id', checkAuth, this.controller.getOrganizationById);
        this.router.get('/', checkAuth, this.controller.getAllOrganizations);
        this.router.put('/:id', checkAuth, this.controller.updateOrganization);
    }
}
