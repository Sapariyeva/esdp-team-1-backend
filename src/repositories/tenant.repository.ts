import { Repository } from 'typeorm';
import { appDataSource } from '@/dbConfig'
import { ETenant } from '@/entities/tenant.entity';
import { ITenant } from '@/interfaces/ITenant.interface';
import { TenantDTO } from '@/DTO/tenant.DTO';
import { isUUID } from 'class-validator';

export class TenantRepository extends Repository<ETenant> {
    constructor() {
        super(ETenant, appDataSource.createEntityManager());
    }

    async createTenant(data: TenantDTO): Promise<ITenant> {
        const newRecord = this.create(data)
        return await this.save(newRecord)
    }

    async getTenantById(id: string): Promise<ITenant | undefined> {
        if (!isUUID(id)) {
            return;
        }
        const extractedTenant = await this.findOne({
            where: { id },
        });
        if (extractedTenant) {
            return extractedTenant;
        } else {
            return;
        }
    }

    async getAllTenants(): Promise<TenantDTO[]> {
        return await this.find()
    }

    async updateTenant(id: string, data: Partial<ITenant>): Promise<ITenant | null> {
        const existingTenant = await this.findOne({ where: { id } });
        if (!existingTenant) {
            return null;
        }
        Object.assign(existingTenant, data);
        return existingTenant;
    }
}