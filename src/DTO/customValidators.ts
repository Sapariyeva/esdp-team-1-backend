import { MIN_ACCESS_INTERVAL } from '@/constants';
import { QRAccessRepository } from '@/repositories/QRAccess.repository';
import { BuildingRepository } from '@/repositories/building.repository';
import { LockRepository } from '@/repositories/locks.repository';
import { OrganizationRepository } from '@/repositories/organization.repository';
import { TenantRepository } from '@/repositories/tenant.repository';
import { UserRepository } from '@/repositories/user.repository';
import { EBarrierType } from '@/types/barriers';
import { ENotificationTypes } from '@/types/notifocations';
import { ERole } from '@/types/roles';
import {
    registerDecorator, ValidationOptions, ValidatorConstraint,
    ValidatorConstraintInterface, ValidationArguments
} from 'class-validator';

@ValidatorConstraint({ async: true })
export class IsUserExistConstraint implements ValidatorConstraintInterface {
    async validate(userId: any, args: ValidationArguments) {
        const userRepo = new UserRepository()
        return userRepo.getUserById(userId).then(user => {
            if (user) return true;
            return false;
        });
    }
}

@ValidatorConstraint({ async: true })
export class IsRoleValidConstraint implements ValidatorConstraintInterface {
    async validate(role: any, args: ValidationArguments) {
        if (!(Object.values(ERole).includes(role))) {
            return false;
        }
        return true
    }
}

@ValidatorConstraint({ async: true })
export class IsBarrierTypeValidConstraint implements ValidatorConstraintInterface {
    async validate(barrierType: any, args: ValidationArguments) {
        if (!(Object.values(EBarrierType).includes(barrierType))) {
            return false;
        }
        return true
    }
}

@ValidatorConstraint({ async: true })
export class IsLockExistConstraint implements ValidatorConstraintInterface {
    async validate(lockId: any, args: ValidationArguments) {
        const lockRepo = new LockRepository()
        return lockRepo.getLockById(lockId).then(lock => {
            if (lock) return true;
            return false;
        });
    }
}

@ValidatorConstraint({ async: true })
export class IsBuildingExistConstraint implements ValidatorConstraintInterface {
    async validate(buildingId: any, args: ValidationArguments) {
        const buildingsRepo = new BuildingRepository()
        return buildingsRepo.getBuildingById(buildingId).then(building => {
            if (building) return true;
            return false;
        });
    }
}

@ValidatorConstraint({ async: true })
export class IsOrganizationExistConstraint implements ValidatorConstraintInterface {
    async validate(organizationId: any, args: ValidationArguments) {
        const orgRepo = new OrganizationRepository()
        return orgRepo.getOrganizationById(organizationId).then(org => {
            if (org) return true;
            return false;
        });
    }
}

@ValidatorConstraint({ async: true })
export class IsTenantExistConstraint implements ValidatorConstraintInterface {
    async validate(tenantId: any, args: ValidationArguments) {
        const tenantRepo = new TenantRepository()
        return tenantRepo.getTenantById(tenantId).then(tenant => {
            if (tenant) return true;
            return false;
        });
    }
}

@ValidatorConstraint({ async: true })
export class IsAccessEntryExistConstraint implements ValidatorConstraintInterface {
    async validate(AccesId: any, args: ValidationArguments) {
        const accessRepo = new QRAccessRepository()
        return accessRepo.getQRAccessById(AccesId).then(access => {
            if (access) return true;
            return false;
        });
    }
}

@ValidatorConstraint({ async: true })
export class IsNotificationTypeValidConstraint implements ValidatorConstraintInterface {
    async validate(role: any, args: ValidationArguments) {
        if (!(Object.values(ENotificationTypes).includes(role))) {
            return false;
        }
        return true
    }
}

@ValidatorConstraint({ async: true })
export class IsValidFromPassesConstraint implements ValidatorConstraintInterface {
    async validate(valid_from: number, args: ValidationArguments) {
        const datetime = new Date(valid_from);
        if (datetime instanceof Date) {
            const now = new Date().getTime();
            return valid_from >= now - 60 * 1000 ? true : false;
        } else {
            return false;
        }
    }
}

@ValidatorConstraint({ async: true })
export class IsValidToPassesConstraint implements ValidatorConstraintInterface {
    async validate(valid_to: number, args: ValidationArguments) {
        const datetime = new Date(valid_to);
        if (datetime instanceof Date) {
            const [valid_from] = args.constraints;
            const dateFromAsNumber = (args.object as any)[valid_from] as number;
            return valid_to - dateFromAsNumber > MIN_ACCESS_INTERVAL * 60 * 1000 ? true : false;
        } else {
            return false;
        }
    }
}

