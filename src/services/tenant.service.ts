import { TenantRepository } from "@/repositories/tenant.repository";
import { TenantDTO, tenantFindOptionsDTO } from "@/DTO/tenant.DTO";
import { ITenant } from "@/interfaces/ITenant.interface";
import { validate } from 'class-validator';
import { IUser } from "@/interfaces/IUser";
import { ERole } from "@/types/roles";
import { ErrorWithStatus } from "@/interfaces/customErrors";
import { BuildingRepository } from "@/repositories/building.repository";
import { In } from "typeorm";

export class TenantService {
    private tenantRepo: TenantRepository = new TenantRepository()
    private buildingRepo: BuildingRepository = new BuildingRepository()
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

    getAllTenantsQuery = async (user: IUser, options: tenantFindOptionsDTO) => {
        if ((user.role === ERole.user)) {
            throw new ErrorWithStatus('User has no rights to access tenant data', 403)
        }
        if ((user.role === ERole.tenantAdmin) || (user.role === ERole.buildingAdmin)) {
            if (options.buildingId) {
                if (options.buildingId !== user.buildingId) {
                    throw new ErrorWithStatus('Building Id specified in query does not match building associated with this administrator', 403)
                }
                if (options.organizationId) {
                    const buildingFromFindOptions = await this.buildingRepo.findOneBy({
                        id: options.buildingId
                    })
                    if (buildingFromFindOptions?.organizationId !== options.organizationId) {
                        throw new ErrorWithStatus('Building Id specified in query does not match organization Id specified in query', 403)
                    }
                }
            }
            else if (options.organizationId && !options.buildingId) {
                const buildingFromUserData = await this.buildingRepo.findOneBy({
                    id: user.buildingId
                })
                if (buildingFromUserData?.organizationId !== options.organizationId) {
                    throw new ErrorWithStatus('Organization Id specified in query does not match organization associated with this administrator', 403)
                }
                else{
                    options.buildingId = user.buildingId
                }
            }
            else{
                options.buildingId = user.buildingId
            }
            if (options.tenants) {
                if (user.role === ERole.buildingAdmin) {
                    const tenantsFromFindOptions = await this.tenantRepo.find(
                        {
                            where: {
                                id: In(options.tenants)
                            }
                        }
                    )
                    if (tenantsFromFindOptions.every(async (t) => {
                        return (t.buildingId === user.buildingId)
                    })) {
                        throw new ErrorWithStatus('This building administrator has no acces to some of the inquired tenants', 403)
                    }
                }
                else {
                    options.tenants = [user.tenantId!]
                }
            }
        }
        if (user.role === ERole.organizationAdmin) {
            if (!options.organizationId) {
                options.organizationId = user.organizationId!
            }
            else if (!(options.organizationId === user.organizationId)) {
                throw new ErrorWithStatus('user has no rights to retrieve tenants from this organization', 400)
            }
            if (options.buildingId) {
                const buildingFromFindOptions = await this.buildingRepo.findOneBy({
                    id: options.buildingId
                })
                if (buildingFromFindOptions?.organizationId !== options.organizationId) {
                    throw new ErrorWithStatus('User has no rights to retrieve tenants from the building specified in query organization', 403)
                }
            }
            if (options.tenants) {
                const tenantsFromFindOptions = await this.tenantRepo.find(
                    {
                        where: {
                            id: In(options.tenants)
                        },
                        relations: {
                            building: true
                        }
                    }
                )
                if (!tenantsFromFindOptions.every(async (t) => {
                    return (t.building.organizationId === user.organizationId)
                })) {
                    throw new ErrorWithStatus('This organization administrator has no acces to some of the inquired tenants', 403)
                }
            }
        }
        return await this.tenantRepo.getAllTenantsQuery(options)
    }

    async updateTenant(data: TenantDTO): Promise<boolean> {
        try {
            return !!(await this.tenantRepo.update(data.id, data))
        }
        catch (e) {
            throw new ErrorWithStatus('unknown server error', 500)
        }
    }
}
