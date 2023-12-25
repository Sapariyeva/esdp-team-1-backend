import { Entity, Column, PrimaryGeneratedColumn, Unique, ManyToOne, JoinColumn } from 'typeorm';
import { IUser } from '../interfaces/IUser';
import { ERole } from '@/types/roles';
import bcrypt from 'bcrypt';
import { SALT_WORK_FACTOR } from '@/constants';
import * as jwt from 'jsonwebtoken';
import { envConfig } from '@/env';
import { EBuilding } from './building.entity';
import { EOrganization } from './organization.entity';
import { ETenant } from './tenant.entity';

@Entity("users")
@Unique(["phone"])
export class Euser implements IUser {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column()
  phone!: string;

  @Column({ nullable: false })
  username!: string;

  @Column({ nullable: true })
  pass!: string;

  @Column({ nullable: false, type: "text" })
  role!: ERole;

  @Column({ nullable: false })
  canCreateQR!: boolean;

  @Column({ nullable: true })
  buildingId?: string;

  @Column({ nullable: true })
  organizationId?: string;

  @Column({ nullable: true })
  tenantId?: string;

  @Column({ type: "varchar", nullable: true, length: 100, array: true })
  locks!: string[];

  @ManyToOne(() => EBuilding)
  @JoinColumn({ name: "buildingId" })
  building?: EBuilding;

  @ManyToOne(() => EOrganization)
  @JoinColumn({ name: "organizationId" })
  organization?: EOrganization;

  @ManyToOne(() => ETenant)
  @JoinColumn({ name: "tenantId" })
  tenant?: ETenant;

  async hashPass(): Promise<void> {
    const salt = await bcrypt.genSalt(SALT_WORK_FACTOR);
    this.pass = await bcrypt.hash(this.pass, salt);
  }

  async comparePassword(password: string): Promise<boolean> {
    return await bcrypt.compare(password, this.pass);
  }

  signAccessToken(): string {
    return jwt.sign({ sub: this.id }, envConfig.secretPrivate, {
      expiresIn: `${envConfig.accessTokenTTL}s`,
    });
  }

  signRefreshToken(): string {
    return jwt.sign({ sub: this.id }, envConfig.secretPrivate, {
      expiresIn: `${envConfig.refreshTOkenTTL}s`,
    });
  }
}




