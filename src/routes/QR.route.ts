import { Router } from 'express';
import { QRController } from '@/controllers/QR.controller';

export class QRRoute {
    public path = '/qr';
    public router = Router();
    private controller: QRController;

    constructor() {
        this.controller = new QRController();
        this.init();
    }

    private init() {
        this.router.post('/', this.controller.createQREntry);
        this.router.get('/', this.controller.getQREntries);
    }
}