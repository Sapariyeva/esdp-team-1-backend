import { Expose } from "class-transformer";
import { IsNotEmpty, IsOptional, IsString, IsUUID } from "class-validator";
import { IsBuildingNameUnique } from "./customValidators";

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
