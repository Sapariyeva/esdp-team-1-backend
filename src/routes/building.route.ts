import { Router } from 'express';
import { BuildingController } from '@/controllers/building.controller';

export class BuildingRoute {
    public path = '/buildings';
    public router = Router();
    private controller: BuildingController;

    constructor() {
        this.controller = new BuildingController();
        this.init();
    }

    private init() {
        this.router.post('/', this.controller.createBuildingEntry);
        this.router.get('/:id', this.controller.getBuildingById);
        this.router.get('/', this.controller.getAllBuildings);
        this.router.put('/:id', this.controller.updateBuilding);
    }
}
