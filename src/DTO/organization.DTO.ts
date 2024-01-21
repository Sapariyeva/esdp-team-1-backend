import { Expose } from "class-transformer";
import { IsArray, IsEmail, IsNotEmpty, IsOptional, IsPhoneNumber, IsString } from "class-validator";
import { IsOrganizationExist, IsOrganizationNameUnique } from "./validators/organizationsValidators";

export class OrganizationDTO {
  @IsOptional()
  @Expose()
  id!: string;

  @IsNotEmpty({message:"Organization name must be specified" })
  @IsString({message:"Organization must have string type name" })
  @IsOrganizationNameUnique({message: 'Organization with this name is already registered'})
  @Expose()
  name!: string;

  @IsOptional()
  @IsString({message:"Organizations legal address must have string type name" })
  @Expose()
  legalAddress?: string;

  @IsOptional()
  @IsPhoneNumber(undefined, {message:"malformed phone number"})
  @Expose()
  phone?: string;

  @IsOptional()
  @IsEmail(undefined, {message:"malformed email"})
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
