import App from './app';
import { QRRoute } from './routes/QR.route';
import { AuthRoute } from './routes/auth.route';
import cors from 'cors';
import { envConfig } from './env';
import { LocksRoute } from './routes/locks.route';
import { OrganizationRoute } from './routes/organization.route';
import { BuildingRoute } from './routes/building.route';
import { TenantRoute } from './routes/tenant.route';
import { UserRoute } from './routes/user.route';
import { WeeklyScheduleRoute } from './routes/schedule.route';
import { WeeklyQRRoute } from './routes/weeklyQR.route';


export const app = new App({
  port: envConfig.port,
  middlewares: [cors()],
  controllers: [
    new AuthRoute(),
    new QRRoute(),
    new LocksRoute(),
    new OrganizationRoute(),
    new BuildingRoute(),
    new TenantRoute(),
    new UserRoute(),
    new WeeklyScheduleRoute(),
    new WeeklyQRRoute()
  ]
});

app.listen();










