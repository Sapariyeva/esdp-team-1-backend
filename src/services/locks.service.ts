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

  getAllLocksQuery = async (user: IUser, options: lockFindOptionsDTO) => {
    if ((user.role === ERole.user)) {  // Not a booletproof chceck, but fine for now
      if (!options.locks) {
        options.locks = user.locks
      }
      else {
        if (!options.locks.every((l) => { return user.locks.includes(l) })) {
          throw new ErrorWithStatus('User has no acces to some of the inquired locks', 400)
        }
      }
    }
    if ((user.role === ERole.tenantAdmin)) {
      const tenantRepo = new TenantRepository()
      const tenantLockIds = (await tenantRepo.getTenantById(user.tenantId!))?.locks
      if (!tenantLockIds || tenantLockIds.length === 0) {
        throw new ErrorWithStatus('This tenant can not operate with any locks', 400)
      }
      if (!options.locks) {
        options.locks = tenantLockIds
      }
      else {
        if (!options.locks.every((l) => { return tenantLockIds.includes(l) })) {
          throw new ErrorWithStatus('Tenant has no acces to some of the inquired locks', 400)
        }
      }
    }
    if (user.role === ERole.organizationAdmin) {
      if (!options.organizarionId) {
        options.organizarionId = user.organizationId!
      }
      else if (!(options.organizarionId === user.organizationId)) {
        throw new ErrorWithStatus('user has no rights to retrieve locks from this organization', 400)
      }
    }
    else if ((user.role === ERole.buildingAdmin) || (user.role === ERole.tenantAdmin)) {
      if (!options.buildingId) {
        options.buildingId = user.buildingId!
      }
      else if (!(options.buildingId === user.buildingId)) {
        throw new ErrorWithStatus('user has no rights to retrieve locks from this building', 400)
      }
    }
    return await this.lockRepo.getAllLocksQuery(options)
  }
}

