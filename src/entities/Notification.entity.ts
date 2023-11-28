import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Euser } from "./user.entity";
import { INotification } from "@/interfaces/INotification.interface";
import { ENotificationTypes } from '@/types/notifocations';
import { EQRAccess } from './QRAccess.entity';

@Entity()
export class ENotification implements INotification {
    @PrimaryGeneratedColumn("uuid")
    id!: string;

    @Column({ nullable: false })
    author!: string;

    @Column({ nullable: false })
    accessEntry!: string;

    @Column({ nullable: false})
    type!: ENotificationTypes

    @Column({type:'bigint', nullable: false})
    trigger_at!: number

    @Column({nullable: false})
    sent!: boolean;

    @Column("text")
    message!: string;

    @ManyToOne(() => Euser)
    @JoinColumn({ name: 'author' })
    user!: Euser;

    @ManyToOne(() => EQRAccess, {onDelete: 'CASCADE'})
    @JoinColumn({ name: 'accessEntry' })
    QRAccessEntry!: EQRAccess;
}
