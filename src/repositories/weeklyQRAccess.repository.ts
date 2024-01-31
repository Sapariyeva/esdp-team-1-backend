import { weeklyQRAccessDTO } from "@/DTO/QRAccess.DTO";
import { FIRST_NOTIFICATION_TIME, SECOND_NOTIFICATION_TIME } from "@/constants";
import { appDataSource } from "@/dbConfig";
import { EweeklyQRAccess } from "@/entities/QRAccess.entity";
import { IQrFindOptions } from "@/interfaces/IFindOptions.interface";
import { createQrFindOptions } from "@/utils/findOptionsBuilders/findQrOptionsCreator";
import { Repository } from "typeorm";
import { NotificationsRepository } from "./notifications.repository";
import { ErrorWithStatus } from "@/interfaces/customErrors";

export class WeeklyQRAccessRepository extends Repository<EweeklyQRAccess> {
  notificationRepo: NotificationsRepository = new NotificationsRepository();
  constructor() {
    super(EweeklyQRAccess, appDataSource.createEntityManager());
  }

  async saveQRAccess(access: weeklyQRAccessDTO): Promise<EweeklyQRAccess> {
    const newRecord = this.create(access);
    return await this.save(newRecord);
  }

  async getQRAccessById(id: string): Promise<EweeklyQRAccess | undefined> {
    const extractedAccess = await this.findOne({ where: { id } });
    if (extractedAccess) {
      return extractedAccess;
    } else {
      return;
    }
  }

  async getAllQRAccess() {
    return await this.find();
  }

  async getQrEntries(queryOptions: IQrFindOptions): Promise<EweeklyQRAccess[]> {
    const findOptions = createQrFindOptions(queryOptions);
    const { locks } = queryOptions;
    const unfilteredResult = await this.find(findOptions);
    if (locks && locks.length > 0) {
      return await this.filterQueryByLockIds(locks, unfilteredResult);
    } else {
      return unfilteredResult
    }
  }

  async updateQRAccess(id: string, access: weeklyQRAccessDTO) {
    try {
      await this.update(id, access);
      const updateAccess = { ...access, id };
      await this.notificationRepo.saveNotification(
        this.notificationRepo.makeExpirationNotification(
          updateAccess,
          FIRST_NOTIFICATION_TIME * 60 * 1000
        )
      );
      await this.notificationRepo.saveNotification(
        this.notificationRepo.makeExpirationNotification(
          updateAccess,
          SECOND_NOTIFICATION_TIME * 60 * 1000
        )
      );
      return updateAccess
    }
    catch (e) {
      console.log(e)
      throw new ErrorWithStatus('Error while generating notifications', 500)

    }
  }

  async delQRAccessById(id: string): Promise<Boolean> {
    const existingAccess = await this.findOne({
      where: { id }, order: {
        valid_to: "ASC"
      }
    });
    if (!existingAccess) {
      return false;
    }
    await this.delete(id);
    return true;
  }

  async filterQueryByLockIds(
    locks: string[],
    rawResult: EweeklyQRAccess[]
  ): Promise<EweeklyQRAccess[]> {
    const filteredResult = await this.createQueryBuilder("eqr_access")
      .where(
        'EXISTS(SELECT 1 FROM unnest("eqr_access"."locks") AS lock WHERE lock IN (:...lockIds))',
        { lockIds: locks },
      )
      .getMany();
    const finalResults = rawResult.filter((result) =>
      filteredResult.some((res) => res.id === result.id)
    );
    return finalResults;
  }
}
