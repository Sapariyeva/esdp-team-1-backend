import { TenantRepository } from "@/repositories/tenant.repository";
import { ValidationArguments, ValidationOptions, ValidatorConstraint, ValidatorConstraintInterface, registerDecorator } from "class-validator";

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
export class IsTenantExistConstraint implements ValidatorConstraintInterface {
    async validate(tenantId: any, args: ValidationArguments) {
        const tenantRepo = new TenantRepository()
        return tenantRepo.getTenantById(tenantId).then(tenant => {
            if (tenant) return true;
            return false;
        });
    }
}