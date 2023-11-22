// import { IArtist } from "@/interfaces/IArtist";
import { IQRAccess, IQRAccessReq } from "@/interfaces/IQRAccess.interface";
import { Expose } from "class-transformer"
import { IsNotEmpty, IsString, IsPositive } from 'class-validator'
// import { IsUserExist } from "./customValidators";


// phone: string;
//     locks: string[];
//     valid_from: number;
//     valid_to: number;
export class QRAccessReqDTO implements IQRAccessReq{

    @IsString({ message: "Phone number should be string" })
    @Expose()
    phone!: string; //TODO validate as a phone number

    @IsPositive({ message: "valid_from field should be a positive number" })
    @Expose()
    valid_from!: number;

    @IsPositive({ message: "valid_to field should be a positive number" })
    @Expose()
    valid_to!: number;

    //TODO do locks exist, is string array, is not empty
    @Expose()
    locks!: string[];
}

export class QRAccessDTO extends QRAccessReqDTO implements IQRAccess{
    @Expose()
    @IsNotEmpty({ message: "Artist's name required" })
    id!: string;

    @IsNotEmpty({ message: "Artist's name required" })
    @IsString({ message: "Artist's name should be string" })
    @Expose()
    author!: string; //TODO is author exist   
}

