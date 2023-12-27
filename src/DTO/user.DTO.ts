import { ERole } from "@/types/roles";
import { Expose } from "class-transformer";
import { IsArray, IsBoolean, IsNotEmpty, IsPhoneNumber, IsString } from 'class-validator';
import { IsLockExist, ShouldHaveBuildingId, ShouldHaveOrganizationId, ShouldHaveTenantId } from "./customValidators";
// import { IsRoleValid } from "./customValidators";

export class RegisterUserDTO {
    @Expose()
    @IsNotEmpty({ message: 'Phone number required' })
    @IsPhoneNumber()
    phone!: string;

    @IsNotEmpty({ message: 'User name required' })
    @IsString({ message: 'User name should be string' })
    @Expose()
    username!: string;

    @IsNotEmpty({ message: 'Password required' })
    @Expose()
    pass!: string;

    @IsNotEmpty({ message: 'Role required' })
    // @IsRoleValid({ message: 'Attempted to assign an invalid role' })
    @Expose()
    role!: ERole;

    @IsNotEmpty({ message: 'Rights to create QR access should be set' })
    @IsBoolean({ message: 'Right to create guest QRs should be set as boolean value' })
    @Expose()
    canCreateQR!: boolean;

    @Expose()
    @ShouldHaveBuildingId('role',{ message: 'TBuilding administrators must have valid building Id attached, other roles must have this field empty' })
    buildingId?:string

    @Expose()
    @ShouldHaveOrganizationId('role', { message: 'Organization administrators must have valid organization Id attached, other roles must have this field empty' })
    organizarionId?:string

    @Expose()
    @ShouldHaveTenantId('role', { message: 'Tenant Administrators must have valid tenant Id attached, other roles must have this field empty' })
    tenantId?:string


    @Expose()
    @IsString({each: true, message: "Locks must have string type id"})
    @IsArray({ message: "locks field must contain an array of lock UUIDs" })
    @IsLockExist({each: true, message: "Some of the specified locks are not registered"})
    locks?:string[]
}

export class SignInUserDTO {
    @Expose()
    @IsNotEmpty({ message: 'Phone number required' })
    @IsPhoneNumber()
    phone!: string;

    @Expose()
    @IsNotEmpty({ message: 'Password required' })
    @IsString()
    pass!: string;
}