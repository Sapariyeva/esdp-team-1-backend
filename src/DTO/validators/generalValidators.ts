import { BuildingRepository } from "@/repositories/building.repository";
import { LockRepository } from "@/repositories/locks.repository";
import { OrganizationRepository } from "@/repositories/organization.repository";
import { TenantRepository } from "@/repositories/tenant.repository";
import { UserRepository } from "@/repositories/user.repository";
import { ValidationArguments, ValidationOptions, ValidatorConstraint, ValidatorConstraintInterface, registerDecorator } from "class-validator";

export type repoTypes = OrganizationRepository | BuildingRepository | TenantRepository | LockRepository | UserRepository;

export function IsNotChangable(property: string, validationOptions?: ValidationOptions) {
    return function (object: Object, propertyName: string) {
        registerDecorator({
            target: object.constructor,
            propertyName: propertyName,
            options: validationOptions,
            constraints: [property],
            validator: NotChangableConstraint,
        });
    };
}

export function ArraySize(length: Number, validationOptions?: ValidationOptions) {
    return function (object: Object, propertyName: string) {
        registerDecorator({
            target: object.constructor,
            propertyName: propertyName,
            options: validationOptions,
            constraints: [length],
            validator: ArraySizeConstraint,
        });
    };
}

@ValidatorConstraint({ async: true })
export class NotChangableConstraint implements ValidatorConstraintInterface {
    async validate(entityId: string, args: ValidationArguments) {
        const id = (args.object as { id: string }).id;
        const [property] = args.constraints
        let key: string
        let repo: repoTypes;

        switch (property) {
            case 'buildingDTO':
                repo = new BuildingRepository();
                key = 'organizationId'
                break
            case 'tenantDTO':
                repo = new TenantRepository();
                key = 'buildingId'
                break
            case 'lockDTO':
                repo = new LockRepository();
                key = 'buildingId'
                break
            default: 
                return true
        }
        const entity = await repo.findOne({
            where: {
                id
            }
        })
        if (!entity) {
            return true
        }
        return checkId(entity, key, entityId)
    }
}


@ValidatorConstraint({ async: true })
export class ArraySizeConstraint implements ValidatorConstraintInterface {
    async validate(arr: any, args: ValidationArguments) {
        if (Array.isArray(arr)) {
            const [length] = args.constraints
            return arr.length === length ? true : false
        }
        return false
    };
}

export const checkId = <T extends object>(entity: T, key: string, newValue: string) => {
    const value = entity[key as keyof typeof entity]
    if (value === newValue) {
        return true
    }
    return false
}
