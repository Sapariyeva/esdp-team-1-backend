import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';
import { IUser } from '../interfaces/IUser';
import { ERole } from '@/types/roles';


@Entity()
export class Euser implements IUser {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column({ nullable: false })
  username!: string;

  @Column({ nullable: true })
  pass!: string;

  @Column({ nullable: true, type: 'text' })
  token?: string;

  @Column({ nullable: false, type: 'text' })
  role!: ERole

  @Column({ nullable: false })
  canCreateQR!: boolean
}




