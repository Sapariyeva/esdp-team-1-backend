import { BuildingRepository } from "@/repositories/building.repository";
import { ValidationArguments, ValidationOptions, ValidatorConstraint, ValidatorConstraintInterface, registerDecorator } from "class-validator";

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
            return false;
        }
        else {
            return true
        }

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