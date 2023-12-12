import { Repository } from 'typeorm';
import { appDataSource } from '@/dbConfig'
import { EQRAccess } from '@/entities/QRAccess.entity';
import { QRAccessDTO } from '@/DTO/QRAccess.DTO';
import {IQRAccess} from '@/interfaces/IQRAccess.interface';
import {NotificationsRepository} from './notifications.repository';
import { FIRST_NOTIFICATION_TIME, SECOND_NOTIFICATION_TIME } from '@/constants';


export class QRAccessRepository extends Repository<EQRAccess> {
    notificationRepo: NotificationsRepository = new NotificationsRepository()
    constructor() {
        super(EQRAccess, appDataSource.createEntityManager());
    }

    async saveQRAccess(access: QRAccessDTO): Promise<IQRAccess> {
        const newRecord = this.create(access)
         return await this.save(newRecord)
    }

    async getQRAccessById(id: string): Promise<QRAccessDTO | undefined> {
        const extractedAccess = await this.findOne({
            'where': {
                id: id
            }
        })
        if (extractedAccess) {
            return extractedAccess
        } else {
            return
        }
    }

    async getAllQRAccess(): Promise<EQRAccess[]> {
        return await this.find()
    }

    async updateQRAccess(id: string, access: QRAccessDTO){
    await this.update(id, access)
        const updateAccess = {...access, id}
            await this.notificationRepo.saveNotification(
              await this.notificationRepo.makeExpirationNotification(updateAccess, FIRST_NOTIFICATION_TIME * 60 * 1000))
            await this.notificationRepo.saveNotification(
              await this.notificationRepo.makeExpirationNotification(updateAccess, SECOND_NOTIFICATION_TIME * 60 * 1000))
    }

    async delQRAccessById(id: string): Promise<Boolean> {
        const existingAccess = await this.findOne({where:{id}})

        if(!existingAccess) {
            return false
        }
        await this.delete(id)
        return true
    }

    // async delQRAccessByPeriod(from: number, to: number): Promise<Boolean> {
    //
    //     return true
    // }
}