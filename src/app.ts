import express from 'express';
import { Application, RequestHandler } from 'express';
import { AppInit } from './interfaces/AppInit.interface';
import { IRoute } from './interfaces/IRoute.interface';
import { errorHandler } from "./middleware/errorHandler";
import { appDataSource } from './dbConfig'


class App {
  public app: Application;
  public port: number;
  constructor(appInit: AppInit) {
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
    this.app.listen(this.port, () => {
      console.log(`App listening  on the http://localhost:${this.port}`);
    });
    process.on("exit", () => {  
      appDataSource.destroy();
    })
  }
}

export default App;
