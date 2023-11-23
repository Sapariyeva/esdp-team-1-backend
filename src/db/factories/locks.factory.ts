import { Faker } from "@faker-js/faker";
import { setSeederFactory } from "typeorm-extension";
import { ELock } from "@/entities/lock.entity";
import { EBarrierType } from "@/types/barriers";
import { nanoid } from "nanoid";
export const LocksFactory = setSeederFactory(ELock, async (faker: Faker) => {
  const lock = new ELock();
  lock.name = 'lock #' + nanoid(5)
  lock.type = Math.random()>0.3? EBarrierType.door : EBarrierType.barrier
  return lock;
})



