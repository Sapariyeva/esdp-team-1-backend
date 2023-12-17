import { ITenant } from '@/interfaces/ITenant.interface';
import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { EBuilding } from './building.entity';

@Entity()
export class ETenant implements ITenant {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @ManyToOne(() => EBuilding)
  @JoinColumn({ name: 'buildingId' })
  building!: EBuilding;

  @Column()
  buildingId!: string;

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