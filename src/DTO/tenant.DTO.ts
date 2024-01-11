import { Expose } from "class-transformer";
import { IsArray, IsEmail, IsNotEmpty, IsOptional, IsPhoneNumber, IsString, IsUUID } from "class-validator";
import { IsBuildingExist, IsLockBelongsToBuilding, IsLockExist, IsOrganizationExist, IsTenantExist, IsTenantNameUnique } from "./customValidators";

export class TenantDTO {
  @IsOptional()
  @Expose()
  id!: string;

  //add custom validator for checking if building exists
  @IsNotEmpty()
  @IsUUID()
  @IsBuildingExist()
  @Expose()
  buildingId!: string;

  @IsTenantNameUnique({ message: "Tenant with this name already exists in the specified building" })
  @IsNotEmpty()
  @IsString()
  @Expose()
  name!: string;

  @IsOptional()
  @IsString()
  @Expose()
  legalAddress?: string;

  @IsOptional()
  @IsPhoneNumber()
  @Expose()
  phone?: string;

  @IsOptional()
  @IsEmail()
  @Expose()
  email?: string;

  @Expose()
  @IsString({each: true, message: "Locks must have string type id"})
  @IsArray({ message: "locks field must contain an array of lock UUIDs" })
  @IsLockExist({each: true, message: "Some of the specified locks are not registered"})
  @IsLockBelongsToBuilding({each: true, message: "Some of the specified locks are not associated with the specified building"})
  locks!: string[];
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
  buildingId?: string;

  @Expose()
  @IsOptional()
  @IsString({ each: true, message: "Tenants must have string type id" })
  @IsArray({ message: "tenants field must contain an array of tenant UUIDs" })
  @IsTenantExist({ each: true, message: "Some of the tenants specified in search params are not registered" })
  tenants?: string[]
}
