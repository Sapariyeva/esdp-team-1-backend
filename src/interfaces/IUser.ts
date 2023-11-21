import { ERole } from "@/types/roles";

export interface IUser {
    id: string;
    username: string;
    pass: string;
    token?: string;
    role: ERole
    canCreateQR: Boolean
  }