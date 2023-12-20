import { TenantRepository } from "@/repositories/tenant.repository";
import { TenantDTO } from "@/DTO/tenant.DTO";

export class TenantService {
    private tenantRepo: TenantRepository = new TenantRepository()

    constructor() { }

    createTenantEntry = async (data: TenantDTO) => {
        return await this.tenantRepo.createTenant(data)
    };

    getTenantById = async (id: string) => {
        return await this.tenantRepo.getTenantById(id);
    };

    getAllTenants = async () => {
        return await this.tenantRepo.getAllTenants()
    }
}
