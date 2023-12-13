import { In, LessThan, MoreThan, Repository } from 'typeorm';
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

    async getNewNotifications(user: string, time: number) {
        return await this.find({
            where: {
                author: user,
                sent: false,
                trigger_at: LessThan(time)
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
        catch(e) {
            console.log(e)
            return false
        }

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

