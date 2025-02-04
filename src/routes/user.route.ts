import { UserController } from "@/controllers/user.controller";
import { IUserFindOptions } from "@/interfaces/IFindOptions.interface";
import { checkAuth } from "@/middleware/auth.middleware";
import {
  checkAccessToUser,
  checkBuildingAccess,
  checkOrganizationAccess,
} from "@/middleware/entityCheckers/entityAccessChecker.midleware";
import { buildUpdateEntity } from "@/middleware/entityCheckers/updateEntitiesMerger.middleware";
import { checkUserUpdate } from "@/middleware/entityCheckers/userUpdateChecker.middleware";
import { checkQuery } from "@/middleware/queryChecker.middleware";
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
      checkQuery<IUserFindOptions>("user"),
      checkOrganizationAccess,
      checkBuildingAccess,
      this.controller.getUsers
    );
    this.router.get("/current", checkAuth, this.controller.getCurrentUser);
    this.router.get(
      "/:id",
      checkAuth,
      checkAccessToUser,
      this.controller.getCurrentUser
    );
    this.router.put(
      "/:id",
      checkAuth,
      checkAccessToUser,
      checkUserUpdate,
      buildUpdateEntity("user"),
      this.controller.updateUser
    );
  }
}
