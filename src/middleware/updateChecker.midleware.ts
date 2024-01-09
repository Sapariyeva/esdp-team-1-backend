import { RequestWithUser } from '@/interfaces/IRequest.interface';
import { ErrorWithStatus } from '@/interfaces/customErrors';
import { BuildingRepository } from '@/repositories/building.repository';
import { TenantRepository } from '@/repositories/tenant.repository';
import { ERole } from '@/types/roles';
import { NextFunction, Response } from 'express';

type TEntity = 'organization' | 'building' | 'tenant';

export function checkEntityAccess(type: TEntity) {
  return async (req: RequestWithUser, res: Response, next: NextFunction) => {
    try {
      const buildingRepo = new BuildingRepository();
      const tenantRepo = new TenantRepository();
      const user = req.user!;
      const { id } = req.params;
      if (user.role === ERole.umanuAdmin) {
        return next();
      }
      switch (type) {
        case 'organization':
          if (user.role === ERole.organizationAdmin && user.organizationId === id) {
            return next();
          } else throw new ErrorWithStatus("Access denied", 403);
        case "building":
          const building = await buildingRepo.getBuildingById(id);
          if (!building) throw new ErrorWithStatus("Invalid building id", 400);
          switch (user.role) {
            case ERole.organizationAdmin:
              if (user.organizationId === building.organizationId) {
                return next();
              } else throw new ErrorWithStatus("Access denied", 403);
            default:
              throw new ErrorWithStatus("Access denied", 403);
          }
        case "tenant":
          const tenant = await tenantRepo.getTenantById(id);
          if (!tenant) throw new ErrorWithStatus("Invalid tenant id", 400);
          const tenantBuilding = await buildingRepo.getBuildingById(
            tenant.buildingId
          );
          switch (user.role) {
            case ERole.organizationAdmin:
              if (user.organizationId === tenantBuilding?.organizationId) {
                return next();
              } else throw new ErrorWithStatus("Access denied", 403);
            case ERole.buildingAdmin:
              if (user.buildingId === tenant.buildingId) {
                return next();
              } else throw new ErrorWithStatus("Access denied", 403);
            default:
              throw new ErrorWithStatus("Access denied", 403);
          }
      }
    } catch (err) {
      next(err);
    }
  };
}