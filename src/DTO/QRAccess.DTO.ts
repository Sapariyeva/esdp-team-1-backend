import { IQrFindOptions } from "@/interfaces/IFindOptions.interface";
import { IQRAccess, IQRAccessReq } from "@/interfaces/IQRAccess.interface";
import { Expose } from "class-transformer";
import { ArrayMinSize, IsArray, IsNotEmpty, IsNumberString, IsOptional, IsPhoneNumber, IsPositive, IsString } from 'class-validator';
import { IsLockExist, IsUserExist, IsValidFromPasses, IsValidToPasses } from "./customValidators";

export class QRAccessReqDTO implements IQRAccessReq{
    @IsString({ message: "Phone number should be string" })
    @IsPhoneNumber(undefined, { message: "Invalid phone number format" })
    @Expose()
    phone!: string; 

    @IsPositive({ message: "valid_from field should be a positive number" })
    @IsValidFromPasses({ message: "valid_from should be convertable to datetime and should be not earlier than the current moment" })
    @Expose()
    valid_from!: number;

    @IsPositive({ message: "valid_to field should be a positive number" })
    @IsValidToPasses('valid_from', { message: 'valid_to should be convertable to datetime and must be at least 1 hour later than valid_from' })
    @Expose()
    valid_to!: number;

    @Expose()
    @IsString({each: true, message: "Locks must have string type id"})
    @IsArray({ message: "locks field must contain an array of lock UUIDs" })
    @ArrayMinSize(1, ({ message: "locks array must contain at least one element" }))
    @IsLockExist({each: true, message: "Some of the specified locks are not registered"})
    locks!: string[];
}

export class QRAccessDTO extends QRAccessReqDTO implements IQRAccess{
    @Expose()
    @IsNotEmpty({ message: "Access ID required!" })
    id!: string;

    @IsNotEmpty({ message: "Id of the authorizing user is required!" })
    @IsUserExist({message: "The user authorizing the access is not registered!"})
    @Expose()
    author!: string; 

    @IsNotEmpty({ message: "QR link required!" })
    @IsString({message: "QR link must be string!"})
    @Expose()
    link?: string;
}

export class QrFindOptionsDTO implements IQrFindOptions {
    @Expose()
    @IsOptional()
    @IsUserExist({message: "The user authorizing the access is not registered!"})
    author?: string;
    
    @Expose()
    @IsOptional()
    @IsString({ message: "Phone number should be string" })
    @IsPhoneNumber(undefined, { message: "Invalid phone number format" })
    phone?: string;
    
    @Expose()
    @IsOptional()
    @IsString()
    @IsLockExist({ message: "Lock is not registered" })
    lock?: string;

    @Expose()
    @IsOptional()
    @IsString({ each: true, message: "Locks must have string type id" })
    @IsArray({ message: "locks field must contain an array of lock UUIDs" })
    @IsLockExist({ each: true, message: "Some of the specified locks in search params are not registered" })
    locks?: string[]

    @Expose()
    @IsOptional()
    @IsPositive({ message: "valid_from field should be a positive number" })
    date_from?: number;

    @Expose()
    @IsOptional()
    @IsPositive({ message: "valid_to field should be a positive number" })
    date_to?: number;

    @Expose()
    @IsOptional()
    @IsString()
    only_active?: string;

    @Expose()
    @IsOptional()
    @IsString()
    only_expired?: string;

    @Expose()
    @IsOptional()
    @IsNumberString()
    offset?: number;
}

