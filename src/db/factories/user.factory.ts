import { Faker } from "@faker-js/faker";
import { setSeederFactory } from "typeorm-extension";
import { Euser } from "@/entities/user.entity";
import { UserRepository } from "@/repositories/user.repository";
import { nanoid } from "nanoid";
import { ERole } from "@/types/roles";

export const UserFactory = setSeederFactory(Euser, async (faker: Faker) => {
  const userRepo = new UserRepository()
  const user = new Euser();
  const name = faker.internet.userName();
  user.username = name
  user.pass = await userRepo.hashPass(name + 'pass')
  user.token = fakeIsLoggedIn()
  user.role = Math.random() > 0.3 ? ERole.user : ERole.admin
  user.canCreateQR = Math.random() > 0.5 ? true : false
  return user;
})

const fakeIsLoggedIn = () => {
  const isLogged = (Math.random() > 0.5)
  if (isLogged) {
    return nanoid(10)
  }
  else {
    return
  }
}

