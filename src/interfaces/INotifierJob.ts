import { ENotification } from '@/entities/Notification.entity';
import schedule from 'node-schedule'; 


export interface INotifierJob {
    notification: ENotification;
    job: schedule.Job
}