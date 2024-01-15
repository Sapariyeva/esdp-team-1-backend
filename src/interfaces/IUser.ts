import { ERole } from "@/types/roles";

export interface IUser {
  id: string;
  phone: string;
  username: string;
  pass?: string;
  role: ERole;
  canCreateQR: Boolean;
  tenantId?: string;
  buildingId?: string;
  organizationId?: string;
  locks: string[];
  isActive: boolean;
}

export interface ISignInRes extends IUser {
  accessToken: string;
  refreshToken: string;
}

export interface IRefreshRes {
  accessToken: string;
}