import { EQRAccess } from "@/entities/QRAccess.entity";
import { IQrFindOptions } from "@/interfaces/IFindOptions.interface";
import { Between, FindManyOptions, In, LessThanOrEqual, MoreThanOrEqual } from "typeorm";

export const createQrFindOptions = (query: IQrFindOptions): FindManyOptions<EQRAccess> => {
  const findOptions: FindManyOptions<EQRAccess> = {
    order: { valid_to: "DESC" },
    take: 30,
  };

  const {
    author,
    phone,
    valid_from,
    valid_to,
    only_active,
    only_expired,
    offset,
    allowedUsers
  } = query;

  if (author) {
    findOptions.where = { ...findOptions.where, author };
  }

  if (phone) {
    findOptions.where = { ...findOptions.where, phone };
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

  if (valid_from && valid_to) {
    findOptions.where = {
      ...findOptions.where,
      valid_from: Between(valid_from, valid_to),
      valid_to: Between(valid_from, valid_to),
    };
  } else if (valid_from && !valid_to) {
    findOptions.where = {
      ...findOptions.where,
      valid_from: MoreThanOrEqual(valid_from),
    };
  } else if (!valid_from && valid_to) {
    findOptions.where = {
      ...findOptions.where,
      valid_to: LessThanOrEqual(valid_to),
    };
  }
  if (allowedUsers) {
    findOptions.where = {
      ...findOptions.where,
      author: In(allowedUsers)
    }
  }

  findOptions.skip = offset || 0;

  return findOptions;
}