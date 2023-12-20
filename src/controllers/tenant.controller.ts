import { TenantDTO } from "@/DTO/tenant.DTO";
import { TenantService } from "@/services/tenant.service";
import { DTOerrExtractor } from "@/utils/DTOErrorExtractor";
import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { RequestHandler } from "express";

export class TenantController {
    private service: TenantService;
    constructor() {
        this.service = new TenantService();
    }

    createTenantEntry: RequestHandler = async (req, res): Promise<void> => {
        const newTenant = plainToInstance(TenantDTO, req.body)
        const DTOerr = await validate(newTenant)
        if (DTOerr && DTOerr.length > 0) {
            res.status(400).send({
                success: false,
                error: DTOerrExtractor(DTOerr)
            })
        } else {
            const result = await this.service.createTenantEntry(newTenant)
            res.send({
                success: true,
                tenant: result
            })
        }
    }

    getTenantById: RequestHandler = async (req, res): Promise<void> => {
        const { id } = req.params;
        try {
            const tenant = await this.service.getTenantById(id);
            if (tenant) {
                res.status(200).send({
                    success: true,
                    tenant,
                });
            } else {
                res.status(404).send({
                    success: false,
                    error: 'Tenant not found',
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

    getAllTenants: RequestHandler = async (req, res) => {
        try {
            const tenants = await this.service.getAllTenants()

            res.status(200).send({
                success: true,
                payload: tenants
            })
        } catch (e) {
            console.log(e)
        }

    }
}