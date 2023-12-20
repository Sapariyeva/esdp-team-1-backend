import { OrganizationRepository } from '@/repositories/organization.repository';
import { OrganizationDTO } from '@/DTO/organization.DTO';

export class OrganizationService {
    private organizationRepo: OrganizationRepository = new OrganizationRepository;

    constructor() { }

    createOrganizationEntry = async (data: OrganizationDTO) => {
        return await this.organizationRepo.createOrganization(data)
    };

    getOrganizationById = async (id: string) => {
        return await this.organizationRepo.getOrganizationById(id);
    };

    getAllOrganizations = async () => {
        return await this.organizationRepo.getAllOrganizations()
    }
}
