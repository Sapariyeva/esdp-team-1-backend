import { ERole } from "@/types/roles";
import { Expose } from "class-transformer";
import { IsBoolean, IsNotEmpty, IsPhoneNumber, IsString } from 'class-validator';
// import { IsRoleValid } from "./customValidators";

export class RegisterUserDTO {
    @Expose()
    @IsNotEmpty({ message: 'Phone number required' })
    @IsPhoneNumber()
    phone!: string;

    @IsNotEmpty({ message: 'User name required' })
    @IsString({ message: 'User name should be string' })
    @Expose()
    username!: string;

    @IsNotEmpty({ message: 'Password required' })
    @Expose()
    pass!: string;

    @IsNotEmpty({ message: 'Role required' })
    // @IsRoleValid({ message: 'Attempted to assign an invalid role' })
    @Expose()
    role!: ERole;

    @IsNotEmpty({ message: 'Rights to create QR access should be set' })
    @IsBoolean({ message: 'Right to create guest QRs should be set as boolean value' })
    @Expose()
    canCreateQR!: boolean;
}

export class SignInUserDTO {
    @Expose()
    @IsNotEmpty({ message: 'Phone number required' })
    @IsPhoneNumber()
    phone!: string;

    @Expose()
    @IsNotEmpty({ message: 'Password required' })
    @IsString()
    pass!: string;
}