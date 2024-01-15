import { IUserFindOptions } from '@/interfaces/IFindOptions.interface';
import { IUser } from '@/interfaces/IUser';
import { UserRepository } from '@/repositories/user.repository';
import { ERole } from '@/types/roles';

export class UserService {
  private userRepo: UserRepository = new UserRepository();

  getUsersQuery = async (user: IUser, findOptions?: IUserFindOptions): Promise<IUser[]> => {
    const queryOptions = {...findOptions}
    switch (user.role) {
      case ERole.umanuAdmin:
        return findOptions
          ? await this.userRepo.getUsersQuery(findOptions)
          : await this.userRepo.getAllUsers();
      case ERole.organizationAdmin:
      case ERole.buildingAdmin:
      case ERole.tenantAdmin:
        queryOptions.tenantId = user.tenantId;
        break;
    }
    return await this.userRepo.getUsersQuery(queryOptions);
  }
}

