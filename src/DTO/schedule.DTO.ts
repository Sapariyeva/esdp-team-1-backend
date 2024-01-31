import { IWeeklySchedule, IWeeklyScheduleElement } from "@/interfaces/ISchedule.interface";
import { Expose } from "class-transformer";
import { IsArray, IsNotEmpty, IsOptional, IsString } from "class-validator";
import { IsUserExist } from "./validators/usersValidators";
import { ArraySize } from "./validators/generalValidators";
import { IsWeeklyScheduleElement, IsWeeklyScheduleNameUnique } from "./validators/scheduleValidators";

export class WeeklyScheduleDTO implements IWeeklySchedule{
  @IsOptional()
  @Expose()
  id!: string;

  @IsWeeklyScheduleNameUnique({ message: "Schedule with this name already exists" }) 
  @IsNotEmpty({ message: 'Name of the schedule should be specified' })
  @IsString({ message: 'Name of the schedule should be of string type' })
  @Expose()
  name!: string;

  @IsNotEmpty({ message: "Id of the authorizing user is required!" })
  @IsUserExist({message: "The user authorizing the access is not registered!"})
  @Expose()
  author!: string; 

  @Expose()
  @IsArray({ message: "schedule field must contain an array of day working intervals" })
  @ArraySize(7, ({ message: "Invalid schedule array size" }))
  @IsWeeklyScheduleElement({each: true, message: "Schedule for some of the days has invalid format"})
  schedule!: IWeeklyScheduleElement[];
}