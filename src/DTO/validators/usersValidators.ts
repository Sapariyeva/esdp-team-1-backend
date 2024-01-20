import { BuildingRepository } from "@/repositories/building.repository";
import { OrganizationRepository } from "@/repositories/organization.repository";
import { TenantRepository } from "@/repositories/tenant.repository";
import { UserRepository } from "@/repositories/user.repository";
import { ERole } from "@/types/roles";
import { ValidationArguments, ValidationOptions, ValidatorConstraint, ValidatorConstraintInterface, registerDecorator } from "class-validator";

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

export function IsPhoneUnique(validationOptions?: ValidationOptions) {
    return function (object: Object, propertyName: string) {
        registerDecorator({
            target: object.constructor,
            propertyName: propertyName,
            options: validationOptions,
            constraints: [],
            validator: IsPhoneUniqueConstraint,
        });
    };
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
export class IsPhoneUniqueConstraint implements ValidatorConstraintInterface {
    async validate(phone: string, args: ValidationArguments) {
        const id = (args.object as { id: string }).id;
        const userRepo = new UserRepository();
        const existingUser = await userRepo.findOne({
            where: {
                phone,
            },
        });
        if (id !== existingUser?.id) {
            return false;
        }
        else {
            return true
        }
    }
}