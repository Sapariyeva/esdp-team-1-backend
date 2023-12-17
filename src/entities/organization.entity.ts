import { IOrganization } from '@/interfaces/IOrganization.interface';
import { Column, Entity, PrimaryGeneratedColumn, Unique } from 'typeorm';

@Entity()
@Unique(['name'])
export class EOrganization implements IOrganization {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column()
  name!: string;

  @Column({ nullable: true })
  legalAddress!: string;

  @Column({ nullable: true })
  phone!: string;

  @Column({ nullable: true })
  email!: string;

  @Column({ type: 'boolean', default: true })
  isActive!: boolean;
}