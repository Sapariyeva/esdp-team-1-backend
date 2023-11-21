import { Repository } from 'typeorm';
import { appDataSource } from '../dbConfig'
import { EQRAccess } from '@/entities/QRAccess.entity';
import { QRAccessDTO } from '@/DTO/QRAccess.DTO';
import { IQRAccess } from '@/interfaces/IQRAccess.interface';

export class QRAccessRepository extends Repository<EQRAccess> {
    constructor() {
        super(EQRAccess, appDataSource.createEntityManager());
    }

    async saveQRAccess(access:QRAccessDTO) : Promise<IQRAccess>{
        const newRecord = this.create(access)
        const dbAnswer = await this.save(newRecord)
        return dbAnswer
    }

    async delQRAccessById(id: string) : Promise<Boolean>{
        return true
    }

    async delQRAccessByPeriod(from: number, to:number) : Promise<Boolean>{
        return true
    }
}