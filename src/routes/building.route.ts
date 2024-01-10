import { Router } from "express";
import { BuildingController } from "@/controllers/building.controller";
import { checkAuth } from "@/middleware/auth.middleware";
import { checkRole } from "@/middleware/roleChecker.middleware";
import { ERole } from "@/types/roles";
import { checkEntityAccess } from "@/middleware/updateChecker.midleware";

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
      checkEntityAccess("building"),
      this.controller.getBuildingById
    );
    this.router.get("/", checkAuth, this.controller.getAllBuildings);
    this.router.put(
      "/:id",
      checkAuth,
      checkRole([ERole.umanuAdmin, ERole.organizationAdmin]),
      checkEntityAccess("building"),
      this.controller.updateBuilding
    );
  }
}
