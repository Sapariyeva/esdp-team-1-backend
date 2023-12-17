import { Expose } from "class-transformer";
import { IsEmail, IsNotEmpty, IsOptional, IsPhoneNumber, IsString } from "class-validator";

export class OrganizationDTO {
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
