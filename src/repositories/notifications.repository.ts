import { Between, In, MoreThan, Repository } from 'typeorm';
import { appDataSource } from '@/dbConfig'
import { ENotification } from '@/entities/Notification.entity';
import { QRAccessDTO, weeklyQRAccessDTO } from '@/DTO/QRAccess.DTO';
import { INotification } from '@/interfaces/INotification.interface';
import { ENotificationTypes } from '@/types/notifocations';
import { plainToInstance } from 'class-transformer';
import { NotificationDTO } from '@/DTO/notification.DTO';
import { NOTIFICATIONS_CUTOFF_TIME } from '@/constants';


export class NotificationsRepository extends Repository<ENotification> {
    constructor() {
        super(ENotification, appDataSource.createEntityManager());
    }

    async saveNotification(notification: NotificationDTO): Promise<boolean> {
        const newRecord = this.create(notification)
        const dbAnswer = await this.save(newRecord)
        return !!dbAnswer
    }

    async getAllNotifications() {
        return await this.find();
    }

    async getNewNotifications(user: string, time: number) {
        return await this.find({
            where: {
                author: user,
                sent: false,
                trigger_at: Between(time - NOTIFICATIONS_CUTOFF_TIME * 1000, time)
            },
            order: {
                trigger_at: 'ASC'
            }

        })
    }

    async getNotificationsToSchedule() {
        return await this.find({
            where: {
                sent: false,
                trigger_at: MoreThan(Date.now())
            },
            order: {
                trigger_at: 'ASC'
            }
        })
    }

    setSentStatus = async (idArr: string[], status: boolean) => {
        try {
            this.update(
                { id: In(idArr) },
                { sent: status },
            )
            return true
        }
        catch (e) {
            console.log(e)
            return false
        }

    }

    makeExpirationNotification = (access: QRAccessDTO | weeklyQRAccessDTO, triggerBeforeExpiration: number) => {
        const newNotification: INotification = {
            author: access.author,
            accessEntry: access.id,
            trigger_at: access.valid_to - triggerBeforeExpiration,
            sent: false,
            message: (access instanceof weeklyQRAccessDTO) ?
                `Permanent access UUID ${access.id} for guest with phone number ${access.phone} ` +
                `expires in ${Math.floor(triggerBeforeExpiration / 1000 / 60)} minutes` :
                `Access UUID ${access.id} for guest with phone number ${access.phone} ` +
                `expires in ${Math.floor(triggerBeforeExpiration / 1000 / 60)} minutes`,
            type: ENotificationTypes.expiring
        }
        return plainToInstance(NotificationDTO, newNotification)
    }
}

