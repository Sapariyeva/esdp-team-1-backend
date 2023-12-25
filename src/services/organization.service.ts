import { OrganizationRepository } from '@/repositories/organization.repository';
import { OrganizationDTO } from '@/DTO/organization.DTO';
import { IOrganization } from '@/interfaces/IOrganization.interface';
import { validate } from 'class-validator';

export class OrganizationService {
    private organizationRepo: OrganizationRepository = new OrganizationRepository;

    constructor() { }

    async createOrganizationEntry(data: OrganizationDTO): Promise<IOrganization | string> {
        const validationResult = await validate(data);
        if (validationResult.length > 0) {
            return validationResult[0].constraints?.[Object.keys(validationResult[0].constraints)[0]] || 'Validation failed.';
        }
        const newRecord = this.organizationRepo.create(data);
        return await this.organizationRepo.save(newRecord);
    }

    getOrganizationById = async (id: string) => {
        return await this.organizationRepo.getOrganizationById(id);
    };

    getAllOrganizations = async () => {
        return await this.organizationRepo.getAllOrganizations()
    }

    async updateOrganization(id: string, data: Partial<IOrganization>): Promise<IOrganization | string> {
        const updatedOrganization = await this.organizationRepo.updateOrganization(id, data);
        if (!updatedOrganization) {
            return "No organization with this id was found.";
        }
        const validationResult = await validate({ ...updatedOrganization, ...data });
        if (validationResult.length > 0) {
            return validationResult[0].constraints?.[Object.keys(validationResult[0].constraints)[0]] || 'Validation failed.';
        }
        return await this.organizationRepo.save(updatedOrganization);
    }
}