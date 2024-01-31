import { lockDTO, lockFindOptionsDTO } from "@/DTO/lock.DTO";
import { IUser } from "@/interfaces/IUser";
import { ErrorWithStatus } from "@/interfaces/customErrors";
import { LockRepository } from "@/repositories/locks.repository";
import { TenantRepository } from "@/repositories/tenant.repository";
import { ERole } from "@/types/roles";

export class LockService {
  private lockRepo: LockRepository = new LockRepository()

  constructor() { }

  createLockEntry = async (data: lockDTO) => {
    return await this.lockRepo.createLock(data)
  };

  getAllLocks = async () => {
    return await this.lockRepo.getAllLocks()
  }

  updateLock = async (data: lockDTO): Promise<boolean> => {
    try {
      return !!(await this.lockRepo.update(data.id, data))
  }
  catch (e) {
      throw new ErrorWithStatus('unknown server error', 500)
  }
}

  getAllLocksQuery = async (user: IUser, options: lockFindOptionsDTO) => {
    if ((user.role === ERole.user)) { 
      if (!options.locks) {
        user.locks ?  options.locks = user.locks : options.locks = []
      }
      else {
        if (!options.locks.every((l) => { return user.locks.includes(l) })) {
          throw new ErrorWithStatus('User has no acces to some of the inquired locks', 403)
        }
      }
    }
    if ((user.role === ERole.tenantAdmin)) {
      const tenantRepo = new TenantRepository()
      const tenantLockIds = (await tenantRepo.getTenantById(user.tenantId!))?.locks
      if (!tenantLockIds || tenantLockIds.length === 0) {
        throw new ErrorWithStatus('This tenant can not operate with any locks', 403)
      }
      if (!options.locks) {
        options.locks = tenantLockIds
      }
      else {
        if (!options.locks.every((l) => { return tenantLockIds.includes(l) })) {
          throw new ErrorWithStatus('Tenant has no acces to some of the inquired locks', 403)
        }
      }
    }
    if (user.role === ERole.organizationAdmin) {
      if (!options.organizationId) {
        options.organizationId = user.organizationId!
      }
      else if (!(options.organizationId === user.organizationId)) {
        throw new ErrorWithStatus('user has no rights to retrieve locks from this organization', 403)
      }
    }
    else if ((user.role === ERole.buildingAdmin) || (user.role === ERole.tenantAdmin)) {
      if (!options.buildingId) {
        options.buildingId = user.buildingId!
      }
      else if (options.buildingId !== user.buildingId) {
        throw new ErrorWithStatus('user has no rights to retrieve locks from this building', 403)
      }
    }
    return await this.lockRepo.getAllLocksQuery(options)
  }
}

