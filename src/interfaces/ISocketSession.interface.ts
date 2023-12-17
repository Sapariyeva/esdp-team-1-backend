import { Socket } from "socket.io";

export interface ISession {
    user: string,
    socket: Socket
  }