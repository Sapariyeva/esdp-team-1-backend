import { ILock } from "@/interfaces/Ilock.interface";
import { EBarrierType } from "@/types/barriers";
import { Expose } from "class-transformer";
import { IsArray, IsBoolean, IsOptional, IsString, MaxLength } from "class-validator";
import { IsBuildingExist } from "./validators/buildingsValidators";
import { IsBarrierTypeValid, IsLockExist, IsLockNameUnique } from "./validators/locksValidators";
import { IsOrganizationExist } from "./validators/organizationsValidators";
import { IsNotChangable } from "./validators/generalValidators";

export class lockDTO implements ILock {
    @IsOptional()
    @Expose()
    id!: string;

    @Expose()
    @IsString({ message: 'building Id should be string' })
    @IsBuildingExist({ message: 'Building with provided Id is not registered' })
    @IsNotChangable('lockDTO', { message: 'Building Id can not be changed' })
    buildingId!: string;

    @Expose()
    @IsString({ message: 'Lock name should be string' })
    @MaxLength(50, { message: 'Lock name should not be longer than 50 symbols' })
    @IsLockNameUnique('buildingId', { message: 'Lock with the same name already registered in this building' })
    name!: string;

    @IsBoolean({ message: 'Activation status should be boolean' })
    @Expose()
    isActive!: boolean;

    @Expose()
    @IsBarrierTypeValid({ message: 'Invalid barrier type has been provided' })
    type!: EBarrierType;
}

export class lockFindOptionsDTO {
    @Expose()
    @IsOptional()
    @IsString({ message: 'building Id should be string' })
    @IsBuildingExist({ message: 'Building with Id provided in search params is not registered' })
    buildingId?: string;

    @Expose()
    @IsOptional()
    @IsOrganizationExist({ message: 'Organization with Id provided in search params is not registered' })
    organizationId?: string

    @Expose()
    @IsOptional()
    @IsString({ each: true, message: "Locks must have string type id" })
    @IsArray({ message: "locks field must contain an array of lock UUIDs" })
    @IsLockExist({ each: true, message: "Some of the locks specified in search params are not registered" })
    locks?: string[]
}
