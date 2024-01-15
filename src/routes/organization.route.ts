import { OrganizationController } from "@/controllers/organization.controller";
import { checkAuth } from "@/middleware/auth.middleware";
import { checkOrganizationAccess } from "@/middleware/entityCheckers/entityAccessChecker.midleware";
import { checkRole } from "@/middleware/roleChecker.middleware";
import { buildUpdateEntity } from "@/middleware/updateEntitiesMerger.middleware copy";
import { ERole } from "@/types/roles";
import { Router } from "express";

export class OrganizationRoute {
  public path = "/organizations";
  public router = Router();
  private controller: OrganizationController;

  constructor() {
    this.controller = new OrganizationController();
    this.init();
  }

  private init() {
    this.router.post(
      "/",
      checkAuth,
      checkRole([ERole.umanuAdmin]),
      this.controller.createOrganizationEntry
    );
    this.router.get(
      "/:id",
      checkAuth,
      checkOrganizationAccess,
      this.controller.getOrganizationById
    );
    this.router.get("/", checkAuth, this.controller.getAllOrganizations);
    this.router.put(
      "/:id",
      checkAuth,
      checkRole([ERole.umanuAdmin]),
      buildUpdateEntity("organization"),
      this.controller.updateOrganization
    );
  }
}
