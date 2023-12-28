import { Repository } from 'typeorm';
import { appDataSource } from '@/dbConfig'
import { IOrganization } from '@/interfaces/IOrganization.interface';
import { EOrganization } from '@/entities/organization.entity';
import { OrganizationDTO } from '@/DTO/organization.DTO';
import { isUUID } from 'class-validator';

export class OrganizationRepository extends Repository<EOrganization> {
    constructor() {
        super(EOrganization, appDataSource.createEntityManager());
    }

    async createOrganization(data: OrganizationDTO): Promise<IOrganization> {
        const newRecord = this.create(data)
        return await this.save(newRecord)
    }

    async getOrganizationById(id: string): Promise<IOrganization | undefined> {
        if (!isUUID(id)) {
            return;
        }
        const extractedBuilding = await this.findOne({
            where: { id },
        });
        if (extractedBuilding) {
            return extractedBuilding;
        } else {
            return;
        }
    }

    async getAllOrganizations(): Promise<OrganizationDTO[]> {
        return await this.find()
    }

    async updateOrganization(id: string, data: Partial<IOrganization>): Promise<IOrganization | null> {
        const existingOrganization = await this.findOne({ where: { id } });
        if (!existingOrganization) {
            return null;
        }
        Object.assign(existingOrganization, data);
        return existingOrganization;
    }
}