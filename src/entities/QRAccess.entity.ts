import { IQRAccess } from "@/interfaces/IQRAccess.interface";
import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Euser } from "./user.entity";

@Entity()
export class EQRAccess implements IQRAccess {
    @PrimaryGeneratedColumn("uuid")
    id!: string;

    @Column({ nullable: false })
    author!: string;

    @Column({ nullable: false})
    phone!: string

    @Column({type:'bigint', nullable: false})
    valid_from!: number

    @Column({type:'bigint', nullable: false})
    valid_to!: number

    @Column("varchar", {length:100, array: true })
    locks!: string[];

    @ManyToOne(() => Euser)
    @JoinColumn({ name: 'author' })
    user!: Euser;
}
