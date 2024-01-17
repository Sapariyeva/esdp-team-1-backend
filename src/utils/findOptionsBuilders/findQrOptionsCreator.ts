import { EQRAccess } from "@/entities/QRAccess.entity";
import { IQrFindOptions } from "@/interfaces/IFindOptions.interface";
import { Between, FindManyOptions, LessThanOrEqual, MoreThanOrEqual } from "typeorm";

export const createQrFindOptions = (query: IQrFindOptions): FindManyOptions<EQRAccess> => {
  const findOptions: FindManyOptions<EQRAccess> = {
    order: { valid_from: "DESC" },
    take: 30,
  };

  const {
    author,
    phone,
    date_from,
    date_to,
    only_active,
    only_expired,
    offset
  } = query;

  if (author) {
    findOptions.where = {...findOptions.where, author};
  }

  if (phone) {
    findOptions.where = {...findOptions.where, phone};
  } 

  if (only_active === "") {
    findOptions.where = {
      ...findOptions.where,
      valid_to: MoreThanOrEqual(new Date().getTime())
    };
  } else if (only_expired === "") {
    findOptions.where = {
      ...findOptions.where,
      valid_to: LessThanOrEqual(new Date().getTime())
    };
  }

  if (date_from && date_to) {
    findOptions.where = {
      ...findOptions.where,
      valid_from: Between(date_from, date_to),
      valid_to: Between(date_from, date_to),
    };
  } else if (date_from && !date_to) {
    findOptions.where = {
      ...findOptions.where,
      valid_from: MoreThanOrEqual(date_from),
    };
  } else if (!date_from && date_to) {
    findOptions.where = {
      ...findOptions.where,
      valid_to: LessThanOrEqual(date_to),
    };
  }

  findOptions.skip = offset || 0;

  return findOptions;
}