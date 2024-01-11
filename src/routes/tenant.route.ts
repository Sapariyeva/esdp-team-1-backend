import { TenantController } from '@/controllers/tenant.controller';
import { checkAuth } from '@/middleware/auth.middleware';
import { checkRole } from '@/middleware/roleChecker.middleware';
import { checkEntityAccess } from '@/middleware/updateChecker.midleware';
import { buildUpdateEntity } from '@/middleware/updateEntitiesMerger.middleware copy';
import { ERole } from '@/types/roles';
import { Router } from 'express';

export class TenantRoute {
  public path = "/tenants";
  public router = Router();
  private controller: TenantController;

  constructor() {
    this.controller = new TenantController();
    this.init();
  }

  private init() {
    this.router.post(
      "/",
      checkAuth,
      checkRole([
        ERole.umanuAdmin,
        ERole.organizationAdmin,
        ERole.buildingAdmin,
      ]),
      this.controller.createTenantEntry
    );
    this.router.get(
      "/:id",
      checkAuth,
      checkEntityAccess("tenant"),
      this.controller.getTenantById
    );
    this.router.get("/", checkAuth, this.controller.getAllTenants);
    this.router.put(
      "/:id",
      checkAuth,
      checkRole([
        ERole.umanuAdmin,
        ERole.organizationAdmin,
        ERole.buildingAdmin,
      ]),
      checkEntityAccess('tenant'),
      buildUpdateEntity('tenant'),
      this.controller.updateTenant
    );
  }
}
