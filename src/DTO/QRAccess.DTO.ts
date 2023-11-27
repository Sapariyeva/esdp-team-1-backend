import { IQRAccess, IQRAccessReq } from "@/interfaces/IQRAccess.interface";
import { Expose } from "class-transformer"
import { IsNotEmpty, IsString, IsPositive, IsPhoneNumber, Min } from 'class-validator'
import { IsLockExist, IsUserExist } from "./customValidators";

export class QRAccessReqDTO implements IQRAccessReq{
    @IsString({ message: "Phone number should be string" })
    @IsPhoneNumber(undefined, { message: "Invalid phone number format" })
    @Expose()
    phone!: string; 

    @IsPositive({ message: "valid_from field should be a positive number" })
    @Min(1672506000000, { message: "minimum valid_from datetime is 2023-01-01T00:00:00" })
    @Expose()
    valid_from!: number;

    @IsPositive({ message: "valid_to field should be a positive number" })
    @Expose()
    valid_to!: number;

    @Expose()
    @IsString({each: true, message: "Locks must have string type id"})
    @IsLockExist({each: true, message: "Some of the specidied locks are not registered"})
    locks!: string[];
}

export class QRAccessDTO extends QRAccessReqDTO implements IQRAccess{
    @Expose()
    @IsNotEmpty({ message: "Access ID required!" })
    id!: string;

    @IsNotEmpty({ message: "Id of the authorizing user is required!" })
    @IsUserExist({message: "The user authorizing the acces is not registered!"})
    @Expose()
    author!: string; 

    @IsNotEmpty({ message: "QR link required!" })
    @IsString({message: "QR link must be string!"})
    @Expose()
    link?: string;
}

