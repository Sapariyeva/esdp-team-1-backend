import { Expose } from "class-transformer";
import { IsArray, IsEmail, IsNotEmpty, IsOptional, IsPhoneNumber, IsString } from "class-validator";
import { IsOrganizationExist } from "./customValidators";

export class OrganizationDTO {
  @IsOptional()
  @Expose()
  id!: string;

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
}

export class organizationFindOptionsDTO {
  @Expose()
  @IsOptional()
  @IsString({ each: true, message: "Organizations must have string type id" })
  @IsArray({ message: "organizations field must contain an array of organization UUIDs" })
  @IsOrganizationExist({ each: true, message: "Some of the specified organizations in search params are not registered" })
  organizations?: string[]
}
