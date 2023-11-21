import { QRAccessDTO } from "@/DTO/QRAccess.DTO";
import { IQRAccess } from "@/interfaces/IQRAccess.interface";
import { QRAccessRepository } from "@/repositories/QRAccess.repository";

export class QRAccessService {
    private QRAcessRepo: QRAccessRepository = new QRAccessRepository()
  
    constructor() { }
  
    createQRAccessEntry = async (data: QRAccessDTO): Promise<IQRAccess> => {
        // TODO REQUEST link, add link to DTO
      return await this.QRAcessRepo.saveQRAccess(data)
    };
  

  
    // validateToken = async (data:string) => {
    //   const result = await this.userRepo.validateRequest(data)
    //   return result
    // }
  
    // logoutUser = async (data:string) => {
    //   const result = await this.userRepo.logoutUser(data)
    //   return result
    // }
  }