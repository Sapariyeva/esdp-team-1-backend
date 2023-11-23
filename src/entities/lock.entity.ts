import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';
import { ILock } from '@/interfaces/Ilock.interface';
import { EBarrierType } from '@/types/barriers';


@Entity()
export class ELock implements ILock {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column({ nullable: true })
  name?: string;

  @Column({ nullable: false })
  type!: EBarrierType;
}