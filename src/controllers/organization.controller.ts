import { OrganizationDTO } from "@/DTO/organization.DTO";
import { OrganizationService } from "@/services/organization.service";
import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { RequestHandler } from "express";

export class OrganizationController {
    private service: OrganizationService = new OrganizationService();
    constructor() { }

    createOrganizationEntry: RequestHandler = async (req, res, next): Promise<void> => {
        try {
            const newOrganization = plainToInstance(OrganizationDTO, req.body)
            const DTOerr = await validate(newOrganization)
            if (DTOerr.length > 0) throw DTOerr;
            const result = await this.service.createOrganizationEntry(newOrganization)
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

    getOrganizationById: RequestHandler = async (req, res, next): Promise<void> => {
        const { id } = req.params;
        try {
            const organization = await this.service.getOrganizationById(id);
            if (organization) {
                res.status(200).send({
                    success: true,
                    organization,
                });
            } else {
                res.status(404).send({
                    success: false,
                    error: 'Organization not found',
                });
            }
        } catch (err) {
            next(err);
        }
    };

    getAllOrganizations: RequestHandler = async (req, res, next) => {
        try {
            const organizations = await this.service.getAllOrganizations()
            res.status(200).send({
                success: true,
                payload: organizations
            });
        } catch (err) {
            next(err);
        }
    }

    updateOrganization: RequestHandler = async (req, res, next): Promise<void> => {
        const { id } = req.params;
        const updatedData = plainToInstance(OrganizationDTO, req.body);
        try {
            const result = await this.service.updateOrganization(id, updatedData);
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
}