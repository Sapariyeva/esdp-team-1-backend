import { lockDTO, lockFindOptionsDTO } from "@/DTO/lock.DTO";
import { RequestWithUser } from "@/interfaces/IRequest.interface";
import { ErrorWithStatus } from "@/interfaces/customErrors";
import { LockService } from "@/services/locks.service";
import { ERole } from "@/types/roles";
import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { RequestHandler } from "express";

export class LocksController {
  private service: LockService
  constructor() {
    this.service = new LockService();
  }

  createLockEntry: RequestHandler = async (req: RequestWithUser, res, next): Promise<void> => {
    try {
      req.body.id = undefined
      const newLock = plainToInstance(lockDTO, req.body)
      const DTOerr = await validate(newLock)
      if (DTOerr && DTOerr.length > 0) throw DTOerr
      if (req.user?.role != ERole.umanuAdmin) throw new Error('User is not allowed to register new locks')
      const result = await this.service.createLockEntry(newLock)
      res.send({
        success: true,
        lock: result
      })
    }
    catch(err){
      next(err)
    }
  }

  getAllLocks: RequestHandler = async (req, res, next) => {
    try {
      const locks = await this.service.getAllLocks()

      res.status(200).send({
        success: true,
        payload: locks
      })
    } catch (e) {
      console.log(e)
      next(e)
    }

  }

  getAllLocksQuery: RequestHandler = async (req:RequestWithUser, res, next) => {
    try {
      const user = req.user
      const searchParams = plainToInstance(lockFindOptionsDTO, req.query)
      const DTOerr = await validate(searchParams)
      if (!user) throw new ErrorWithStatus('Unauthorized request', 400)
      if (DTOerr && DTOerr.length > 0) throw DTOerr
      const locks = await this.service.getAllLocksQuery(user, searchParams)
      res.status(200).send({
        success: true,
        payload: locks
      })
    } catch (e) {
      next(e)
      console.log(e)
    }
  }

  updateLock: RequestHandler = async (req, res, next): Promise<void> => {
    try {
      const updatedData = plainToInstance(lockDTO, req.body.updateData);
      const DTOerr = await validate(updatedData);
      if (DTOerr && DTOerr.length > 0) throw DTOerr
      const result = await this.service.updateLock(updatedData);
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