import { Repository } from 'typeorm';
import { appDataSource } from '@/dbConfig'
import { ETenant } from '@/entities/tenant.entity';
import { ITenant } from '@/interfaces/ITenant.interface';
import { TenantDTO } from '@/DTO/tenant.DTO';

export class TenantRepository extends Repository<ETenant> {
    constructor() {
        super(ETenant, appDataSource.createEntityManager());
    }

    async createTenant(data: TenantDTO): Promise<ITenant> {
        const newRecord = this.create(data)
        return await this.save(newRecord)
    }

    async getTenantById(id: string): Promise<ITenant | null> {
        return await this.findOne({
            'where': {
                id: id
            }
        })
    }

    async getAllTenants(): Promise<TenantDTO[]> {
        return await this.find()
    }
}