import { QRAccessDTO } from "@/DTO/QRAccess.DTO";
import { envConfig } from "@/env";
import { IQrFindOptions } from "@/interfaces/IFindOptions.interface";
import { IUser } from "@/interfaces/IUser";
import { QRAccessRepository } from "@/repositories/QRAccess.repository";
import { LockRepository } from "@/repositories/locks.repository";
import { TenantRepository } from "@/repositories/tenant.repository";
import { UserRepository } from "@/repositories/user.repository";
import { ERole } from "@/types/roles";
import axios, { AxiosInstance } from "axios";

export class QRAccessService {
  private QRAccessRepo: QRAccessRepository = new QRAccessRepository()
  private lockRepo: LockRepository = new LockRepository()
  private tenantRepo: TenantRepository = new TenantRepository()
  private userRepo: UserRepository = new UserRepository()
  private qrAxios: AxiosInstance = axios.create({ baseURL: envConfig.qrBaseUrl })
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
    if (findOptions && findOptions.locks) {
      if (user.role === ERole.user) {
        findOptions.author = user.id;
        findOptions.allowedUsers = [user.id]
      }
      return await this.QRAccessRepo.getQrEntries(findOptions);
    } else {
      const options: IQrFindOptions = {};
      let allowedUsers: IUser[] = []
      switch (user.role) {
        case ERole.umanuAdmin:
          const allLocks = await this.lockRepo.getAllLocks();
          const allIds = allLocks.map(l => l.id);
          findOptions ? findOptions.locks = allIds : options.locks = allIds;
          break;
        case ERole.organizationAdmin:
          const orgLocks = await this.lockRepo.getLocksByOrganization(user.organizationId!);
          const orgLocksIds = orgLocks.map(l => l.id);
          findOptions ? findOptions.locks = orgLocksIds : options.locks = orgLocksIds;
          allowedUsers = await this.userRepo.getUsersQuery({ organizationId: user.organizationId })

          break;
        case ERole.buildingAdmin:
          const buildLocks = await this.lockRepo.find({ where: { buildingId: user.buildingId } });
          const buildLocksIds = buildLocks.map(l => l.id);
          findOptions ? findOptions.locks = buildLocksIds : options.locks = buildLocksIds;
          allowedUsers = await this.userRepo.getUsersQuery({ buildingId: user.buildingId })
          break;
        case ERole.tenantAdmin:
          const tenant = await this.tenantRepo.findOne({ where: { id: user.tenantId } });
          findOptions ? findOptions.locks = tenant?.locks : options.locks = tenant?.locks;
          allowedUsers = await this.userRepo.getUsersQuery({ tenantId: user.tenantId })
          break;
        case ERole.user:
          findOptions ? findOptions.author = user.id : options.author = user.id;
          findOptions ? findOptions.locks = user?.locks : options.locks = user?.locks;
          allowedUsers = [user]
          break;
      }
      const allowedUsersIds = allowedUsers.map((u) => { return u.id })
      if (user.role !== ERole.umanuAdmin) {
        findOptions ? findOptions.allowedUsers = allowedUsersIds : options.allowedUsers = allowedUsersIds
      }

      const result = findOptions
        ? await this.QRAccessRepo.getQrEntries(findOptions)
        : await this.QRAccessRepo.getQrEntries(options);
      return result
    }
  }
}