import { WeeklyScheduleDTO } from "@/DTO/schedule.DTO";
import { appDataSource } from "@/dbConfig";
import { EweeklySchedule } from "@/entities/schedule.entity";
// import { IQrFindOptions } from "@/interfaces/IFindOptions.interface";
// import { createQrFindOptions } from "@/utils/findOptionsBuilders/findQrOptionsCreator";
import { Repository } from "typeorm";
// import { NotificationsRepository } from "./notifications.repository";
import { ErrorWithStatus } from "@/interfaces/customErrors";

export class WeeklyScheduleRepository extends Repository<EweeklySchedule> {
  constructor() {
    super(EweeklySchedule, appDataSource.createEntityManager());
  }

  async createSchedule(schedule: WeeklyScheduleDTO): Promise<EweeklySchedule> {
    try {
      const newRecord = this.create(schedule);
      return await this.save(newRecord);
    }
    catch(e){
      console.log(e)
      throw new ErrorWithStatus('unknown server error', 500)
    }
  }

  async getScheduleById(id: string): Promise<EweeklySchedule | undefined> {
    const extractedSchedule = await this.findOne({ where: { id } });
    if (extractedSchedule) {
      return extractedSchedule;
    }
    return;
  }

  async getAllSchedules() {
    return await this.find();
  }
}
