import { lockDTO } from "@/DTO/lock.DTO";
import { LockService } from "@/services/locks.service";
import { DTOerrExtractor } from "@/utils/DTOErrorExtractor";
import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { RequestHandler } from "express";

export class LocksController {
    private service: LockService
    constructor() {
        this.service = new LockService();
    }

    createLockEntry: RequestHandler = async (req, res): Promise<void> => {
        const newLock = plainToInstance(lockDTO, req.body)
        const DTOerr = await validate(newLock)
        if (DTOerr && DTOerr.length > 0) {
            res.status(400).send({
                success: false,
                error: DTOerrExtractor(DTOerr)
            })
        }
        else {
            const result = await this.service.createLockEntry(newLock)
            res.send({
                success: true,
                lock: result
            })
        }
    }
}