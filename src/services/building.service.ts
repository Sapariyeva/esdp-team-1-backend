import { BuildingRepository } from '@/repositories/building.repository';
import { BuildingDTO } from "@/DTO/building.DTO";
import { IBuilding } from '@/interfaces/IBuilding.interface';

export class BuildingService {
    private buildingRepo: BuildingRepository = new BuildingRepository()

    constructor() { }

    async createBuildingEntry(data: BuildingDTO): Promise<IBuilding | string> {
        const isNameUnique = await this.buildingRepo.isBuildingNameUnique(data.name);

        if (!isNameUnique) {
            return 'Building name must be unique.';
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

        if (data.name && data.name !== updatedBuilding.name) {
            const isNameUnique = await this.buildingRepo.isBuildingNameUnique(data.name);

            if (!isNameUnique) {
                return 'Building name must be unique.';
            }
        }

        return await this.buildingRepo.save(updatedBuilding);
    }
}
