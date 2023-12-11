import { Faker } from "@faker-js/faker";
import { setSeederFactory } from "typeorm-extension";
import { Euser } from "@/entities/user.entity";
import { nanoid } from "nanoid";
import { ERole } from "@/types/roles";

export const UserFactory = setSeederFactory(Euser, async (faker: Faker) => {
  const user = new Euser();
  const name = faker.internet.userName();
  user.username = name;
  user.pass = 'password';
  user.hashPass();
  user.role = Math.random() > 0.3 ? ERole.user : ERole.spaceAdmin
  user.canCreateQR = Math.random() > 0.5 ? true : false
  return user;
})

export const fakeIsLoggedIn = () => {
  const isLogged = (Math.random() > 0.5)
  if (isLogged) {
    return nanoid(10)
  }
  else {
    return
  }
}

