import { Repository } from 'typeorm';
import { appDataSource } from '../dbConfig'
import { ELock } from '@/entities/lock.entity';
import { ILock } from '@/interfaces/Ilock.interface';
import { lockDTO } from '@/DTO/lock.DTO';

export class LockRepository extends Repository<ELock> {
    constructor() {
        super(ELock, appDataSource.createEntityManager());
    }

    async createLock(data: ILock): Promise<ILock> {
        const newRecord = this.create(data)
        const dbAnswer = await this.save(newRecord)
        return dbAnswer
    }

    async getLockById(id: string): Promise<ILock | null>{
        return await this.findOne({
            'where': {
                id: id
            }
        })
    }

    async getAllLocks(): Promise<lockDTO[]> {
        return await this.find()
    } 
}