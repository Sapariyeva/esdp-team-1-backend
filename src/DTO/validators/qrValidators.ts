import { MIN_ACCESS_INTERVAL } from "@/constants";
import { ValidationArguments, ValidationOptions, ValidatorConstraint, ValidatorConstraintInterface, registerDecorator } from "class-validator";

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