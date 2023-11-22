import { DataSource, DataSourceOptions } from 'typeorm';
import { Euser } from './entities/user.entity';
import { SeederOptions } from 'typeorm-extension';
import { parse as pathParse} from 'path';
import { envConfig } from './env';
import { EQRAccess } from './entities/QRAccess.entity';

const dataSourceConfig: DataSourceOptions = {
  type: 'postgres',
  url: envConfig.dbUri,
  synchronize: true,
  logging: false,
  entities: [Euser, EQRAccess],
}

const mockDataSourceConfig: DataSourceOptions & SeederOptions = {
  type: 'postgres',
  url: envConfig.dbUri,
  synchronize: true,
  logging: false,
  entities: [Euser, EQRAccess],
  seeds: [],
  factories: []
}

export const appDataSource = pathParse(process.argv[1]).name == 'init.seeds' ? new DataSource(mockDataSourceConfig) : new DataSource(dataSourceConfig)