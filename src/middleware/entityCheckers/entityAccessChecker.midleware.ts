import { IUserFindOptions } from '@/interfaces/IFindOptions.interface';
import { RequestWithFindOptions } from '@/interfaces/IRequest.interface';
import { ErrorWithStatus } from '@/interfaces/customErrors';
import { BuildingRepository } from '@/repositories/building.repository';
import { TenantRepository } from '@/repositories/tenant.repository';
import { ERole } from '@/types/roles';
import { RequestHandler } from 'express';

export const checkOrganizationAccess: RequestHandler = async (
  req: RequestWithFindOptions<IUserFindOptions>,
  res,
  next
) => {
  try {
    const user = req.user!;
    const id = req.params.id || (req.query.organizationId as string);
    if (id) {
      switch (user.role) {
        case ERole.umanuAdmin:
          return next();
        case ERole.organizationAdmin:
          if (user.organizationId === id) {
            return next();
          } else {
            throw new ErrorWithStatus("Access denied", 403);
          }
        default:
          throw new ErrorWithStatus("Access denied", 403);
      }
    } else {
      return next();
    }
  } catch (err) {
    next(err);
  }
};

export const checkBuildingAccess: RequestHandler = async (
  req: RequestWithFindOptions<IUserFindOptions>,
  res,
  next
) => {
  try {
    const buildingsRepo = new BuildingRepository();
    const user = req.user!;
    const id = req.params.id || (req.query.buildingId as string);
    const building = await buildingsRepo.findOne({ where: { id } });
    if (!building) {
      throw new ErrorWithStatus("Cannot find building with provided id", 400);
    }
    if (id) {
      switch (user.role) {
        case ERole.umanuAdmin:
          return next();
        case ERole.organizationAdmin:
          if (building.organizationId === user.organizationId) {
            return next();
          } else {
            throw new ErrorWithStatus("Access denied", 403);
          }
        case ERole.buildingAdmin:
          if (user.buildingId === id) {
            return next();
          } else {
            throw new ErrorWithStatus("Access denied", 403);
          }
        default:
          throw new ErrorWithStatus("Access denied", 403);
      }
    } else {
      return next();
    }
  } catch (err) {
    next(err);
  }
};

export const checkTenantAccess: RequestHandler = async (
  req: RequestWithFindOptions<IUserFindOptions>,
  res,
  next
) => {
  try {
    const buildingsRepo = new BuildingRepository();
    const tenantRepo = new TenantRepository();
    const user = req.user!;
    const id = req.params.id || (req.query.tenantId as string);
    const tenant = await tenantRepo.findOne({ where: { id } });
    if (!tenant) {
      throw new ErrorWithStatus("Cannot find tenant with provided id", 400);
    }
    const building = await buildingsRepo.findOne({ where: { id: tenant.buildingId } });
    if (id) {
      switch (user.role) {
        case ERole.umanuAdmin:
          return next();
        case ERole.organizationAdmin:
          if (building!.organizationId === user.organizationId) {
            return next();
          } else {
            throw new ErrorWithStatus("Access denied", 403);
          }
        case ERole.buildingAdmin:
          if (user.buildingId === tenant.buildingId) {
            return next();
          } else {
            throw new ErrorWithStatus("Access denied", 403);
          }
        case ERole.tenantAdmin:
          if (user.tenantId === id) {
            return next();
          } else {
            throw new ErrorWithStatus("Access denied", 403);
          }
        default:
          throw new ErrorWithStatus("Access denied", 403);
      }
    } else {
      return next();
    }
  } catch (err) {
    next(err);
  }
};