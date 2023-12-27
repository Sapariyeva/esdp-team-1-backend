import { Faker } from "@faker-js/faker";
import { setSeederFactory } from "typeorm-extension";
import { ELock } from "@/entities/lock.entity";
import { EBarrierType } from "@/types/barriers";
import { nanoid } from "nanoid";
import { BuildingsRepository } from "@/repositories/buildings.repository";
export const LocksFactory = setSeederFactory(ELock, async (faker: Faker) => {
  const lock = new ELock();
  const buildingsRepo = new BuildingsRepository()
  const buildingIds = (await buildingsRepo.getAllBuildings()).map(b => {return b.id})
  lock.name = 'lock #' + nanoid(12)
  lock.type = Math.random()>0.3? EBarrierType.door : EBarrierType.barrier
  lock.buildingId = faker.helpers.arrayElement(buildingIds)
  lock.isActive =true
  return lock;
})



