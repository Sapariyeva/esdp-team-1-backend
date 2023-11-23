import { IUser } from "@/interfaces/IUser";
import { ERole } from "@/types/roles";
import { Expose } from "class-transformer"
import { IsNotEmpty, IsString, IsOptional, IsBoolean } from 'class-validator'
// import { IsRoleValid } from "./customValidators";

export class userDTO implements IUser {
    @Expose()
    id!: string;

    @IsNotEmpty({ message: 'User name required' })
    @IsString({ message: 'User name should be string' })
    @Expose()
    username!: string;

    @IsNotEmpty({ message: 'Password required' })
    @Expose()
    pass!: string;

    @IsOptional()
    @Expose()
    token?: string;

    @IsNotEmpty({ message: 'Role required' })
    // @IsRoleValid({ message: 'Attempted to assign an invalid role' })
    @Expose()
    role!: ERole;

    @IsNotEmpty({ message: 'Rights to create QR access should be set' })
    @IsBoolean({ message: 'Right to create guest QRs should be set as boolean value' })
    @Expose()
    canCreateQR!: Boolean;
}