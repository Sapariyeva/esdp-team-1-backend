import { TenantDTO, tenantFindOptionsDTO } from "@/DTO/tenant.DTO";
import { RequestWithUser } from "@/interfaces/IRequest.interface";
import { ErrorWithStatus } from "@/interfaces/customErrors";
import { TenantService } from "@/services/tenant.service";
import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { RequestHandler } from "express";

export class TenantController {
    private service: TenantService = new TenantService();;
    constructor() { }

    createTenantEntry: RequestHandler = async (req, res, next): Promise<void> => {
        try {
            req.body.id = undefined
            const newTenant = plainToInstance(TenantDTO, req.body)
            const DTOerr = await validate(newTenant)
            if (DTOerr.length > 0) throw DTOerr;
            const result = await this.service.createTenantEntry(newTenant)
            if (result) {
                res.status(201).send({
                    success: true,
                });
            } else {
                res.status(500).send({
                    success: false,
                    error: "unknown internal server error",
                });
            }
        } catch (err) {
            next(err);
        }
    };

    getTenantById: RequestHandler = async (req, res, next): Promise<void> => {
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
        } catch (err) {
            next(err);
        }
    };

    getAllTenants: RequestHandler = async (req: RequestWithUser, res, next) => {
        try {
            const user = req.user
            const searchParams = plainToInstance(tenantFindOptionsDTO, req.query)
            const DTOerr = await validate(searchParams)
            if (!user) throw new ErrorWithStatus('Unauthorized request', 400)
            if (DTOerr && DTOerr.length > 0) throw DTOerr
            const tenants = await this.service.getAllTenantsQuery(user, searchParams)
            res.status(200).send({
                success: true,
                payload: tenants
            })
        } catch (err) {
            next(err);
        }
    }

    updateTenant: RequestHandler = async (req, res, next): Promise<void> => {
        try {
            const updatedData = plainToInstance(TenantDTO, req.body.updateData);
            console.log('!!!!!!!', updatedData)
            const DTOerr = await validate(updatedData);
            if (DTOerr && DTOerr.length > 0) throw DTOerr
            const result = await this.service.updateTenant(updatedData);
            if (result) {
                res.status(201).send({
                    success: true,
                });
            } else {
                throw new ErrorWithStatus("Update failed. Unknown server error", 500)
            }
        }
        catch (err) {
            next(err);
        }
    };
}