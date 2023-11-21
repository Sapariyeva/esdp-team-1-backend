import App from './app';
import { QRRoute } from './routes/QR.route';
import { AuthRoute } from './routes/auth.route';
import cors from 'cors';
import { envConfig } from './env';

const app = new App({
  port: envConfig.port,
  middlewares: [cors()],
  controllers: [ new AuthRoute(), new QRRoute()],
});

app.listen();