@ValidatorConstraint({ async: true })
export class ShouldHaveBuildingIdConstraint implements ValidatorConstraintInterface {
    async validate(buildingId: any, args: ValidationArguments) {
        try {
            const [role] = args.constraints;
            if (buildingId == null && role !== ERole.buildingAdmin) {
                return true
            }
            else {
                const buildingsRepo = new BuildingRepository()
                return buildingsRepo.getBuildingById(buildingId).then(building => {
                    if (building) return true;
                    return false;
                });
            }
        }
        catch {
            return false
        }
    }
}

@ValidatorConstraint({ async: true })
export class ShouldHaveOrganizationIdConstraint implements ValidatorConstraintInterface {
    async validate(orgId: any, args: ValidationArguments) {
        try {
            const [role] = args.constraints;
            if (orgId == null && (role !== ERole.organizationAdmin)) {
                return true
            }
            else {
                const orgRepo = new OrganizationRepository()
                return orgRepo.getOrganizationById(orgId).then(org => {
                    if (org) return true;
                    return false;
                });
            }
        }
        catch {
            return false
        }
    }
}

@ValidatorConstraint({ async: true })
export class ShouldHaveTenantIdConstraint implements ValidatorConstraintInterface {
    async validate(tenantId: any, args: ValidationArguments) {
        try {
            const [role] = args.constraints;
            if (tenantId == null && (role !== ERole.tenantAdmin)) {
                return true
            }
            else {
                const tenantRepo = new TenantRepository()
                return tenantRepo.getTenantById(tenantId).then(tenant => {
                    if (tenant) return true;
                    return false;
                });
            }
        }
        catch {
            return false
        }
    }
}

@ValidatorConstraint({ async: true })
export class IsBuildingNameUniqueConstraint implements ValidatorConstraintInterface {
    async validate(name: string, args: ValidationArguments) {
        const organizationId = (args.object as { organizationId: string }).organizationId;
        const id = (args.object as { id: string }).id;
        const buildingRepo = new BuildingRepository();
        const existingBuilding = await buildingRepo.findOne({
            where: {
                name,
                organizationId,
            },
        });
        if (id !== existingBuilding?.id) {
            return !existingBuilding;
        }
        else {
            return true
        }

    }
}

@ValidatorConstraint({ async: true })
export class IsTenantNameUniqueConstraint implements ValidatorConstraintInterface {
    async validate(name: string, args: ValidationArguments) {
        const buildingId = (args.object as { buildingId: string }).buildingId;
        const id = (args.object as { id: string }).id;
        const tenantRepo = new TenantRepository();
        const existingTenant = await tenantRepo.findOne({
            where: {
                name,
                buildingId,
            },
        });
        if (id !== existingTenant?.id) {
            return !existingTenant;
        }
        else {
            return true
        }
    }
}

@ValidatorConstraint({ async: true })
export class IsLockNameUniqueConstraint implements ValidatorConstraintInterface {
    async validate(name: string, args: ValidationArguments) {
        const buildingId = (args.object as { buildingId: string }).buildingId;
        const id = (args.object as { id: string }).id;
        const lockRepo = new LockRepository()
        const locksOfBuilding = (await lockRepo.getAllLocks()).filter(l => { return l.buildingId === buildingId })
        return !(locksOfBuilding.map((l => { return l.name })).includes(name)) || (locksOfBuilding.map((l => { return l.id })).includes(id))
    }
}

@ValidatorConstraint({ async: true })
export class IsLockBelongsToBuildingConstraint implements ValidatorConstraintInterface {
    async validate(id: string, args: ValidationArguments) {
        const buildingId = (args.object as { buildingId: string }).buildingId;
        const lockRepo = new LockRepository();
        const existingLock = await lockRepo.findOne({
            where: {
                id,
                buildingId,
            },
        });
        return !!(existingLock);
    }
}

export function IsUserExist(validationOptions?: ValidationOptions) {
    return function (object: Object, propertyName: string) {
        registerDecorator({
            target: object.constructor,
            propertyName: propertyName,
            options: validationOptions,
            constraints: [],
            validator: IsUserExistConstraint,
        });
    };
}

export function IsRoleValid(validationOptions?: ValidationOptions) {
    return function (object: Object, propertyName: string) {
        registerDecorator({
            target: object.constructor,
            propertyName: propertyName,
            options: validationOptions,
            constraints: [],
            validator: IsRoleValidConstraint,
        });
    };
}

export function IsBarrierTypeValid(validationOptions?: ValidationOptions) {
    return function (object: Object, propertyName: string) {
        registerDecorator({
            target: object.constructor,
            propertyName: propertyName,
            options: validationOptions,
            constraints: [],
            validator: IsBarrierTypeValidConstraint,
        });
    };
}

