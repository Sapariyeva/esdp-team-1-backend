import { FindManyOptions, In, Repository } from 'typeorm';
import { appDataSource } from '@/dbConfig'
import { ETenant } from '@/entities/tenant.entity';
import { ITenant } from '@/interfaces/ITenant.interface';
import { TenantDTO, tenantFindOptionsDTO } from '@/DTO/tenant.DTO';
import { isUUID } from 'class-validator';
import { BuildingRepository } from './building.repository';

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
        return await this.find({ order: { name: 'ASC' } })
    }

    async getAllTenantsQuery(options: tenantFindOptionsDTO): Promise<ETenant[]> {
        let findOptions: FindManyOptions<ITenant> = {
            order: { name: 'ASC' }
        };
        if (options.buildingId) findOptions.where = { ...findOptions.where, buildingId: options.buildingId };
        if (options.organizationId) {
            const buildingsRepo = new BuildingRepository()
            const buildingIds = (await buildingsRepo.find(
                {
                    'where': {
                        organizationId: options.organizationId
                    }
                }
            )).map(b => { return b.id })
            findOptions.where = { ...findOptions.where, buildingId: In(buildingIds) }
        }
        if (options.tenants) {
            findOptions.where = { ...findOptions.where, id: In(options.tenants) }
        }
        return await this.find(findOptions)
    }

}