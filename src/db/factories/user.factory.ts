import { Faker } from "@faker-js/faker";
import { setSeederFactory } from "typeorm-extension";
import { Euser } from "@/entities/user.entity";
import { ERole } from "@/types/roles";
import { getLocks, getPhoneNumber } from "./QRAccess.factory";
import { OrganizationRepository } from "@/repositories/organization.repository";
import { BuildingRepository } from "@/repositories/building.repository";
import { TenantRepository } from "@/repositories/tenant.repository";

export const UserFactory = setSeederFactory(Euser, async (faker: Faker) => {
  const user = new Euser();
  const name = faker.internet.userName();
  user.username = name;
  user.phone = getPhoneNumber();
  user.pass = 'password';
  user.hashPass();
  const rnd = Math.random()
  if (rnd <= 0.1) {
    user.role = ERole.umanuAdmin
  }
  else if (rnd > 0.1 && rnd <= 0.3) {
    user.role = ERole.organizationAdmin
    const orgRepo = new OrganizationRepository()
    const availableOrgIds = (await orgRepo.getAllOrganizations()).map(o => { return o.id })
    user.organizationId = faker.helpers.arrayElement(availableOrgIds)
  }
  else if (rnd > 0.3 && rnd <= 0.5) {
    user.role = ERole.buildingAdmin
    const buildingsRepo = new BuildingRepository()
    const buildingIds = (await buildingsRepo.getAllBuildings()).map(b => { return b.id })
    user.buildingId = faker.helpers.arrayElement(buildingIds)
  }
  else if (rnd > 0.5 && rnd <= 0.8) {
    user.role = ERole.tenantAdmin
    const tenantRepo = new TenantRepository()
    const availableTenants = (await tenantRepo.getAllTenants()).map(t => { return t.id })
    user.tenantId = faker.helpers.arrayElement(availableTenants)
  }
  else {
    user.role = ERole.user
    user.locks = await getLocks({}, 5)
  }
  user.canCreateQR = Math.random() > 0.5 ? true : false
  await user.hashPass()
  return user;
})

// export const fakeIsLoggedIn = () => {
//   const isLogged = (Math.random() > 0.5)
//   if (isLogged) {
//     return nanoid(10)
//   }
//   else {
//     return
//   }
// }

