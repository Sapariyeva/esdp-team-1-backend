import { OrganizationDTO } from "@/DTO/organization.DTO";
import { OrganizationService } from "@/services/organization.service";
import { DTOerrExtractor } from "@/utils/DTOErrorExtractor";
import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { RequestHandler } from "express";

export class OrganizationController {
    private service: OrganizationService;
    constructor() {
        this.service = new OrganizationService();
    }

    createOrganizationEntry: RequestHandler = async (req, res): Promise<void> => {
        const newOrganization = plainToInstance(OrganizationDTO, req.body)
        const DTOerr = await validate(newOrganization)
        if (DTOerr && DTOerr.length > 0) {
            res.status(400).send({
                success: false,
                error: DTOerrExtractor(DTOerr)
            })
        } else {
            const result = await this.service.createOrganizationEntry(newOrganization)
            res.send({
                success: true,
                organization: result
            })
        }
    }

    getOrganizationById: RequestHandler = async (req, res): Promise<void> => {
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
        } catch (error) {
            console.error(error);
            res.status(500).send({
                success: false,
                error: 'Internal Server Error',
            });
        }
    };

    getAllOrganizations: RequestHandler = async (req, res) => {
        try {
            const organizations = await this.service.getAllOrganizations()

            res.status(200).send({
                success: true,
                payload: organizations
            })
        } catch (e) {
            console.log(e)
        }

    }
}