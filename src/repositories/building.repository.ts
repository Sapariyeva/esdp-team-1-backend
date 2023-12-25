import { Repository } from 'typeorm';
import { appDataSource } from '@/dbConfig'
import { EBuilding } from "@/entities/building.entity";
import { IBuilding } from "@/interfaces/IBuilding.interface";
import { BuildingDTO } from "@/DTO/building.DTO";
import { isUUID } from 'class-validator';

export class BuildingRepository extends Repository<EBuilding> {
    constructor() {
        super(EBuilding, appDataSource.createEntityManager());
    }

    async createBuilding(data: BuildingDTO): Promise<IBuilding> {
        const newRecord = this.create(data)
        return await this.save(newRecord)
    }

    async getBuildingById(id: string): Promise<IBuilding | undefined> {
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

    async getAllBuildings(): Promise<BuildingDTO[]> {
        return await this.find()
    }

    async updateBuilding(id: string, data: Partial<IBuilding>): Promise<IBuilding | null> {
        const existingBuilding = await this.findOne({ where: { id } });
        if (!existingBuilding) {
            return null;
        }
        Object.assign(existingBuilding, data);
        return existingBuilding;
    }
}