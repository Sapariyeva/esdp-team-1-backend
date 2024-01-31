import { IWeeklySchedule, IWeeklyScheduleElement } from "@/interfaces/ISchedule.interface";
import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Euser } from "./user.entity";

@Entity()
export class EweeklySchedule implements IWeeklySchedule {
    @PrimaryGeneratedColumn("uuid")
    id!: string;

    @Column({ nullable: false })
    author!: string;

    @Column({ nullable: false })
    name!: string;

    @Column({type:'jsonb'})
    schedule!: IWeeklyScheduleElement[];

    @ManyToOne(() => Euser)
    @JoinColumn({ name: 'author' })
    user!: Euser;
}