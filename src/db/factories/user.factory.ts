import { Faker } from "@faker-js/faker";
import { setSeederFactory } from "typeorm-extension";
import { Euser } from "@/entities/user.entity";
import { ERole } from "@/types/roles";
import { getLocks, getPhoneNumber } from "./QRAccess.factory";
import { OrganizationRepository } from "@/repositories/organization.repository";
import { BuildingRepository } from "@/repositories/building.repository";
import { TenantRepository } from "@/repositories/tenant.repository";

export const UserFactory = setSeederFactory(Euser, async (faker: Faker) => {
  const tenantRepo = new TenantRepository()
  const buildingsRepo = new BuildingRepository()
  const orgRepo = new OrganizationRepository()
  const user = new Euser();
  const name = faker.internet.userName();
  user.username = name;
  user.phone = getPhoneNumber();
  user.pass = 'password';
  user.hashPass();
  const rnd = Math.random()

  const getTenantId = async () => {
    const availableTenants = (await tenantRepo.getAllTenants()).map(t => { return t.id })
    return faker.helpers.arrayElement(availableTenants)

  }

  const getBuildingId = async () => {
    const buildingIds = (await buildingsRepo.getAllBuildings()).map(b => { return b.id })
    return faker.helpers.arrayElement(buildingIds)
  }

  const getOrgId = async () => {
    const availableOrgIds = (await orgRepo.getAllOrganizations()).map(o => { return o.id })
    return faker.helpers.arrayElement(availableOrgIds)
  }



  if (rnd <= 0.1) {
    user.role = ERole.umanuAdmin
  }
  else if (rnd > 0.1 && rnd <= 0.3) {
    user.role = ERole.organizationAdmin
    user.organizationId = await getOrgId()
  }
  else if (rnd > 0.3 && rnd <= 0.5) {
    user.role = ERole.buildingAdmin
    user.buildingId = await getBuildingId()
  }
  else if (rnd > 0.5 && rnd <= 0.8) {
    user.role = ERole.tenantAdmin
    user.tenantId = await getTenantId()
  }
  else {
    user.role = ERole.user
    const rndUserRelation = Math.random()
    if (rndUserRelation <= 0.33) {
      user.organizationId = await getOrgId()
      user.locks = await getLocks({ organizationId: user.organizationId }, 5)
    }
    else if (rndUserRelation > 0.33 && rndUserRelation <= 0.66) {
      user.buildingId = await getBuildingId()
      user.locks = await getLocks({ buildingId: user.buildingId }, 5)
    }
    else {
      user.tenantId = await getTenantId()
      const tenantOfUser = await tenantRepo.findOne({
        where:
        {
          id: user.tenantId
        }
      })
      tenantOfUser ? user.locks = tenantOfUser.locks : user.locks = []
    }
  }
  user.canCreateQR = Math.random() > 0.5 ? true : false
  await user.hashPass()
  if (user.tenantId) {
    const tenant = await tenantRepo.findOne({ where: { id: user.tenantId } });
    const building = await buildingsRepo.findOne({ where: { id: tenant?.buildingId } });
    const organization = await orgRepo.findOne({ where: { id: building?.organizationId } });
    user.buildingId = building?.id;
    user.organizationId = organization?.id;
  } else if (user.buildingId) {
    const building = await buildingsRepo.findOne({ where: { id: user.buildingId } });
    user.organizationId = building?.organizationId;
  }
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

