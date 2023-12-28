import { TenantRepository } from "@/repositories/tenant.repository";
import { TenantDTO } from "@/DTO/tenant.DTO";
import { ITenant } from "@/interfaces/ITenant.interface";
import { validate } from 'class-validator';

export class TenantService {
    private tenantRepo: TenantRepository = new TenantRepository()

    constructor() { }

    async createTenantEntry(data: TenantDTO): Promise<ITenant | string> {
        const validationResult = await validate(data);
        if (validationResult.length > 0) {
            return validationResult[0].constraints?.[Object.keys(validationResult[0].constraints)[0]] || 'Validation failed.';
        }
        const newRecord = this.tenantRepo.create(data);
        return await this.tenantRepo.save(newRecord);
    }

    getTenantById = async (id: string) => {
        return await this.tenantRepo.getTenantById(id);
    };

    getAllTenants = async () => {
        return await this.tenantRepo.getAllTenants()
    }

    async updateTenant(id: string, data: Partial<ITenant>): Promise<ITenant | string> {
        const updatedTenant = await this.tenantRepo.updateTenant(id, data);
        if (!updatedTenant) {
            return "No building with this id was found.";
        }
        const validationResult = await validate({ ...updatedTenant, ...data });
        if (validationResult.length > 0) {
            return validationResult[0].constraints?.[Object.keys(validationResult[0].constraints)[0]] || 'Validation failed.';
        }
        return await this.tenantRepo.save(updatedTenant);
    }
}
