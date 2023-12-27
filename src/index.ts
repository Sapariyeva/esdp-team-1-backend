import App from './app';
import { QRRoute } from './routes/QR.route';
import { AuthRoute } from './routes/auth.route';
import cors from 'cors';
import { envConfig } from './env';
import { LocksRoute } from './routes/locks.route';
import { OrganizationRoute } from './routes/organization.route';
import { BuildingRoute } from './routes/building.route';
import { TenantRoute } from './routes/tenant.route';


export const app = new App({
  port: envConfig.port,
  middlewares: [cors()],
  controllers: [ new AuthRoute(), new QRRoute(), new LocksRoute, new OrganizationRoute (), new BuildingRoute (), new TenantRoute ()],
});

app.listen();





