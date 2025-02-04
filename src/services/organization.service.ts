import { OrganizationRepository } from '@/repositories/organization.repository';
import { OrganizationDTO, organizationFindOptionsDTO } from '@/DTO/organization.DTO';
import { IOrganization } from '@/interfaces/IOrganization.interface';
import { validate } from 'class-validator';
import { IUser } from '@/interfaces/IUser';
import { ERole } from '@/types/roles';
import { ErrorWithStatus } from '@/interfaces/customErrors';

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

    getAllOrganizationsQuery = async (user: IUser, options: organizationFindOptionsDTO) => {
        if ((user.role === ERole.organizationAdmin) && user.organizationId) {
            options.organizations = [user.organizationId]
        }
        if (!([ERole.umanuAdmin, ERole.organizationAdmin].includes(user.role))) {
            throw new ErrorWithStatus('User has no rights to access organizations data', 403)
        }
        return await this.organizationRepo.getAllOrganizationsQuery(options)
    }

    async updateOrganization(data: OrganizationDTO): Promise<boolean> {
        try {
            return !!(await this.organizationRepo.update(data.id, data))
        }
        catch (e) {
            throw new ErrorWithStatus('unknown server error', 500)
        }
    }
}