import { Repository } from 'typeorm';
import { appDataSource } from '@/dbConfig'
import { ENotification } from '@/entities/Notification.entity';
import { QRAccessDTO } from '@/DTO/QRAccess.DTO';
import { INotification } from '@/interfaces/INotification.interface';
import { ENotificationTypes } from '@/types/notifocations';
import { plainToInstance } from 'class-transformer';
import { NotificationDTO } from '@/DTO/notification.DTO';


export class NotificationsRepository extends Repository<ENotification> {
    constructor() {
        super(ENotification, appDataSource.createEntityManager());
    }

    async saveNotification(notification: NotificationDTO): Promise<boolean> {
        const newRecord = this.create(notification)
        const dbAnswer = await this.save(newRecord)
        return !!dbAnswer
    }

    makeExpirationNotification = (access: QRAccessDTO, triggerBeforeExpiration: number) => {
        const newNotification: INotification = {
            author: access.author,
            accessEntry: access.id,
            trigger_at: access.valid_to - triggerBeforeExpiration,
            sent: false,
            message: `Access UUID ${access.id} for guest with phone number ${access.phone} ` +
                `expires in ${Math.floor(triggerBeforeExpiration / 1000 / 60)} minutes`,
            type: ENotificationTypes.expiring
        }
        return plainToInstance(NotificationDTO, newNotification)
    }
}

