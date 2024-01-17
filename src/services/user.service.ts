import { Euser } from '@/entities/user.entity';
import { IUserFindOptions } from '@/interfaces/IFindOptions.interface';
import { IUser } from '@/interfaces/IUser';
import { UserRepository } from '@/repositories/user.repository';
import { ERole } from '@/types/roles';
import { UpdateResult } from 'typeorm';

export class UserService {
  private userRepo: UserRepository = new UserRepository();

  getUserById = async (id: string) => {
    return await this.userRepo.getUserById(id);
  };

  getUsersQuery = async (user: IUser, findOptions?: IUserFindOptions): Promise<IUser[]> => {
    const queryOptions = {...findOptions}
    switch (user.role) {
      case ERole.umanuAdmin:
        return await this.userRepo.getUsersQuery(queryOptions);
      case ERole.organizationAdmin:
        queryOptions.organizationId = user.organizationId;
        break;
      case ERole.buildingAdmin:
        queryOptions.buildingId = user.buildingId;
        break;
      case ERole.tenantAdmin:
        queryOptions.tenantId = user.tenantId;
        break;
    }
    return await this.userRepo.getUsersQuery(queryOptions);
  }

  updateUser = async (id: string, data: Partial<IUser>): Promise<UpdateResult> => {
    if (data.pass) {
      const updatedUser = new Euser();
      Object.assign(updatedUser, data);
      await updatedUser.hashPass();
      return await this.userRepo.updateUser(id, updatedUser);
    }
    return await this.userRepo.updateUser(id, data);
  }
}

