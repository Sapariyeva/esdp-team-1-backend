import { AuthService } from "@/services/auth.service"
import { NotificationService } from "@/services/notifications.service"
import { Socket } from "socket.io"
import { app as runningApp } from "@/index";

export class WSNotificationsService {
    private authService: AuthService
    private notificationService: NotificationService
    private maxToSendOnConnect:number = 100

    constructor() {
        this.authService = new AuthService()
        this.notificationService = new NotificationService()
    }

    private onDisconnect = (io: Socket) => {
        runningApp.sessions = runningApp.sessions.filter(e => {
            return e.socket.id !== io.id
        })
    }

    public async notificationsOnConnect(io: Socket): Promise<string | undefined> {
        const userUUID = io.handshake.auth.user ? io.handshake.auth.user : io.handshake.headers.user as string
        const onDisconnect = this.onDisconnect
        if (!userUUID || !(await this.authService.getUserById(userUUID))) {
            io.send('Unauthrized socket connection')
            io.disconnect(true)
            return
        }
        else {
            let extractedNotifications = await this.notificationService.getNewNotifications(userUUID, Date.now())
            if (extractedNotifications.length>this.maxToSendOnConnect){
                extractedNotifications=extractedNotifications.slice(0, this.maxToSendOnConnect)
            }
            const notificationsToSend = extractedNotifications.map((e) => {
                return {
                    type: e.type,
                    triggeredAt: e.trigger_at,
                    message: e.message
                }
            })
            io.emit('notifications', notificationsToSend)
            await this.notificationService.setSentStatus(extractedNotifications.map((e) => {return e.id}), true)
            runningApp.sessions.push(
                {
                    user: userUUID,
                    socket: io
                }
            )
            io.on('disconnect', function () {
                onDisconnect(io)
            })
            return userUUID
        }
    }
}