export function IsLockExist(validationOptions?: ValidationOptions) {
    return function (object: Object, propertyName: string) {
        registerDecorator({
            target: object.constructor,
            propertyName: propertyName,
            options: validationOptions,
            constraints: [],
            validator: IsLockExistConstraint,
        });
    };
}

export function IsBuildingExist(validationOptions?: ValidationOptions) {
    return function (object: Object, propertyName: string) {
        registerDecorator({
            target: object.constructor,
            propertyName: propertyName,
            options: validationOptions,
            constraints: [],
            validator: IsBuildingExistConstraint,
        });
    };
}

export function IsOrganizationExist(validationOptions?: ValidationOptions) {
    return function (object: Object, propertyName: string) {
        registerDecorator({
            target: object.constructor,
            propertyName: propertyName,
            options: validationOptions,
            constraints: [],
            validator: IsOrganizationExistConstraint,
        });
    };
}

export function IsTenantExist(validationOptions?: ValidationOptions) {
    return function (object: Object, propertyName: string) {
        registerDecorator({
            target: object.constructor,
            propertyName: propertyName,
            options: validationOptions,
            constraints: [],
            validator: IsTenantExistConstraint,
        });
    };
}

export function IsAccessEntryExist(validationOptions?: ValidationOptions) {
    return function (object: Object, propertyName: string) {
        registerDecorator({
            target: object.constructor,
            propertyName: propertyName,
            options: validationOptions,
            constraints: [],
            validator: IsAccessEntryExistConstraint,
        });
    };
}

export function IsNotificationTypeValid(validationOptions?: ValidationOptions) {
    return function (object: Object, propertyName: string) {
        registerDecorator({
            target: object.constructor,
            propertyName: propertyName,
            options: validationOptions,
            constraints: [],
            validator: IsNotificationTypeValidConstraint,
        });
    };
}

export function IsValidFromPasses(validationOptions?: ValidationOptions) {
    return function (object: Object, propertyName: string) {
        registerDecorator({
            target: object.constructor,
            propertyName: propertyName,
            options: validationOptions,
            constraints: [],
            validator: IsValidFromPassesConstraint
        });
    };
}

export function IsValidToPasses(property: string, validationOptions?: ValidationOptions) {
    return function (object: Object, propertyName: string) {
        registerDecorator({
            target: object.constructor,
            propertyName: propertyName,
            options: validationOptions,
            constraints: [property],
            validator: IsValidToPassesConstraint,
        });
    };
}

export function ShouldHaveBuildingId(property: string, validationOptions?: ValidationOptions) {
    return function (object: Object, propertyName: string) {
        registerDecorator({
            target: object.constructor,
            propertyName: propertyName,
            options: validationOptions,
            constraints: [property],
            validator: ShouldHaveBuildingIdConstraint
        });
    };
}

export function ShouldHaveOrganizationId(property: string, validationOptions?: ValidationOptions) {
    return function (object: Object, propertyName: string) {
        registerDecorator({
            target: object.constructor,
            propertyName: propertyName,
            options: validationOptions,
            constraints: [property],
            validator: ShouldHaveOrganizationIdConstraint
        });
    };
}

export function ShouldHaveTenantId(property: string, validationOptions?: ValidationOptions) {
    return function (object: Object, propertyName: string) {
        registerDecorator({
            target: object.constructor,
            propertyName: propertyName,
            options: validationOptions,
            constraints: [property],
            validator: ShouldHaveTenantIdConstraint
        });
    };
}



export function IsLockNameUnique(property: string, validationOptions?: ValidationOptions) {
    return function (object: Object, propertyName: string) {
        registerDecorator({
            target: object.constructor,
            propertyName: propertyName,
            options: validationOptions,
            constraints: [property],
            validator: IsLockNameUniqueConstraint
        });
    };
}

export function IsBuildingNameUnique(validationOptions?: ValidationOptions) {
    return function (object: Object, propertyName: string) {
        registerDecorator({
            target: object.constructor,
            propertyName: propertyName,
            options: validationOptions,
            constraints: [],
            validator: IsBuildingNameUniqueConstraint,
        });
    };
}

export function IsTenantNameUnique(validationOptions?: ValidationOptions) {
    return function (object: Object, propertyName: string) {
        registerDecorator({
            target: object.constructor,
            propertyName: propertyName,
            options: validationOptions,
            constraints: [],
            validator: IsTenantNameUniqueConstraint,
        });
    };
}

export function IsLockBelongsToBuilding(validationOptions?: ValidationOptions) {
    return function (object: Object, propertyName: string) {
        registerDecorator({
            target: object.constructor,
            propertyName: propertyName,
            options: validationOptions,
            constraints: [],
            validator: IsLockBelongsToBuildingConstraint,
        });
    };
}