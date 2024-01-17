import { BuildingController } from "@/controllers/building.controller";
import { checkAuth } from "@/middleware/auth.middleware";
import { checkBuildingAccess } from "@/middleware/entityCheckers/entityAccessChecker.midleware";
import { checkRole } from "@/middleware/roleChecker.middleware";
import { buildUpdateEntity } from "@/middleware/entityCheckers/updateEntitiesMerger.middleware";
import { ERole } from "@/types/roles";
import { Router } from "express";

export class BuildingRoute {
  public path = "/buildings";
  public router = Router();
  private controller: BuildingController;

  constructor() {
    this.controller = new BuildingController();
    this.init();
  }

  private init() {
    this.router.post(
      "/",
      checkAuth,
      checkRole([ERole.umanuAdmin]),
      this.controller.createBuildingEntry
    );
    this.router.get(
      "/:id",
      checkAuth,
      checkBuildingAccess,
      this.controller.getBuildingById
    );
    this.router.get("/", checkAuth, this.controller.getAllBuildings);
    this.router.put(
      "/:id",
      checkAuth,
      checkRole([ERole.umanuAdmin, ERole.organizationAdmin]),
      checkBuildingAccess,
      buildUpdateEntity("building"),
      this.controller.updateBuilding
    );
  }
}
