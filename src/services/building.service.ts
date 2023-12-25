import { BuildingRepository } from '@/repositories/building.repository';
import { BuildingDTO } from "@/DTO/building.DTO";
import { IBuilding } from '@/interfaces/IBuilding.interface';
import { validate } from 'class-validator';

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

    async updateBuilding(id: string, data: Partial<IBuilding>): Promise<IBuilding | string> {
        const updatedBuilding = await this.buildingRepo.updateBuilding(id, data);
        if (!updatedBuilding) {
            return "No building with this id was found.";
        }
        const validationResult = await validate({ ...updatedBuilding, ...data });
        if (validationResult.length > 0) {
            return validationResult[0].constraints?.[Object.keys(validationResult[0].constraints)[0]] || 'Validation failed.';
        }
        return await this.buildingRepo.save(updatedBuilding);
    }
}
