import { WeeklyScheduleDTO } from "@/DTO/schedule.DTO";
import { WeeklyScheduleRepository } from "@/repositories/schedule.repository";

export class WeeklyScheduleService {
    private weeklyScheduleRepo: WeeklyScheduleRepository = new WeeklyScheduleRepository()
  
    constructor() { }
  
    creatEweeklySchedule = async (data: WeeklyScheduleDTO) => {
      return await this.weeklyScheduleRepo.createSchedule(data)
    };
  
    getAllWeeklySchedules = async () => {
      return await this.weeklyScheduleRepo.getAllSchedules()
    }

    getWeeklyScheduleById = async (id: string) => {
        return await this.weeklyScheduleRepo.getScheduleById(id);
    };
}