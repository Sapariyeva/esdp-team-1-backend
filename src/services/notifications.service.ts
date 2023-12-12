import { NotificationsRepository } from "@/repositories/notifications.repository";
import { isUUID } from "class-validator";

export class NotificationService {
  private notificationsRepo: NotificationsRepository = new NotificationsRepository()

  constructor() { }

  getNewNotifications = async (user: string, time: number) => {
    return await this.notificationsRepo.getNewNotifications(user, time)
  }

  getNotificationsToSchedule = async () => {
    return await this.notificationsRepo.getNotificationsToSchedule()
  }

  setSentStatus = async (idArr: string[], status: boolean = false) => {
    if (idArr.some((e) => { return !isUUID(e) }) || (typeof status !== 'boolean')) {
      return
    }
    else{
      return await this.notificationsRepo.setSentStatus(idArr, status)
    }
  }
}

