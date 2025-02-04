import { LockRepository } from "@/repositories/locks.repository";
import { EBarrierType } from "@/types/barriers";
import { ValidationArguments, ValidationOptions, ValidatorConstraint, ValidatorConstraintInterface, isUUID, registerDecorator } from "class-validator";

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

@ValidatorConstraint({ async: true })
export class IsLockNameUniqueConstraint implements ValidatorConstraintInterface {
    async validate(name: string, args: ValidationArguments) {
        const buildingId = (args.object as { buildingId: string }).buildingId;
        const id = (args.object as { id: string }).id;
        const lockRepo = new LockRepository()
        const locksOfBuilding = (await lockRepo.getAllLocksQuery({buildingId:buildingId}))
        const locksWithSameName = locksOfBuilding.filter(l => {return l.name === name})
        if (locksWithSameName.length === 0){
            return true
        }
        else if (locksWithSameName.length === 1){
            return locksWithSameName[0].id === id? true : false
        }
        return false
    }
}


@ValidatorConstraint({ async: true })
export class IsLockBelongsToBuildingConstraint implements ValidatorConstraintInterface {
    async validate(id: string, args: ValidationArguments) {
        const buildingId = (args.object as { buildingId: string }).buildingId;
        const lockRepo = new LockRepository();
        if (!isUUID(buildingId)) {
            return false
        }
        const existingLock = await lockRepo.findOne({
            where: {
                id,
                buildingId,
            },
        });
        return !!(existingLock);
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