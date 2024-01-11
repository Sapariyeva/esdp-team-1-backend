import { BuildingRepository } from '@/repositories/building.repository';
import { BuildingDTO, buildingFindOptionsDTO } from "@/DTO/building.DTO";
import { IBuilding } from '@/interfaces/IBuilding.interface';
import { validate } from 'class-validator';
import { IUser } from '@/interfaces/IUser';
import { ERole } from '@/types/roles';
import { ErrorWithStatus } from '@/interfaces/customErrors';

export class BuildingService {
    private buildingRepo: BuildingRepository = new BuildingRepository()
    constructor() { }

    async createBuildingEntry(data: BuildingDTO): Promise<IBuilding | string> {
        const validationResult = await validate(data);
        if (validationResult.length > 0) {
            return validationResult[0].constraints?.[Object.keys(validationResult[0].constraints)[0]] || 'Validation failed.';
        }
        const newRecord = this.buildingRepo.create(data);
        return await this.buildingRepo.save(newRecord);
    }

    getBuildingById = async (id: string) => {
        return await this.buildingRepo.getBuildingById(id);
    };

    getAllBuildings = async () => {
        return await this.buildingRepo.getAllBuildings()
    }

    async updateBuilding(data: BuildingDTO): Promise<boolean> {
        try {
            return !!(await this.buildingRepo.update(data.id, data))
        }
        catch (e) {
            throw new ErrorWithStatus('unknown server error', 500)
        }
    }

    getAllBuildingsQuery = async (user: IUser, options: buildingFindOptionsDTO) => {
        if ((user.role === ERole.organizationAdmin)) {
            if (!options.organizationId) {
                options.organizationId = user.organizationId
            }
            else if (options.organizationId && (options.organizationId !== user.organizationId)) {
                throw new ErrorWithStatus('User has no acces to the organization specified in query', 403)
            }
            else {
                if (options.buildings) {
                    const buildingsOfOrganization = (await this.buildingRepo.find(
                        {
                            where: {
                                organizationId: options.organizationId
                            }
                        }
                    )).map(b => { return b.id })
                    if (!options.buildings.every((b) => { return buildingsOfOrganization.includes(b) })) {
                        throw new ErrorWithStatus('User has no acces to some of the buildings specified in query', 403)
                    }
                }
            }
        }
        else if ((user.role === ERole.buildingAdmin)) {
            if (user.buildingId) {
                if (options.organizationId) {
                    const orgFromUserData = await this.buildingRepo.getBuildingById(user.buildingId!)
                    if (orgFromUserData?.organizationId !== options.organizationId) {
                        throw new ErrorWithStatus('Organization id specified in query does not match organization associated with this user', 403)
                    }
                }
                options.buildings = [user.buildingId!]
            }
            else{
                options.buildings = []
            }
        }
        else if (!([ERole.buildingAdmin, ERole.organizationAdmin, ERole.umanuAdmin].includes(user.role))) {
            throw new ErrorWithStatus('User has no rights to access building data', 403)
        }
        return await this.buildingRepo.getAllBuildingsQuery(options)
    }
}

