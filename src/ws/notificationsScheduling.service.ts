import { app as runningApp } from "@/index";
import { INotificationToSendWS } from "@/interfaces/INotification.interface";
import { NotificationService } from "@/services/notifications.service";
import schedule from 'node-schedule';
import { ENotification } from "@/entities/Notification.entity";

export class WSNotificationsScheduler {
    private notificationService = new NotificationService()
    constructor() {
    }

    public scheduleNotifications = async () => {
        const notificationsToSchedule = await this.notificationService.getNotificationsToSchedule()
        const scheduledNotifiactionsIds = runningApp.notifierJobs.map((j) => {
            return j.notification.id
        })
        notificationsToSchedule.map((n) => {
            if (!scheduledNotifiactionsIds.includes(n.id)) {
                const date = new Date(n.trigger_at);
                const j = schedule.scheduleJob(date,
                    () => {
                        this.sendNotification(n)
                    })
                runningApp.notifierJobs.push({
                    notification: n,
                    job: j
                }
                )
            }
        })
    }

    private sendNotification = (notification: ENotification) => {
        const userSessions = runningApp.sessions.filter((s) => { return s.user === notification.author })
        if (userSessions && userSessions.length > 0) {
            const session = userSessions[0]
            const notificationToSend: INotificationToSendWS = {
                type: notification.type,
                triggeredAt: notification.trigger_at,
                message: notification.message
            }
            session.socket.emit('notifications', [notificationToSend])
            this.notificationService.setSentStatus([notification.id], true)
        }
        else {
            this.cancelJob(notification)
        }
    }

    public cancelJob(notification: ENotification) {
        runningApp.notifierJobs.filter((nj) => {
            return nj.notification.id === notification.id
        })[0]?.job.cancel()
        runningApp.notifierJobs = runningApp.notifierJobs.filter((nj) => {
            return nj.notification.id !== notification.id
        })
    }
}