import { DataSource, DataSourceOptions } from 'typeorm';
import { Euser } from './entities/user.entity';
import { SeederOptions } from 'typeorm-extension';
import { parse as pathParse } from 'path';
import { envConfig } from './env';
import { EQRAccess, EweeklyQRAccess } from './entities/QRAccess.entity';
import { MainSeeder } from './db/seeds/main.seeder';
import { UserFactory } from './db/factories/user.factory';
import { LocksFactory } from './db/factories/locks.factory';
import { QRAccessFactory } from './db/factories/QRAccess.factory';
import { ELock } from './entities/lock.entity';
import { ENotification } from './entities/Notification.entity';
import { EOrganization } from './entities/organization.entity';
import { EBuilding } from './entities/building.entity';
import { ETenant } from './entities/tenant.entity';
import { TenantsFactory } from './db/factories/Tenants.factory';
import { BuildingsFactory } from './db/factories/Buildings.factory';
import { OrganizationsFactory } from './db/factories/organizations.factory';
import { EweeklySchedule } from './entities/schedule.entity';

const dataSourceConfig: DataSourceOptions = {
  type: 'postgres',
  url: envConfig.dbUri,
  synchronize: true,
  logging: false,
  entities: [Euser, EQRAccess, EweeklyQRAccess, ELock, ENotification, EOrganization, EBuilding, ETenant, EweeklySchedule],
}

const mockDataSourceConfig: DataSourceOptions & SeederOptions = {
  type: 'postgres',
  url: envConfig.dbUri,
  synchronize: true,
  logging: false,
  entities: [Euser, EQRAccess, EweeklyQRAccess, ELock, ENotification, EOrganization, EBuilding, ETenant, EweeklySchedule],
  seeds: [MainSeeder],
  factories: [OrganizationsFactory, BuildingsFactory, TenantsFactory, UserFactory, LocksFactory, QRAccessFactory]
}

export const appDataSource = pathParse(process.argv[1]).name == 'init.seeds' ? new DataSource(mockDataSourceConfig) : new DataSource(dataSourceConfig)