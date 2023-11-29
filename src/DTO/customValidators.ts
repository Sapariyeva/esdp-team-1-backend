import { QRAccessRepository } from '@/repositories/QRAccess.repository';
import { LockRepository } from '@/repositories/locks.repository';
import { UserRepository } from '@/repositories/user.repository';
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
export class IsValidFromPassesConstaint implements ValidatorConstraintInterface {
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
export class IsValidToPassesConstaint implements ValidatorConstraintInterface {
  async validate(valid_to: number, args: ValidationArguments) {
    const datetime = new Date(valid_to);
    if (datetime instanceof Date) {
      const [valid_from] = args.constraints;
      const dateFromAsNumber = (args.object as any)[valid_from] as number;
      return valid_to - dateFromAsNumber > 3600 * 1000 ? true : false;
    } else {
      return false;
    }
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
        validator: IsValidFromPassesConstaint
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
        validator: IsValidToPassesConstaint,
      });
    };
  }