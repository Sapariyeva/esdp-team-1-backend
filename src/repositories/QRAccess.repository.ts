import { QRAccessDTO } from "@/DTO/QRAccess.DTO";
import { FIRST_NOTIFICATION_TIME, SECOND_NOTIFICATION_TIME } from "@/constants";
import { appDataSource } from "@/dbConfig";
import { EQRAccess } from "@/entities/QRAccess.entity";
import { IQrFindOptions } from "@/interfaces/IFindOptions.interface";
import { IQRAccess } from "@/interfaces/IQRAccess.interface";
import { Between, FindManyOptions, LessThanOrEqual, MoreThanOrEqual, Repository } from "typeorm";
import { NotificationsRepository } from "./notifications.repository";

export class QRAccessRepository extends Repository<EQRAccess> {
  notificationRepo: NotificationsRepository = new NotificationsRepository();
  constructor() {
    super(EQRAccess, appDataSource.createEntityManager());
  }

  async saveQRAccess(access: QRAccessDTO): Promise<IQRAccess> {
    const newRecord = this.create(access);
    return await this.save(newRecord);
  }

  async getQRAccessById(id: string): Promise<QRAccessDTO | undefined> {
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

  async getQrEntries(query: IQrFindOptions): Promise<IQRAccess[]> {
    let findOptions: FindManyOptions<EQRAccess> = {
      order: { valid_from: "DESC" },
      take: 30,
    };
    const { author, phone, locks, date_from, date_to, only_active, only_expired, offset } = query;
    if (author) findOptions.where = {...findOptions.where, author};
    if (phone) findOptions.where = {...findOptions.where, phone};
    if (only_active === '') {
        findOptions.where = {...findOptions.where, valid_to: MoreThanOrEqual(new Date().getTime())};
    } else if (only_expired === '') {
        findOptions.where = {...findOptions.where, valid_to: LessThanOrEqual(new Date().getTime())};
    }
    if (date_from && date_to) {
        findOptions.where = {
          ...findOptions.where,
          valid_from: Between(date_from, date_to),
          valid_to: Between(date_from, date_to),
        };
      } else if (date_from && !date_to) {
        findOptions.where = { ...findOptions.where, valid_from: MoreThanOrEqual(date_from) };
      } else if (!date_from && date_to) {
        findOptions.where = { ...findOptions.where, valid_to: LessThanOrEqual(date_to) };
      }
    findOptions.skip = offset || 0;
    
    if (locks && locks.length > 0) {
      const rawResult = await this.find(findOptions);
      const filteredResult = await this.createQueryBuilder("eqr_access")
        .where(
          'EXISTS(SELECT 1 FROM unnest("eqr_access"."locks") AS lock WHERE lock IN (:...lockIds))',
          { lockIds: locks }
        )
        .getMany();
      const finalResults = rawResult.filter((result) =>
        filteredResult.some((res) => res.id === result.id)
      );
      return finalResults;
    }

    return await this.find(findOptions);
  }

  async updateQRAccess(id: string, access: QRAccessDTO) {
    await this.update(id, access);
    const updateAccess = { ...access, id };
    await this.notificationRepo.saveNotification(
      await this.notificationRepo.makeExpirationNotification(
        updateAccess,
        FIRST_NOTIFICATION_TIME * 60 * 1000
      )
    );
    await this.notificationRepo.saveNotification(
      await this.notificationRepo.makeExpirationNotification(
        updateAccess,
        SECOND_NOTIFICATION_TIME * 60 * 1000
      )
    );
  }

  async delQRAccessById(id: string): Promise<Boolean> {
    const existingAccess = await this.findOne({ where: { id } });

    if (!existingAccess) {
      return false;
    }
    await this.delete(id);
    return true;
  }
}
