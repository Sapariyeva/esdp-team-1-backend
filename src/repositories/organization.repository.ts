import { Repository } from 'typeorm';
import { appDataSource } from '@/dbConfig'
import { IOrganization } from '@/interfaces/IOrganization.interface';
import { EOrganization } from '@/entities/organization.entity';
import { OrganizationDTO } from '@/DTO/organization.DTO';

export class OrganizationRepository extends Repository<EOrganization> {
    constructor() {
        super(EOrganization, appDataSource.createEntityManager());
    }

    async createOrganization(data: OrganizationDTO): Promise<IOrganization> {
        const newRecord = this.create(data)
        return await this.save(newRecord)
    }

    async getOrganizationById(id: string): Promise<IOrganization | null> {
        return await this.findOne({
            'where': {
                id: id
            }
        })
    }

    async getAllOrganizations(): Promise<OrganizationDTO[]> {
        return await this.find()
    }

}