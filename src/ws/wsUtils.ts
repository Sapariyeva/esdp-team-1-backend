import { ENotification } from "@/entities/Notification.entity"
import { INotificationToSendWS } from "@/interfaces/INotification.interface"

export const extractNotificationToSend = (notification: ENotification) => {
    const notificationToSend: INotificationToSendWS = {
        id: notification.id,
        type: notification.type,
        triggeredAt: notification.trigger_at,
        message: notification.message
    }
    return notificationToSend
}