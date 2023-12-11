import { ERole } from "@/types/roles";

export interface IUser {
  id: string;
  phone: string;
  username: string;
  pass?: string;
  role: ERole;
  canCreateQR: Boolean;
}

export interface ISignInRes extends IUser {
  accessToken: string;
}