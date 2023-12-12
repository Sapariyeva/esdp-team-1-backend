import App from './app';
import { QRRoute } from './routes/QR.route';
import { AuthRoute } from './routes/auth.route';
import cors from 'cors';
import { envConfig } from './env';
import { LocksRoute } from './routes/locks.route';
import schedule from 'node-schedule';


export const app = new App({
  port: envConfig.port,
  middlewares: [cors()],
  controllers: [ new AuthRoute(), new QRRoute(), new LocksRoute],
});


app.listen();


const date = new Date(Date.now()+10*1000);

const myJob = schedule.scheduleJob('JOBNAME', date, function(){
  console.log('The world is going to end today.');
});

console.log(myJob.name)





