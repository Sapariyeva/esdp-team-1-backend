import { Faker } from "@faker-js/faker";
import { setSeederFactory } from "typeorm-extension";
import { ETenant } from "@/entities/tenant.entity";
import { BuildingsRepository } from "@/repositories/buildings.repository";
import { getLocks, getPhoneNumber } from "./QRAccess.factory";
import { lockFindOptionsDTO } from "@/DTO/lock.DTO";
export const TenantsFactory = setSeederFactory(ETenant, async (faker: Faker) => {
  const tenant = new ETenant();
  const buildingsRepo = new BuildingsRepository()
  const availableBuildings = (await buildingsRepo.getAllBuildings()).map(b => { return b.id })
  tenant.buildingId = faker.helpers.arrayElement(availableBuildings)
  tenant.email = faker.internet.email()
  tenant.legalAddress = faker.location.streetAddress({useFullAddress: true})
  tenant.phone = getPhoneNumber()
  tenant.isActive =true
  tenant.name = faker.company.buzzAdjective()+  " " +  faker.company.catchPhraseNoun()
  const locksFindOptions: lockFindOptionsDTO = {
    buildingId: tenant.buildingId
  }
  tenant.locks = await getLocks(locksFindOptions, 5)
  return tenant;
})



