import { IUserFindOptions } from '@/interfaces/IFindOptions.interface';
import { IUser } from '@/interfaces/IUser';
import { BuildingRepository } from '@/repositories/building.repository';
import { TenantRepository } from '@/repositories/tenant.repository';
import { UserRepository } from '@/repositories/user.repository';
import { ERole } from '@/types/roles';
import { In } from 'typeorm';

export class UserService {
  private userRepo: UserRepository = new UserRepository();
  private buildingRepo: BuildingRepository = new BuildingRepository();
  private tenantRepo: TenantRepository = new TenantRepository();

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
        if (!queryOptions.buildingId && !queryOptions.tenantId) {
          const buildingIds = (
            await this.buildingRepo.find({
              where: { organizationId: user.organizationId },
            })
          ).map((b) => b.id);
          queryOptions.buildings = buildingIds;
          const tenantIds = (
            await this.tenantRepo.find({ where: { buildingId: In(buildingIds) } })
          ).map((t) => t.id);
          queryOptions.tenants = tenantIds;
        } else if (queryOptions.buildingId && !queryOptions.tenantId) {
          queryOptions.tenants = (
            await this.tenantRepo.find({
              where: { buildingId: queryOptions.buildingId },
            })
          ).map((t) => t.id);
        }
        break;
      case ERole.buildingAdmin:
        queryOptions.buildingId = user.buildingId;
        if (!queryOptions.tenantId) {
          queryOptions.tenants = (
            await this.tenantRepo.find({ where: { buildingId: user.buildingId } })
          ).map((t) => t.id);
        }
        break;
      case ERole.tenantAdmin:
        queryOptions.tenantId = user.tenantId;
        break;
    }
    return await this.userRepo.getUsersQuery(queryOptions);
  }
}

