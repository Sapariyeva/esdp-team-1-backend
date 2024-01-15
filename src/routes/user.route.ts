import { UserController } from "@/controllers/user.controller";
import { IUserFindOptions } from "@/interfaces/IFindOptions.interface";
import { checkAuth } from "@/middleware/auth.middleware";
import {
  checkAccessToUser,
  checkBuildingAccess,
  checkOrganizationAccess,
} from "@/middleware/entityCheckers/entityAccessChecker.midleware";
import { checkQuery } from "@/middleware/queryChecker.middleware";
import { checkRole } from "@/middleware/roleChecker.middleware";
import { ERole } from "@/types/roles";
import { Router } from "express";

export class UserRoute {
  public path = "/users";
  public router = Router();
  private controller: UserController;

  constructor() {
    this.controller = new UserController();
    this.init();
  }

  private init() {
    this.router.get(
      "/",
      checkAuth,
      checkRole([
        ERole.umanuAdmin,
        ERole.organizationAdmin,
        ERole.buildingAdmin,
        ERole.tenantAdmin,
      ]),
      checkQuery<IUserFindOptions>("user"),
      checkOrganizationAccess,
      checkBuildingAccess,
      this.controller.getUsers
    );
    this.router.get("/current", checkAuth, this.controller.getCurrentUser);
    this.router.get("/:id", checkAuth, checkAccessToUser, this.controller.getCurrentUser);
  }
}
