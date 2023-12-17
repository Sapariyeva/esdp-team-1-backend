import { IBuilding } from '@/interfaces/IBuilding.interface';
import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { EOrganization } from './organization.entity';

@Entity()
export class EBuilding implements IBuilding {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column()
  name!: string;

  @Column()
  address!: string;

  @Column({ type: 'boolean', default: true })
  isActive!: boolean;

  @ManyToOne(() => EOrganization)
  @JoinColumn({ name: 'organizationId' })
  organization!: EOrganization;

  @Column()
  organizationId!: string;
}