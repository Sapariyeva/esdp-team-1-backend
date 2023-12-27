import { Repository } from 'typeorm';
import { appDataSource } from '@/dbConfig'
import { EBuilding } from '@/entities/building.entity';
import { BuildingDTO } from '@/DTO/building.DTO';

export class BuildingsRepository extends Repository<EBuilding> {
    constructor() {
        super(EBuilding, appDataSource.createEntityManager());
    }

    async createBuilding(data: BuildingDTO): Promise<EBuilding> {
        const newRecord = this.create(data)
        return await this.save(newRecord)
    }

    async getBuildingById(id: string): Promise<EBuilding | null>{
        return await this.findOne({
            'where': {
                id: id
            }
        })
    }

    async getAllBuildings(): Promise<EBuilding[]>{
        return await this.find()
    }
}