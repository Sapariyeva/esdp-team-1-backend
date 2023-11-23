import { lockDTO } from "@/DTO/lock.DTO";
import { LockRepository } from "@/repositories/locks.repository";

export class LockService {
  private lockRepo: LockRepository = new LockRepository()

  constructor() { }

  createLockEntry = async (data: lockDTO) => {
    return await this.lockRepo.createLock(data)
  };
}

