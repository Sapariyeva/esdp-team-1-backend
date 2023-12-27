import { IBuilding } from "./IBuilding.interface";

export interface ITenant {
  id: string;
  buildingId: string;
  building?: IBuilding;
  name: string;
  legalAddress?: string;
  phone?: string;
  email?: string;
  isActive: boolean;
  locks: string[]
}