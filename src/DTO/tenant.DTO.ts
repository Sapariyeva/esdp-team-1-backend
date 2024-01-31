import { Expose } from "class-transformer";
import { IsArray, IsBoolean, IsEmail, IsNotEmpty, IsOptional, IsPhoneNumber, IsString, IsUUID } from "class-validator";
import { IsBuildingExist } from "./validators/buildingsValidators";
import { IsTenantExist, IsTenantNameUnique } from "./validators/tenantsValidators";
import { IsLockBelongsToBuilding, IsLockExist } from "./validators/locksValidators";
import { IsOrganizationExist } from "./validators/organizationsValidators";
import { IsNotChangable } from "./validators/generalValidators";
import { ITenant } from "@/interfaces/ITenant.interface";


export class TenantDTO implements ITenant{
  @IsOptional()
  @Expose()
  id!: string;

  @IsTenantNameUnique({ message: "Tenant with this name already exists in the specified building" })
  @IsNotEmpty({ message: 'tenants name should be specified' })
  @IsString({ message: 'tenants name should be of string type' })
  @Expose()
  name!: string;

  @IsOptional()
  @IsString(({ message: 'Tenants legal adress should be of string type' }))
  @Expose()
  legalAddress?: string;

  @IsOptional()
  @IsPhoneNumber(undefined, {message: "malformed phone number"})
  @Expose()
  phone?: string;

  @IsOptional()
  @IsEmail(undefined, {message: "malformed email"})
  @Expose()
  email?: string;

  @Expose()
  @IsString({each: true, message: "Locks must have string type id"})
  @IsArray({ message: "locks field must contain an array of lock UUIDs" })
  @IsLockExist({each: true, message: "Some of the specified locks are not registered"})
  @IsLockBelongsToBuilding({each: true, message: "Some of the specified locks are not associated with the specified building"})
  locks!: string[];

  @IsBoolean({ message: 'Activation status should be boolean' })
  @IsOptional()
  isActive!: boolean;

  @Expose()
  @IsNotEmpty({ message: 'building Id should be specified' })
  @IsUUID(undefined, { message: "malformed building Id" })
  @IsBuildingExist({ message: 'Building with specified Id is not registered' })
  @IsNotChangable('tenantDTO', { message: 'Building Id can not be changed' })
  buildingId!: string;
}

export class tenantFindOptionsDTO {
  @Expose()
  @IsOptional()
  @IsOrganizationExist({ message: 'Organization with Id provided in search params is not registered' })
  organizationId?: string

  @Expose()
  @IsOptional()
  @IsString({ message: 'building Id should be string' })
  @IsBuildingExist({ message: 'Building with Id provided in search params is not registered' })
  @IsUUID(undefined, { message: "malformed building Id" })
  buildingId?: string;

  @Expose()
  @IsOptional()
  @IsString({ each: true, message: "Tenants must have string type id" })
  @IsArray({ message: "tenants field must contain an array of tenant UUIDs" })
  @IsTenantExist({ each: true, message: "Some of the tenants specified in search params are not registered" })
  tenants?: string[]
}
