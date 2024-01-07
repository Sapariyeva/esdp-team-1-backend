import { Expose } from "class-transformer";
import { IsArray, IsNotEmpty, IsOptional, IsString, IsUUID } from "class-validator";
import { IsBuildingExist, IsBuildingNameUnique, IsOrganizationExist } from "./customValidators";

export class BuildingDTO {
  @IsOptional()
  @Expose()
  id!: string;

  @IsNotEmpty()
  @IsUUID()
  @Expose()
  //add custom validator for checking if organization exists
  organizationId!: string;

  @IsNotEmpty()
  @IsString()
  @Expose()
  @IsBuildingNameUnique({ message: 'Building name must be unique within the organization.' })
  //add custom validator for checking is name unique for the organization
  name!: string;

  @IsNotEmpty()
  @IsString()
  @Expose()
  address!: string;
}

export class buildingFindOptionsDTO {
  @Expose()
  @IsOptional()
  @IsOrganizationExist({ message: 'Organization with Id provided in search params is not registered' })
  organizationId?: string

  @Expose()
  @IsOptional()
  @IsString({ each: true, message: "buildings must have string type id" })
  @IsArray({ message: "buildings field must contain an array of building UUIDs" })
  @IsBuildingExist({ each: true, message: "Some of the specified buildings in search params are not registered" })
  buildings?: string[]
}
