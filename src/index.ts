import App from './app';
import { QRRoute } from './routes/QR.route';
import { AuthRoute } from './routes/auth.route';
import cors from 'cors';
import { envConfig } from './env';
import { LocksRoute } from './routes/locks.route';

const app = new App({
  port: envConfig.port,
  middlewares: [cors()],
  controllers: [ new AuthRoute(), new QRRoute(), new LocksRoute],
});

app.listen();
