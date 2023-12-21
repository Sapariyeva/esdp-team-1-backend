import { Faker } from "@faker-js/faker";
import { setSeederFactory } from "typeorm-extension";
import { EOrganization } from "@/entities/organization.entity";
import { getPhoneNumber } from "./QRAccess.factory";
export const OrganizationsFactory = setSeederFactory(EOrganization, async (faker: Faker) => {

  const org = new EOrganization();
  org.name = faker.company.name()
  org.isActive = true
  org.phone = getPhoneNumber()
  org.email = faker.internet.email()
  org.legalAddress = faker.location.streetAddress({useFullAddress: true})
  return org;
})



