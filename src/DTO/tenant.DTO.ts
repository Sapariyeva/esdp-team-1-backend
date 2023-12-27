import { Expose } from "class-transformer";
import { IsArray, IsEmail, IsNotEmpty, IsOptional, IsPhoneNumber, IsString, IsUUID } from "class-validator";
import { IsLockExist } from "./customValidators";

export class TenantDTO {
  @IsOptional()
  @Expose()
  id!: string;

  //add custom validator for checking if building exists
  @IsNotEmpty()
  @IsUUID()
  @Expose()
  buildingId!: string;

  // this one is tricky - theoretically one tenant can be present in the multiple buildings.
  // for now we can add a generic custom validator for checking unique tenant names inside one given building
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
  // @IsLockBelongsToBuilding()
  locks!: string[];
}
