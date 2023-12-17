import express from 'express';
import { Application, RequestHandler } from 'express';
import { AppInit } from './interfaces/AppInit.interface';
import { IRoute } from './interfaces/IRoute.interface';
import { errorHandler } from "./middleware/errorHandler.middleware";
import { appDataSource } from './dbConfig'
import { Server } from 'socket.io';
import { WSNotificationsService } from './ws/ws.services';
import { ISession } from './interfaces/ISocketSession.interface';
import { INotifierJob } from './interfaces/INotifierJob.interface';
import { scheduleJob } from 'node-schedule';
import { NOTIFICATIONS_SCHEDULING_INTERVAL } from './constants';
import { WSNotificationsScheduler } from './ws/notificationsScheduling.service';


class App {
  public app: Application;
  public port: number;
  public sessions: ISession[] = []
  public notifierJobs: INotifierJob[]= []
  public ioServer: Server | undefined
  public notificationsService: WSNotificationsService
  public notificationsScheduler: WSNotificationsScheduler
  constructor(appInit: AppInit) {
    this.notificationsService = new WSNotificationsService
    this.notificationsScheduler = new WSNotificationsScheduler()
    this.app = express();
    this.port = appInit.port;
    this.initMiddlewares(appInit.middlewares);
    this.initAssets();
    this.initRoutes(appInit.controllers);
    this.initErrorHandlers();
  }
  private initRoutes(routes: IRoute[]) {
    routes.forEach((route) => {
      this.app.use(route.path, route.router);
    });
    this.app.use(express.urlencoded({ extended: true }));
  }

  private initMiddlewares(middlewares: RequestHandler[]) {
    middlewares.forEach((middleware) => {
      this.app.use(middleware);
    });
  }

  private initAssets() {
    this.app.use(express.json());
    this.app.use(express.static('./public'))
  }
  private initErrorHandlers = () => {
    this.app.use('*', (req, res) => {
      res.status(404).send({
        success: false,
        message: 'Resource not found',
      });
    });
    this.app.use(errorHandler());
  };
  public async listen() {
    await appDataSource.initialize()
    const http = this.app.listen(this.port, () => {
      console.log(`App listening  on the http://localhost:${this.port}`);
    });
    process.on("exit", () => {
      appDataSource.destroy();
    })
    this.ioServer = require('socket.io')(http, 
      {
      cors: {
        origin: "*",
      }
    });
    if (this.ioServer) {
      this.ioServer.on('connection', (io) => {
        this.notificationsService.notificationsOnConnect(io)
      })
    }
    await this.notificationsScheduler.scheduleNotifications()
    scheduleJob('regularNotificationsScheduler', `*/${NOTIFICATIONS_SCHEDULING_INTERVAL} * * * *`, async ()=>{
      await this.notificationsScheduler.scheduleNotifications()
    })
  }
}

export default App;
