import { Expose } from "class-transformer";
import { IsNotEmpty, IsString, IsUUID } from "class-validator";

export class BuildingDTO {
  @IsNotEmpty()
  @IsUUID()
  @Expose()
  //add custom validator for checking if organization exists
  organizationId!: string;

  @IsNotEmpty()
  @IsString()
  @Expose()
  //add custom validator for checking is name unique for the organization
  name!: string;

  @IsNotEmpty()
  @IsString()
  @Expose()
  address!: string;
}
