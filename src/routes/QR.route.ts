import { Router } from 'express';
import { QRController } from '@/controllers/QR.controller';

export class QRRoute {
    public path = '/';
    public router = Router();
    private controller: QRController;

    constructor() {
        this.controller = new QRController();
        this.init();
    }

    private init() {
        this.router.post('/qr', this.controller.createQREntry);
        this.router.get('/qr', this.controller.getQREntries);
    }
}