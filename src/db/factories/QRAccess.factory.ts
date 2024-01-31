import { Faker } from "@faker-js/faker";
import { setSeederFactory } from "typeorm-extension";
import { EQRAccess } from "@/entities/QRAccess.entity";
import { UserRepository } from "@/repositories/user.repository";
import { LockRepository } from "@/repositories/locks.repository";
import axios from "axios";
import { envConfig } from '@/env';
import { lockFindOptionsDTO } from "@/DTO/lock.DTO";
import { LockService } from "@/services/locks.service";
import { IUser } from "@/interfaces/IUser";
import { QRAccessRepository } from "@/repositories/QRAccess.repository";

const maxLocksConst = 5
const qrAxios = axios.create({ baseURL: envConfig.qrBaseUrl })

export const QRAccessFactory = setSeederFactory(EQRAccess, async (faker: Faker) => {
  const access = new EQRAccess();
  const userRepo = new UserRepository()
  const QRAccessRepo = new QRAccessRepository ()
  const availableUsers = await userRepo.getAllUsers()
  const user = faker.helpers.arrayElement(availableUsers)
  const now = Date.now()
  const valid_from = (now - 60 * (100 * getRandomInt(5)))
  const valid_to = (valid_from + 3600 * 1000 * (getRandomInt(5) + 5))
  access.valid_from = valid_from
  access.valid_to = valid_to
  access.phone = getPhoneNumber()
  access.author = user.id
  access.locks = await getLocks(undefined, maxLocksConst, user)
  const newAccess = await QRAccessRepo.saveQRAccess(access)
  const link = await getLink(newAccess)
  newAccess.link = await link
  await QRAccessRepo.update(newAccess.id, newAccess)
  return newAccess;
})

export const getLocks = async (options?: lockFindOptionsDTO, maxLocks=maxLocksConst, user?:IUser) => {
  const locksRepo = new LockRepository()
  const locksService = new LockService ()
  let availableLocks = user?
  (await locksService.getAllLocksQuery(user, options? options : {})).map((e) => { return e.id }):
  (await locksRepo.getAllLocksQuery(options? options : {})).map((e) => { return e.id })
  const numLocksIncluded = parseInt((Math.random() * maxLocks).toString()) + 1
  const locks: string[] = []
  while ((locks.length < numLocksIncluded) && (availableLocks.length > 0)) {
    const selectedLock = availableLocks[Math.floor(Math.random() * availableLocks.length)];
    locks.push(selectedLock)
    availableLocks = availableLocks.filter(e => {
      return e != selectedLock
    })
  }
  return locks
}

const getRandomInt = (max: number) => {
  return Math.floor(Math.random() * max);
}

export const getPhoneNumber = () => {
  let phone = '+7707'
  while (phone.length < 12) {
    phone = phone + getRandomInt(10).toString()
  }
  return phone
}

const getLink = async (access: EQRAccess) => {
  const response = await qrAxios.post('generate', {
    id: access.id,
    author: access.author,
    phone: access.phone,
    locks: access.locks,
    valid_from: access.valid_from,
    valid_to: access.valid_to
  });
  if (response.status = 200 && response.data.success) {
    return response.data.link
  }
  else {
    throw new Error(`Failed to create QR. Status: ${response.status}. ${response.data.message}`)
  }
}



