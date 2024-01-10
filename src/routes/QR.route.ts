import { Router } from 'express';
import { QRController } from '@/controllers/QR.controller';
import { checkAuth } from '@/middleware/auth.middleware';
import { checkLockAccess } from '@/middleware/locksChecker.middleware';
import { checkQuery } from '@/middleware/queryChecker.middleware';
import { IQrFindOptions } from '@/interfaces/IFindOptions.interface';

export class QRRoute {
    public path = '/qr';
    public router = Router();
    private controller: QRController;

    constructor() {
        this.controller = new QRController();
        this.init();
    }

    private init() {
        this.router.post('/', checkAuth, checkLockAccess, this.controller.createQREntry);
        this.router.get('/', checkAuth, checkQuery<IQrFindOptions>('qr'), checkLockAccess, this.controller.getQREntries);
    }
}