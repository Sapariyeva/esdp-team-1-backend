import { Router } from "express";
import { checkAuth } from "@/middleware/auth.middleware";
import { checkLockAccess } from "@/middleware/entityCheckers/locksChecker.middleware";
import { checkQuery } from "@/middleware/queryChecker.middleware";
import { IQrFindOptions } from "@/interfaces/IFindOptions.interface";
import { WeeklyQRController } from "@/controllers/weeklyQR.controller";

export class WeeklyQRRoute {
  public path = "/weeklyqr";
  public router = Router();
  private controller: WeeklyQRController;

  constructor() {
    this.controller = new WeeklyQRController();
    this.init();
  }

  private init() {
    this.router.post(
      "/",
      checkAuth,
      checkLockAccess,
      this.controller.createQREntry
    );
    this.router.get(
      "/",
      checkAuth,
      checkQuery<IQrFindOptions>("qr"),
      checkLockAccess,
      this.controller.getQREntries
    );
  }
}
