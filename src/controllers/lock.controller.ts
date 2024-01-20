import { lockDTO, lockFindOptionsDTO } from "@/DTO/lock.DTO";
import { RequestWithUser } from "@/interfaces/IRequest.interface";
import { ErrorWithStatus } from "@/interfaces/customErrors";
import { LockService } from "@/services/locks.service";
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
      if (Array.isArray(req.body)) {
        const createdLocks =  await Promise.all(req.body.map(async (l) => {
          l.id = undefined
          if (typeof(l.isActive) !== 'boolean'){
            l.isActive = true
          }
          const newLock = plainToInstance(lockDTO, l)
          const DTOerr = await validate(newLock)
          if (DTOerr && DTOerr.length > 0) throw DTOerr
          const result = await this.service.createLockEntry(newLock)
          return result
        }))
        res.send({
          success: true,
          payload: createdLocks
        })
      }
      else {
        req.body.id = undefined
        if (typeof(req.body.isActive) !== 'boolean'){
          req.body.isActive = true
        }
        const newLock = plainToInstance(lockDTO, req.body)
        const DTOerr = await validate(newLock)
        if (DTOerr && DTOerr.length > 0) throw DTOerr
        const result = await this.service.createLockEntry(newLock)
        res.send({
          success: true,
          payload: result
        })
      }
    }
    catch (err) {
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
      next(e)
    }

  }

  getAllLocksQuery: RequestHandler = async (req: RequestWithUser, res, next) => {
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