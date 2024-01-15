import { ERole } from "@/types/roles";

export interface IQrFindOptions {
  author?: string;
  phone?: string;
  lock?: string;
  locks?: string[];
  date_from?: number;
  date_to?: number;
  only_active?: string;
  only_expired?: string;
  offset?: number;
}

export interface IUserFindOptions {
  phone?: string;
  username?: string;
  role?: ERole;
  organizationId?: string;
  buildingId?: string;
  tenantId?: string;
  organizations?: string[];
  buildings?: string[];
  tenants?: string[];
  offset?: number;
}