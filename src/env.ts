import dotenv from 'dotenv';
import * as process from 'process';

dotenv.config();

interface IEnv {
  port: number;
  dbUri: string;
  secretHTTP: string;
  secretPrivate: string
};

export const envConfig: IEnv = {
  port: parseInt(process.env.PORT!),
  dbUri: process.env.DB_STRING!,
  secretHTTP: process.env.SECRET_HTTP!,
  secretPrivate: process.env.SECRET_PRIVATE!
};