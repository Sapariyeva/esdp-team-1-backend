import { Faker } from "@faker-js/faker";
import { setSeederFactory } from "typeorm-extension";
import { EQRAccess } from "@/entities/QRAccess.entity";
import { UserRepository } from "@/repositories/user.repository";
import { LockRepository } from "@/repositories/locks.repository";
import axios from "axios";
import { envConfig } from '@/env';

const maxLocks = 5
const qrAxios = axios.create({ baseURL: envConfig.qrBaseUrl })

export const QRAccessFactory = setSeederFactory(EQRAccess, async (faker: Faker) => {
  const access = new EQRAccess();
  const userRepo = new UserRepository()
  const availableUserIds = (await userRepo.getAllUsers()).map((e) => { return e.id })
  const now = Date.now()
  const valid_from = (now - 3600 * 1000 * getRandomInt(5))
  const valid_to = (valid_from + 3600 * 1000 * (getRandomInt(5) + 5))
  access.valid_from = valid_from
  access.valid_to = valid_to
  access.phone = getPhoneNumber()
  access.author = faker.helpers.arrayElement(availableUserIds)
  access.locks = await getLocks()
  access.link = await getLink(access)
  return access;
})

const getLocks = async () => {
  const locksRepo = new LockRepository()
  let availableLocks = (await locksRepo.getAllLocks()).map((e) => { return e.id })
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

const getPhoneNumber = () => {
  let phone = '+7707'
  while (phone.length < 12) {
    phone = phone + getRandomInt(10).toString()
  }
  return phone
}

const getLink = async (access: EQRAccess) => {
  const response = await qrAxios.post('generate', {
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



