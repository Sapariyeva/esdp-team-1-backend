import { ILock } from "@/interfaces/Ilock.interface";
import { EBarrierType } from "@/types/barriers";
import { Expose } from "class-transformer";
import { IsOptional, IsString } from "class-validator";

export class lockDTO implements ILock {
    @Expose()
    id!: string;

    @IsOptional()
    @IsString({ message: 'Lock name should be string' })
    @Expose()
    name?: string;

    @Expose()
    type!: EBarrierType;
}