import { AuthService } from '../services/auth.service';
import { RequestHandler } from 'express';
import { QRAccessService } from '@/services/QRAccess.service';
import { QRAccessDTO } from '@/DTO/QRAccess.DTO';
import { plainToInstance } from 'class-transformer';

export class QRController {
    private authService: AuthService
    private qrService: QRAccessService
    constructor() {
        this.authService = new AuthService();
        this.qrService = new QRAccessService()
    }

    createQREntry: RequestHandler = async (req, res): Promise<void> => {
        await this.authService.validateToken('someToken') //TODO JUST A PLACEHOLDER
        const newAccessDTO = plainToInstance(QRAccessDTO, req.body);
        newAccessDTO.author='74d75a40-dbb1-44fd-8e71-e2e11473835c'
        const result = await this.qrService.createQRAccessEntry(newAccessDTO)
        res.send(result)
        // TEST CODE. TO RUN CORRECTLY CREATE A USER THROUGH ENDPOINT
        // AND PASTE VALID UID AS newAccessDTO.author
    }

    getQREntries: RequestHandler = async (req, res): Promise<void> => {
        //TODO Provide Entries by phone number or time period
    }
}

