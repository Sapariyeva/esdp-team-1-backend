import { QRAccessDTO } from "@/DTO/QRAccess.DTO";
import { envConfig } from "@/env";
import { QRAccessRepository } from "@/repositories/QRAccess.repository";
import axios, { AxiosInstance } from "axios";

export class QRAccessService {
  private QRAccessRepo: QRAccessRepository = new QRAccessRepository()
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
}