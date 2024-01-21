import { ERole } from "@/types/roles";
import { Expose } from "class-transformer";
import { IsArray, IsBoolean, IsNotEmpty, IsNumberString, IsOptional, IsPhoneNumber, IsString } from 'class-validator';
import { IUserFindOptions } from "@/interfaces/IFindOptions.interface";
import { IUser } from "@/interfaces/IUser";
import { IsPhoneUnique, IsRoleValid, ShouldHaveBuildingId, ShouldHaveOrganizationId, ShouldHaveTenantId } from "./validators/usersValidators";
import { IsLockExist } from "./validators/locksValidators";

export class RegisterUserDTO {
    @Expose()
    @IsNotEmpty({ message: 'Phone number required' })
    @IsPhoneNumber(undefined, { message: "Invalid phone number format" })
    @IsPhoneUnique({ message: "Phone number is not unique" })
    phone!: string;

    @IsNotEmpty({ message: 'User name required' })
    @IsString({ message: 'User name should be string' })
    @Expose()
    username!: string;

    @IsNotEmpty({ message: 'Password required' })
    @Expose()
    pass!: string;

    @IsNotEmpty({ message: 'Role required' })
    @IsRoleValid({ message: 'Invalid role' })
    @Expose()
    role!: ERole;

    @IsNotEmpty({ message: 'Rights to create QR access should be set' })
    @IsBoolean({ message: 'Right to create guest QRs should be set as boolean value' })
    @Expose()
    canCreateQR!: boolean;

    @Expose()
    @ShouldHaveBuildingId('role',{ message: 'TBuilding administrators must have valid building Id attached, other roles must have this field empty' })
    buildingId?:string;

    @Expose()
    @ShouldHaveOrganizationId('role', { message: 'Organization administrators must have valid organization Id attached, other roles must have this field empty' })
    organizationId?:string;

    @Expose()
    @ShouldHaveTenantId('role', { message: 'Tenant Administrators must have valid tenant Id attached, other roles must have this field empty' })
    tenantId?:string;

    @Expose()
    @IsString({each: true, message: "Locks must have string type id"})
    @IsArray({ message: "locks field must contain an array of lock UUIDs" })
    @IsLockExist({each: true, message: "Some of the specified locks are not registered"})
    locks?:string[];

    @Expose()
    @IsOptional()
    @IsBoolean({message: "Activation flag must be of type boolean"})
    isActive?: boolean;
}

export class SignInUserDTO {
    @Expose()
    @IsNotEmpty({ message: 'Phone number required' })
    @IsPhoneNumber(undefined, { message: "malformed phone number" })
    phone!: string;

    @Expose()
    @IsNotEmpty({ message: 'Password required' })
    @IsString({ message: 'Password must be of string type' })
    pass!: string;
}

export class UserFindOptionsDTO implements IUserFindOptions {
    @Expose()
    @IsOptional()
    @IsString({ message: 'user name must be of string type' })
    username?: string;
    
    @Expose()
    @IsOptional()
    @IsString({ message: "Phone number should be string" })
    phone?: string;
    
    @Expose()
    @IsOptional()
    @IsRoleValid({message: "invalid role"})
    role?: ERole;

    @Expose()
    @IsOptional()
    @IsString({message: "organization Id must be of string type"})
    organizationId?: string;

    @Expose()
    @IsOptional()
    @IsString({message: "building Id must be of string type"})
    buildingId?: string;

    @Expose()
    @IsOptional()
    @IsString({message: "tenant Id must be of string type"})
    tenantId?: string;

    @Expose()
    @IsOptional()
    @IsNumberString()
    offset?: number;
}

export class UpdateUserDTO implements Partial<IUser> {
    @Expose()
    @IsOptional()
    @IsNotEmpty()
    @IsString({ message: 'User name should be string' })
    username?: string;

    @Expose()
    @IsOptional()
    @IsString()
    @IsNotEmpty()
    pass?: string;

    @Expose()
    @IsOptional()
    @IsBoolean()
    canCreateQR?: boolean;

    @Expose()
    @IsOptional()
    @IsBoolean({message: "activation flag must be of type Boolean"})
    isActive?: boolean;

    @Expose()
    @IsOptional()
    @IsString({each: true, message: "Locks must have string type id"})
    @IsArray({ message: "locks field must contain an array of lock UUIDs" })
    @IsLockExist({each: true, message: "Some of the specified locks are not registered"})
    locks?: string[];
}