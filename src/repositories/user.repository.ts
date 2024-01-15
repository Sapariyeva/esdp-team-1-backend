import { Euser } from '@/entities/user.entity';
import { IUserFindOptions } from '@/interfaces/IFindOptions.interface';
import { IUser } from '@/interfaces/IUser';
import { createUserFindOptions } from '@/utils/findOptionsBuilders/findUserOptionsCreator';
import { isUUID } from 'class-validator';
import { Repository, UpdateResult } from 'typeorm';
import { appDataSource } from '../dbConfig';
import { BuildingRepository } from './building.repository';
import { OrganizationRepository } from './organization.repository';
import { TenantRepository } from './tenant.repository';

export class UserRepository extends Repository<Euser> {
  private organizationRepo: OrganizationRepository = new OrganizationRepository();
  private buildingRepo: BuildingRepository = new BuildingRepository();
  private tenantRepo: TenantRepository = new TenantRepository();
  
  constructor() {
    super(Euser, appDataSource.createEntityManager());
  }

  async createUser(user: Euser): Promise<IUser> {
    if (user.tenantId) {
      const tenant = await this.tenantRepo.findOne({ where: { id: user.tenantId} });
      const building = await this.buildingRepo.findOne({ where: { id: tenant?.buildingId } });
      const organization = await this.organizationRepo.findOne({ where: { id: building?.organizationId } });
      user.buildingId = building?.id;
      user.organizationId = organization?.id; 
    } else if (user.buildingId) {
      const building = await this.buildingRepo.findOne({ where: { id: user.buildingId } });
      user.organizationId = building?.organizationId;
    }
    const newUser = (await this.save(user)) as IUser;
    delete newUser.pass;
    return newUser;
  }

  async getUserByPhone(phone: string): Promise<Euser | null> {
    return await this.findOne({ where: { phone } })
  }

  async getAllUsers(): Promise<IUser[]> {
    const users = await this.find({ order: { username: 'ASC' } });
    return users.map(u => {
      return this.removeUserPassword(u);
    });
  }

  async getUserById(id: string): Promise<IUser | undefined> {
    if (!isUUID(id)) {
      return;
    }
    const extractedUser = await this.findOne({
      where: { id },
    });
    if (extractedUser) {
      return this.removeUserPassword(extractedUser);
    } else {
      return;
    }
  }

  async getUsersQuery(queryOptions: IUserFindOptions): Promise<IUser[]> {
    const findOptions = createUserFindOptions(queryOptions);
    const users = await this.find(findOptions);
    return users.map(u => {
      return this.removeUserPassword(u);
    });
  }

  async updateUser(id: string, data: Partial<IUser>): Promise<UpdateResult> {
    return await this.update({ id }, data);
  }

  removeUserPassword(user: IUser): IUser {
    delete user.pass;
    return user;
  }
}