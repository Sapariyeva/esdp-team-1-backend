import { BuildingDTO } from '@/DTO/building.DTO';
import { lockDTO } from '@/DTO/lock.DTO';
import { OrganizationDTO } from '@/DTO/organization.DTO';
import { TenantDTO } from '@/DTO/tenant.DTO';
import { IBuilding } from '@/interfaces/IBuilding.interface';
import { IOrganization } from '@/interfaces/IOrganization.interface';
import { RequestWithUser } from '@/interfaces/IRequest.interface';
import { ITenant } from '@/interfaces/ITenant.interface';
import { ILock } from '@/interfaces/Ilock.interface';
import { ErrorWithStatus } from '@/interfaces/customErrors';
import { BuildingRepository } from '@/repositories/building.repository';
import { LockRepository } from '@/repositories/locks.repository';
import { OrganizationRepository } from '@/repositories/organization.repository';
import { TenantRepository } from '@/repositories/tenant.repository';
import { mergePartialEntities } from '@/utils/mergePartialEntities';
import { instanceToPlain, plainToInstance } from 'class-transformer';
import { NextFunction, Response } from 'express';

type TEntity = 'organization' | 'building' | 'tenant' | 'lock';

export function buildUpdateEntity(type: TEntity) {
  return async (req: RequestWithUser, res: Response, next: NextFunction) => {
    const { id } = req.params;
    let repo: OrganizationRepository | BuildingRepository | TenantRepository | LockRepository
    let updateData: Partial<ILock> | Partial<ITenant> | Partial<IBuilding> | Partial<IOrganization>
    try {
      switch (type) {
        case 'organization':
          repo = new OrganizationRepository()
          updateData = plainToInstance(OrganizationDTO, req.body);
          break
        case "building":
          repo = new BuildingRepository()
          updateData = plainToInstance(BuildingDTO, req.body);
          // throw new ErrorWithStatus("Access denied", 403);
          break
        case "tenant":
          repo = new TenantRepository()
          updateData = plainToInstance(TenantDTO, req.body);
          break
        case "lock":
          repo = new LockRepository()
          updateData = plainToInstance(lockDTO, req.body);
          break
        default:
          throw new ErrorWithStatus("Access denied", 403);
      }
      const existingEntity = await repo.findOne({ where: { id } });
      if (!existingEntity) {
        throw new ErrorWithStatus('No entity with specified Id found. Unable to update', 500)
      }
      const updatedEntity = instanceToPlain(mergePartialEntities(existingEntity, updateData))
      req.body.updateData = updatedEntity
      next()
    } catch (err) {
      next(err);
    }
  };
}