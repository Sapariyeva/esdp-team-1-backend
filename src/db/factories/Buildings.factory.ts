import { Faker } from "@faker-js/faker";
import { setSeederFactory } from "typeorm-extension";
import { nanoid } from "nanoid";
import { OrganizationRepository } from "@/repositories/organizations.repository";
import { EBuilding } from "@/entities/building.entity";
export const BuildingsFactory = setSeederFactory(EBuilding, async (faker: Faker) => {
  const building = new EBuilding();
  const orgRepo = new OrganizationRepository()
  const availableOrgIds = (await orgRepo.getAllOrganizations()).map(o => { return o.id })
  building.organizationId = faker.helpers.arrayElement(availableOrgIds)
  building.name = 'Building #' + nanoid(5) + ' of Org ' + building.organizationId
  building.address = faker.location.streetAddress({useFullAddress: true})
  building.isActive = true
  return building;
})



