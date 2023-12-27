import dotenv from 'dotenv';
import * as process from 'process';

dotenv.config();

interface IEnv {
  port: number;
  dbUri: string;
  secretHTTP: string;
  secretPrivate: string;
  qrBaseUrl: string;
  accessTokenTTL: number;
  refreshTOkenTTL: number;
};

export const envConfig: IEnv = {
  port: parseInt(process.env.PORT!),
  dbUri: process.env.DB_STRING!,
  secretHTTP: process.env.SECRET_HTTP!,
  secretPrivate: process.env.SECRET_PRIVATE!,
  qrBaseUrl: process.env.QR_URL!,
  accessTokenTTL: parseInt(process.env.ACCESS_TOKEN_TTL!),
  refreshTOkenTTL: parseInt(process.env.REFRESH_TOKEN_TTL!)
};