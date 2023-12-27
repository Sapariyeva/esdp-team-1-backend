import { FindManyOptions, In, Repository } from 'typeorm';
import { appDataSource } from '@/dbConfig'
import { ELock } from '@/entities/lock.entity';
import { ILock } from '@/interfaces/Ilock.interface';
import { lockDTO, lockFindOptionsDTO } from '@/DTO/lock.DTO';
import { BuildingsRepository } from './buildings.repository';

export class LockRepository extends Repository<ELock> {
    constructor() {
        super(ELock, appDataSource.createEntityManager());
    }

    async createLock(data: ILock): Promise<ILock> {
        const newRecord = this.create(data)
        return await this.save(newRecord)

    }

    async getLockById(id: string): Promise<ILock | null> {
        return await this.findOne({
            'where': {
                id: id
            }
        })
    }

    async getAllLocks(): Promise<lockDTO[]> {
        return await this.find()
    }

    async getAllLocksQuery(options: lockFindOptionsDTO): Promise<ELock[]> {
        let findOptions: FindManyOptions<ILock> = {
        };
        if (options.buildingId) findOptions.where = { ...findOptions.where, buildingId: options.buildingId };
        if (options.organizarionId) {
            const buildingsRepo = new BuildingsRepository()
            const buildingIds = (await buildingsRepo.find(
                {
                    'where': {
                        organizationId: options.organizarionId
                    }
                }
            )).map(b => { return b.id })
            findOptions.where = { ...findOptions.where, buildingId: In(buildingIds) }
        }
        if (options.locks) {
            findOptions.where = { ...findOptions.where, id: In(options.locks) }
        }
        return await this.find(findOptions)
    }
}