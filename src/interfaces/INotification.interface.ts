import { ENotificationTypes } from "@/types/notifocations";

export interface INotification {
    id?: string;
    type: ENotificationTypes;
    author: string;
    accessEntry: string;
    trigger_at: number;
    message: string;
    sent:boolean;
}

export interface INotificationToSendWS {
    type: ENotificationTypes,
    triggeredAt: number,
    message: string,
}

