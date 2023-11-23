import { QRAccessDTO } from "@/DTO/QRAccess.DTO";
import { envConfig } from "@/env";
import { IQRAccess } from "@/interfaces/IQRAccess.interface";
import { QRAccessRepository } from "@/repositories/QRAccess.repository";
import axios, { AxiosInstance } from "axios";

export class QRAccessService {
  private QRAcessRepo: QRAccessRepository = new QRAccessRepository()
  private qrAxios: AxiosInstance = axios.create({ baseURL: envConfig.qrBaseUrl })
  private postPath = 'generate'
  constructor() { }
  createQRAccessEntry = async (data: QRAccessDTO): Promise<IQRAccess> => {
    const response = await this.qrAxios.post(this.postPath, {
      phone: data.phone,
      locks: data.locks,
      valid_from: data.valid_from,
      valid_to: data.valid_to
    })
    if (response.status = 200 && response.data.success) {
      data.link = response.data.link
      return await this.QRAcessRepo.saveQRAccess(data)
    }
    else {
      throw new Error(`Failed to create QR. Status: ${response.status}. ${response.data.error()}`)
    }
  }
}