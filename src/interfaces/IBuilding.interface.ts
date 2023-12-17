import { IOrganization } from "./IOrganization.interface";

export interface IBuilding {
  id: string;
  organizationId: string;
  organization?: IOrganization;
  name: string;
  address: string;
  isActive: boolean;
}
