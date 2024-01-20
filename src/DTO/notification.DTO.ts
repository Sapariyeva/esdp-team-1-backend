import { Expose } from "class-transformer"
import { IsNotEmpty, IsString, IsPositive, IsOptional, IsBoolean } from 'class-validator'
import { INotification } from "@/interfaces/INotification.interface";
import { ENotificationTypes } from "@/types/notifocations";
import { IsUserExist } from "./validators/usersValidators";
import { IsAccessEntryExist, IsNotificationTypeValid } from "./validators/notificationsValidators";

export class NotificationDTO implements INotification{
    @IsOptional()
    @Expose()
    id!: string;

    @IsNotEmpty({ message: "Id of the authorizing user is required!" })
    @IsUserExist({message: "The user authorizing the access is not registered!"})
    @Expose()
    author!: string; 

    @IsNotificationTypeValid({message: "Invalid type of notification has been specified"})
    @Expose()
    type!: ENotificationTypes; 

    @IsNotEmpty({ message: "Id of the access entry required!" })
    @IsAccessEntryExist({message: "The specified access entry is not registered!"})
    @Expose()
    accessEntry!: string;

    @IsNotEmpty({ message: "Notification message required!" })
    @IsString({ message: "Notification message should be string" })
    @Expose()
    message!: string;

    @IsPositive({ message: "timestamp to trigger at should be a positive number" })
    @Expose()
    trigger_at!: number;

    @Expose()
    @IsBoolean({message: 'sent status should be boolean'})
    sent!: boolean;

}



