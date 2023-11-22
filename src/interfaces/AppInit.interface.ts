import { IRoute } from './IRoute.interface';
import { RequestHandler } from 'express';

export interface AppInit {
  port: number;
  middlewares: RequestHandler[];
  controllers: IRoute[];
}
