import { AuthService } from "@/services/auth.service";
import { NotificationService } from "@/services/notifications.service";
import { Socket } from "socket.io";
import { app as runningApp } from "@/index";
import { INotificationToSendWS } from "@/interfaces/INotification.interface";
import * as jwt from "jsonwebtoken";
import { envConfig } from "@/env";
import { ITokenPayload } from "@/interfaces/ITokenPayload.interface";

export class WSNotificationsService {
  private authService: AuthService;
  private notificationService: NotificationService;
  private maxToSendOnConnect: number = 100;

  constructor() {
    this.authService = new AuthService();
    this.notificationService = new NotificationService();
  }

  private onDisconnect = (io: Socket) => {
    runningApp.sessions = runningApp.sessions.filter((e) => {
      return e.socket.id !== io.id;
    });
  };

  public async notificationsOnConnect(io: Socket): Promise<string | undefined> {
    const token = io.handshake.auth.token
      ? io.handshake.auth.token
      : (io.handshake.headers.token as string);
    try {
      const decoded = jwt.verify(token, envConfig.secretPrivate) as ITokenPayload;
      const user = await this.authService.getUserById(decoded.sub);
      const userUUID = user?.id;
      if (!userUUID || !(await this.authService.getUserById(userUUID))) {
        io.send("Unauthrized socket connection");
        io.disconnect(true);
        return;
      } else {
        let extractedNotifications =
          await this.notificationService.getNewNotifications(
            userUUID,
            Date.now()
          );
        if (extractedNotifications.length > this.maxToSendOnConnect) {
          extractedNotifications = extractedNotifications.slice(
            0,
            this.maxToSendOnConnect
          );
        }
        const scheduledNotifiactionsIds = runningApp.notifierJobs.map((j) => {
          return j.notification.id;
        });
        const notificationsToSend = extractedNotifications.map((e) => {
          if (scheduledNotifiactionsIds.includes(e.id)) {
            runningApp.notificationsScheduler.cancelJob(e);
          }
          const respNotification: INotificationToSendWS = {
            type: e.type,
            triggeredAt: e.trigger_at,
            message: e.message,
          };
          return respNotification;
        });
        io.emit("notifications", notificationsToSend);
        await this.notificationService.setSentStatus(
          extractedNotifications.map((e) => {
            return e.id;
          }),
          true
        );
        runningApp.sessions.push({
          user: userUUID,
          socket: io,
        });
        io.on("disconnect", () => {
          this.onDisconnect(io);
        });
        return userUUID;
      }
    }
    catch (e) {
      if (!token) {
        io.send("Unauthrized socket connection");
        io.disconnect(true);
      }
      else{
        console.error(e)
        io.send("Unknown socket error");
        io.disconnect(true);
      }
      return;
    }
  }
}
