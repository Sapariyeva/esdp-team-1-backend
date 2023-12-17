import { Expose } from "class-transformer";
import { IsEmail, IsNotEmpty, IsOptional, IsPhoneNumber, IsString, IsUUID } from "class-validator";

export class TenantDTO {
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
}
