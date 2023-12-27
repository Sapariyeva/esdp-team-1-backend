import { Repository } from 'typeorm';
import { appDataSource } from '@/dbConfig'
import { EOrganization } from '@/entities/organization.entity';
import { ETenant } from '@/entities/tenant.entity';
import { TenantDTO } from '@/DTO/tenant.DTO';

export class TenantRepository extends Repository<ETenant> {
    constructor() {
        super(ETenant, appDataSource.createEntityManager());
    }

    async createTenant(data: TenantDTO): Promise<EOrganization> {
        const newRecord = this.create(data)
        return await this.save(newRecord)
    }

    async getTenantById(id: string): Promise<ETenant | null> {
        return await this.findOne({
            'where': {
                id: id
            }
        })
    }

    async getAllTenants(): Promise<ETenant[]> {
        return await this.find()
    }
}