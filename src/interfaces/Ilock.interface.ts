import { EBarrierType } from "@/types/barriers";

export interface ILock {
  id: string;
  buildingId?: string;
  name?: string;
  type: EBarrierType;
  isActive?: boolean;
}
