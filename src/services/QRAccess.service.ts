import { QRAccessDTO } from "@/DTO/QRAccess.DTO";
import { envConfig } from "@/env";
import { IQrFindOptions } from "@/interfaces/IFindOptions.interface";
import { IUser } from "@/interfaces/IUser";
import { QRAccessRepository } from "@/repositories/QRAccess.repository";
import { LockRepository } from "@/repositories/locks.repository";
import { ERole } from "@/types/roles";
import axios, { AxiosInstance } from "axios";

export class QRAccessService {
  private QRAccessRepo: QRAccessRepository = new QRAccessRepository()
  private lockRepo: LockRepository = new LockRepository()
  private qrAxios: AxiosInstance = axios.create({baseURL: envConfig.qrBaseUrl})
  private postPath = 'generate'

  constructor() {
  }

  async createQRAccessEntry(access: QRAccessDTO) {
    const newAccess = await this.QRAccessRepo.saveQRAccess(access);

    try {
      const response = await this.qrAxios.post(this.postPath, newAccess);

      if (!response.data.success) {
        await this.QRAccessRepo.delQRAccessById(newAccess.id);
      }

      if (response.status === 200 && response.data.success) {
        access.link = response.data.link;
        await this.QRAccessRepo.updateQRAccess(newAccess.id, access);
        return response.data;
      } else {
        await this.QRAccessRepo.delQRAccessById(newAccess.id);
      }
    } catch (error) {
      console.error('Error creating QR:', error);
      await this.QRAccessRepo.delQRAccessById(newAccess.id);
      throw new Error('Failed to create QR. Error during QR service request.');
    }
  }

  async getQrEntries(user: IUser, findOptions?: IQrFindOptions) {
    if (findOptions) {
      return await this.QRAccessRepo.getQrEntries(findOptions);
    } else {
      const options: IQrFindOptions = {}
      switch (user.role) {
        case ERole.umanuAdmin:
          return await this.QRAccessRepo.getAllQRAccess();
        case ERole.organizationAdmin:
          const orgLocks = await this.lockRepo.find({where: { b }})
      }
    }
  }
}