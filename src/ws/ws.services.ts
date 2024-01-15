import { envConfig } from "@/env";
import { app as runningApp } from "@/index";
import { INotificationToSendWS } from "@/interfaces/INotification.interface";
import { ITokenPayload } from "@/interfaces/ITokenPayload.interface";
import { NotificationService } from "@/services/notifications.service";
import { UserService } from "@/services/user.service";
import * as jwt from "jsonwebtoken";
import { Socket } from "socket.io";

export class WSNotificationsService {
  private userService: UserService;
  private notificationService: NotificationService;
  private maxToSendOnConnect: number = 100;

  constructor() {
    this.userService = new UserService();
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
      const user = await this.userService.getUserById(decoded.sub);
      const userUUID = user?.id;
      if (!userUUID || !(await this.userService.getUserById(userUUID))) {
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
