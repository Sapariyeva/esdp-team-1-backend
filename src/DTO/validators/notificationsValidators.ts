import { QRAccessRepository } from "@/repositories/QRAccess.repository";
import { ENotificationTypes } from "@/types/notifocations";
import { ValidationArguments, ValidationOptions, ValidatorConstraint, ValidatorConstraintInterface, registerDecorator } from "class-validator";

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