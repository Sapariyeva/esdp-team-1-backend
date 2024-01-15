import { FindManyOptions, In, Repository } from 'typeorm';
import { appDataSource } from '@/dbConfig'
import { EBuilding } from "@/entities/building.entity";
import { IBuilding } from "@/interfaces/IBuilding.interface";
import { BuildingDTO, buildingFindOptionsDTO } from "@/DTO/building.DTO";
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

    async getAllBuildings(): Promise<EBuilding[]> {
        return await this.find({ order: { name: 'ASC' } })
    }

    async getAllBuildingsQuery(options: buildingFindOptionsDTO): Promise<EBuilding[]> {
        let findOptions: FindManyOptions<IBuilding> = {
            order: { name: 'ASC' }
        };
        if (options.organizationId) findOptions.where = { ...findOptions.where, organizationId: options.organizationId };
        if (options.buildings) {
            findOptions.where = { ...findOptions.where, id: In(options.buildings) }
        }
        return await this.find(findOptions)
    }
}