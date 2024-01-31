import { IQRAccess, IWeeklyQRAccess } from "@/interfaces/IQRAccess.interface";
import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Euser } from "./user.entity";
import { EweeklySchedule } from "./schedule.entity";

@Entity()
export class EQRAccess implements IQRAccess {
    @PrimaryGeneratedColumn("uuid")
    id!: string;

    @Column({ nullable: false})
    author!: string;

    @Column({ nullable: false})
    phone!: string

    @Column({type:'bigint', nullable: false})
    valid_from!: number

    @Column({type:'bigint', nullable: false})
    valid_to!: number

    @Column({type: "varchar", length:100, array: true})
    locks!: string[];

    @Column({type: "text", nullable: true} )
    link!: string;

    @ManyToOne(() => Euser)
    @JoinColumn({ name: 'author' })
    user!: Euser;
}

@Entity()
export class EweeklyQRAccess extends EQRAccess implements IWeeklyQRAccess {
    @Column({type: "text", nullable: true} )
    scheduleId!: string;

    @ManyToOne(() => EweeklySchedule)
    @JoinColumn({ name: 'scheduleId' })
    schedule!: EweeklySchedule;

}
