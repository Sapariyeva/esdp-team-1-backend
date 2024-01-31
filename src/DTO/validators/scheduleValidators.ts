import { WeeklyScheduleRepository } from "@/repositories/schedule.repository";
import { ValidationArguments, ValidationOptions, ValidatorConstraint, ValidatorConstraintInterface, registerDecorator } from "class-validator";


export function IsWeeklyScheduleExist(validationOptions?: ValidationOptions) {
    return function (object: Object, propertyName: string) {
        registerDecorator({
            target: object.constructor,
            propertyName: propertyName,
            options: validationOptions,
            constraints: [],
            validator: IsWeeklyScheduleExistConstraint,
        });
    };
}

export function IsWeeklyScheduleElement(validationOptions?: ValidationOptions) {
    return function (object: Object, propertyName: string) {
        registerDecorator({
            target: object.constructor,
            propertyName: propertyName,
            options: validationOptions,
            constraints: [],
            validator: IsWeeklyScheduleElementConstraint,
        });
    };
}

export function IsWeeklyScheduleNameUnique(validationOptions?: ValidationOptions) {
    return function (object: Object, propertyName: string) {
        registerDecorator({
            target: object.constructor,
            propertyName: propertyName,
            options: validationOptions,
            constraints: [],
            validator: IsWeeklyScheduleNameUniqueConstraint,
        });
    };
}



@ValidatorConstraint({ async: true })
export class IsWeeklyScheduleExistConstraint implements ValidatorConstraintInterface {
    async validate(scheduleId: any, args: ValidationArguments) {
        const scheduleRepo = new WeeklyScheduleRepository()
        return scheduleRepo.getScheduleById(scheduleId).then(sc => {
            if (sc) return true;
            return false;
        });
    }
}

@ValidatorConstraint({ async: true })
export class IsWeeklyScheduleElementConstraint implements ValidatorConstraintInterface {
    async validate(element:any, args: ValidationArguments) {
        const keys = ['start', 'end', 'isActive']
        if (typeof element === 'object'){
            const isKeyArr =Object.keys(element).map((k) => {
                return keys.includes(k)})
            if (isKeyArr.includes(false)) {
                return false
            }
            if(!(typeof element.isActive === 'boolean')){
                return false
            }
            if (element.isActive){
                if (!(typeof element.start === 'number') || element.start<0){
                    return false
                }
                if (!(typeof element.end === 'number') || (element.end >= (24 * 60 * 60 *1000))) {
                    return false
                }
                if ((element.end - element.start) < (60 * 60 *1000)) {
                    return false
                }
            }
            return true
        }
        return false
    }
}

@ValidatorConstraint({ async: true })
export class IsWeeklyScheduleNameUniqueConstraint implements ValidatorConstraintInterface {
    async validate(name: string, args: ValidationArguments) {
        const id = (args.object as { id: string }).id;
        const organizationRepo = new WeeklyScheduleRepository();
        const existingSchedule = await organizationRepo.findOne({
            where: {
                name
            },
        });
        if (!existingSchedule || (id === existingSchedule?.id)) {
            return true;
        }
        else {
            return false
        }
    }
}

