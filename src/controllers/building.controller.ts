import { BuildingDTO } from "@/DTO/building.DTO";
import { BuildingService } from "@/services/building.service";
import { DTOerrExtractor } from "@/utils/DTOErrorExtractor";
import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { RequestHandler } from "express";

export class BuildingController {
    private service: BuildingService;
    constructor() {
        this.service = new BuildingService();
    }

    createBuildingEntry: RequestHandler = async (req, res): Promise<void> => {
        const newBuild = plainToInstance(BuildingDTO, req.body)
        const DTOerr = await validate(newBuild)

        if (DTOerr && DTOerr.length > 0) {
            res.status(400).send({
                success: false,
                error: DTOerrExtractor(DTOerr)
            })
        } else {
            const result = await this.service.createBuildingEntry(newBuild)

            if (typeof result === 'string') {
                res.status(400).send({
                    success: false,
                    error: result,
                });
            } else {
                res.send({
                    success: true,
                    building: result
                })
            }
        }
    }

    getBuildingById: RequestHandler = async (req, res): Promise<void> => {
        const { id } = req.params;
        try {
            const building = await this.service.getBuildingById(id);
            if (building) {
                res.status(200).send({
                    success: true,
                    building,
                });
            } else {
                res.status(404).send({
                    success: false,
                    error: 'Building not found',
                });
            }
        } catch (error) {
            console.error(error);
            res.status(500).send({
                success: false,
                error: 'Internal Server Error',
            });
        }
    };

    getAllBuildings: RequestHandler = async (req, res) => {
        try {
            const buildings = await this.service.getAllBuildings()

            res.status(200).send({
                success: true,
                payload: buildings
            })
        } catch (e) {
            console.log(e)
        }
    }

    updateBuilding: RequestHandler = async (req, res): Promise<void> => {
        const { id } = req.params;
        const updatedData = plainToInstance(BuildingDTO, req.body);

        try {
            const result = await this.service.updateBuilding(id, updatedData);

            if (typeof result === 'string') {
                res.status(400).send({
                    success: false,
                    error: result,
                });
            } else {
                res.status(200).send({
                    success: true,
                    building: result,
                });
            }
        } catch (error) {
            console.error(error);
            res.status(500).send({
                success: false,
                error: 'Internal Server Error',
            });
        }
    };
}