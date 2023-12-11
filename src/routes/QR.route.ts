import { Router } from 'express';
import { QRController } from '@/controllers/QR.controller';
import { checkAuth } from '@/middleware/auth.middleware';

export class QRRoute {
    public path = '/qr';
    public router = Router();
    private controller: QRController;

    constructor() {
        this.controller = new QRController();
        this.init();
    }

    private init() {
        this.router.post('/', checkAuth, this.controller.createQREntry);
        this.router.get('/', this.controller.getQREntries);
    }
}