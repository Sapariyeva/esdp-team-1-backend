import { ERole } from "@/types/roles";

export interface IUser {
  id: string;
  phone: string;
  username: string;
  pass?: string;
  role: ERole;
  canCreateQR: Boolean;
  tenantId?: string
  buildingId?: string,
  organizationId?: string,
  locks: string[]
}

export interface ISignInRes extends IUser {
  accessToken: string;
}