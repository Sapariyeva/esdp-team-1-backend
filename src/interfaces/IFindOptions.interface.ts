import { ERole } from "@/types/roles";

export interface IQrFindOptions {
  author?: string;
  phone?: string;
  lock?: string;
  locks?: string[];
  valid_from?: number;
  valid_to?: number;
  only_active?: string;
  only_expired?: string;
  allowedUsers?:string[]
  offset?: number;
}

export interface IUserFindOptions {
  phone?: string;
  username?: string;
  role?: ERole;
  organizationId?: string;
  buildingId?: string;
  tenantId?: string;
  offset?: number;
  only_active?: string;
  only_blocked?: string;
}