import { EBarrierType } from "@/types/barriers";

export interface ILock {
    id: string
    name?: string
    type: EBarrierType
  }