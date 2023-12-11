import { Euser } from '@/entities/user.entity';
import { IUser } from '@/interfaces/IUser';
import { Repository } from 'typeorm';
import { appDataSource } from '../dbConfig';
import { isUUID } from 'class-validator';

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
    return await this.find();
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
}