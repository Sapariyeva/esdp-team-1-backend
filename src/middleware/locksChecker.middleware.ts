import { RequestWithUser } from "@/interfaces/IRequest.interface";
import { ErrorWithStatus } from "@/interfaces/customErrors";
import { BuildingRepository } from "@/repositories/building.repository";
import { LockRepository } from "@/repositories/locks.repository";
import { TenantRepository } from "@/repositories/tenant.repository";
import { ERole } from "@/types/roles";
import { RequestHandler } from "express";
import { In } from "typeorm";


export const checkLockAccess: RequestHandler = async (
  req: RequestWithUser,
  res,
  next
) => {
  try {
    const locksRepo = new LockRepository();
    const buildingRepo = new BuildingRepository();
    const tenantRepo = new TenantRepository();
    const user = req.user;
    if (!user) throw new ErrorWithStatus("Unauthorized", 401);

    const locksIds = req.body.locks as string[];
    const locks = await locksRepo.find({ where: { id: In(locksIds) } });
    const buildingsIds = locks.map((l) => l.buildingId);
    const buildings = await buildingRepo.find({ where: { id: In(buildingsIds) }});

    switch (user.role) {
      case ERole.umanuAdmin:
        return next();
      case ERole.organizationAdmin:
        const organizationCheck = buildings.map(
          (b) => b.organizationId === user.organizationId
        );
        if (organizationCheck.includes(false)) {
          throw new ErrorWithStatus(
            "Locks list include a lock from different organization",
            403
          );
        } else return next();
      case ERole.buildingAdmin:
        const buildingCheck = locks.map(
          (l) => l.buildingId === user.buildingId
        );
        if (buildingCheck.includes(false)) {
          throw new ErrorWithStatus(
            "Locks list include a lock from different building",
            403
          );
        } else return next();
      case ERole.tenantAdmin:
        const tenant = await tenantRepo.findOne({
          where: { id: user.tenantId },
        });
        if (!tenant) throw new Error("Cannot find tenant");
        const tenantCheck = locks.map((l) => tenant.locks.includes(l.id));
        if (tenantCheck.includes(false)) {
          throw new ErrorWithStatus(
            "Locks list include a lock your tenant don't have access to",
            403
          );
        } else return next();
      case ERole.user:
        const userCheck = locks.map((l) => user.locks.includes(l.id));
        if (userCheck.includes(false) || !user.canCreateQR) {
          throw new ErrorWithStatus(
            "Locks list include a lock you don't have access to or you cannot create guest QR-access",
            403
          );
        } else return next();
    }
  } catch (err) {
    return next(err);
  }
};