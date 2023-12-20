import { DataSource, DataSourceOptions } from 'typeorm';
import { Euser } from './entities/user.entity';
import { SeederOptions } from 'typeorm-extension';
import { parse as pathParse } from 'path';
import { envConfig } from './env';
import { EQRAccess } from './entities/QRAccess.entity';
import { MainSeeder } from './db/seeds/main.seeder';
import { UserFactory } from './db/factories/user.factory';
import { LocksFactory } from './db/factories/locks.factory';
import { QRAccessFactory } from './db/factories/QRAccess.factory';
import { ELock } from './entities/lock.entity';
import { ENotification } from './entities/Notification.entity';
import { EOrganization } from './entities/organization.entity';
import { EBuilding } from './entities/building.entity';
import { ETenant } from './entities/tenant.entity';

const dataSourceConfig: DataSourceOptions = {
  type: 'postgres',
  url: envConfig.dbUri,
  synchronize: true,
  logging: false,
  entities: [Euser, EQRAccess, ELock, ENotification, EOrganization, EBuilding, ETenant],
}

const mockDataSourceConfig: DataSourceOptions & SeederOptions = {
  type: 'postgres',
  url: envConfig.dbUri,
  synchronize: true,
  logging: false,
  entities: [Euser, EQRAccess, ELock, ENotification, EOrganization, EBuilding, ETenant],
  seeds: [MainSeeder],
  factories: [UserFactory, LocksFactory, QRAccessFactory]
}

export const appDataSource = pathParse(process.argv[1]).name == 'init.seeds' ? new DataSource(mockDataSourceConfig) : new DataSource(dataSourceConfig)