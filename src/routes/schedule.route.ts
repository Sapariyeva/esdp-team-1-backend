import { checkAuth } from "@/middleware/auth.middleware";
import { checkRole } from "@/middleware/roleChecker.middleware";
import { ERole } from "@/types/roles";
import { Router } from "express";
import { WeeklyScheduleController } from "@/controllers/schedule.controller";

export class WeeklyScheduleRoute {
  public path = "/schedules/weekly";
  public router = Router();
  private controller: WeeklyScheduleController;

  constructor() {
    this.controller = new WeeklyScheduleController();
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
        ERole.tenantAdmin
      ]),
      this.controller.createWeeklyScheduleEntry
    );
    this.router.get(
      "/:id",
      checkAuth,
      this.controller.getWeeklyScheduleById
    );
    this.router.get("/", checkAuth, this.controller.getAllWeeklySchedules);
  }
}
