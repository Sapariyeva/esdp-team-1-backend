import { Euser } from '@/entities/user.entity';
import { IUser } from '@/interfaces/IUser';
import { Repository } from 'typeorm';
import { appDataSource } from '../dbConfig';
import { isArray, isUUID } from 'class-validator';
import { IUserFindOptions } from '@/interfaces/IFindOptions.interface';
import { createUserFindOptions } from '@/utils/findOptionsBuilders/findUserOptionsCreator';

export class UserRepository extends Repository<Euser> {
  constructor() {
    super(Euser, appDataSource.createEntityManager());
  }

  async createUser(user: Euser): Promise<IUser> {
    const newUser = (await this.save(user)) as IUser;
    delete newUser.pass;
    return newUser;
  }

  async getUserByPhone(phone: string): Promise<Euser | null> {
    return await this.findOne({ where: { phone } })
  }

  async getAllUsers(): Promise<IUser[]> {
    return await this.find({ order: { username: 'ASC' } });
  }

  async getUserById(id: string): Promise<IUser | undefined> {
    if (!isUUID(id)) {
      return;
    }
    const extractedUser = await this.findOne({
      where: { id },
    });
    if (extractedUser) {
      return extractedUser;
    } else {
      return;
    }
  }

  async getUsersQuery(queryOptions: IUserFindOptions): Promise<IUser[]> {
    const findOptions = createUserFindOptions(queryOptions);
    return await this.find(findOptions);
  }

  removePasswords(data: IUser[] | IUser): IUser[] | IUser {
    if (isArray(data)) {
      return data.map(u => {
        return {...u, pass: undefined};
      })
    } else {
      return {...data, pass: undefined};
    }
  }
}