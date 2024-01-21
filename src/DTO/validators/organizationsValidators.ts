import { OrganizationRepository } from "@/repositories/organization.repository";
import { ValidationArguments, ValidationOptions, ValidatorConstraint, ValidatorConstraintInterface, registerDecorator } from "class-validator";

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

export function IsOrganizationNameUnique(validationOptions?: ValidationOptions) {
    return function (object: Object, propertyName: string) {
        registerDecorator({
            target: object.constructor,
            propertyName: propertyName,
            options: validationOptions,
            constraints: [],
            validator: IsOrganizationNameUniqueConstraint,
        });
    };
}

@ValidatorConstraint({ async: true })
export class IsOrganizationNameUniqueConstraint implements ValidatorConstraintInterface {
    async validate(name: string, args: ValidationArguments) {
        const id = (args.object as { id: string }).id;
        const organizationRepo = new OrganizationRepository();
        const existingOrganization = await organizationRepo.findOne({
            where: {
                name
            },
        });
        if (!existingOrganization || (id === existingOrganization?.id)) {
            return true;
        }
        else {
            return false
        }
    }
}

@ValidatorConstraint({ async: true })
export class IsOrganizationExistConstraint implements ValidatorConstraintInterface {
    async validate(organizationId: any) {
        const orgRepo = new OrganizationRepository()
        return orgRepo.getOrganizationById(organizationId).then(org => {
            if (org) return true;
            return false;
        });
    }
}