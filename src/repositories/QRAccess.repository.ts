import { Repository } from 'typeorm';
import { appDataSource } from '../dbConfig'
import { EQRAccess } from '@/entities/QRAccess.entity';
import { QRAccessDTO } from '@/DTO/QRAccess.DTO';
import { IQRAccess } from '@/interfaces/IQRAccess.interface';
import { NotificationsRepository } from './notifications.repository';

export class QRAccessRepository extends Repository<EQRAccess> {
    notificationRepo: NotificationsRepository = new NotificationsRepository()
    constructor() {
        super(EQRAccess, appDataSource.createEntityManager());
    }

    async saveQRAccess(access: QRAccessDTO): Promise<IQRAccess> {
        const newRecord = this.create(access)
        const dbAnswer = await this.save(newRecord)
        if (dbAnswer) {
            this.notificationRepo.saveNotification(
                this.notificationRepo.makeExpirationNotification(dbAnswer, 60 * 60 * 1000))
            this.notificationRepo.saveNotification(
                this.notificationRepo.makeExpirationNotification(dbAnswer, 15 * 60 * 1000))
        }
        return dbAnswer
    }

    async getQRAccessById(id: string): Promise<QRAccessDTO | undefined> {
        const extractedAccess = await this.findOne({
            'where': {
                id: id
            }
        })
        if (extractedAccess) {
            return extractedAccess
        }
        else {
            return
        }
    }

    async getAllQRAccess(): Promise<EQRAccess[]> {
        return await this.find()
    }

    async delQRAccessById(id: string): Promise<Boolean> {
        return true
    }

    async delQRAccessByPeriod(from: number, to: number): Promise<Boolean> {
        return true
    }
}