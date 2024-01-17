import { Euser } from "@/entities/user.entity";
import { IUserFindOptions } from "@/interfaces/IFindOptions.interface";
import { FindManyOptions } from "typeorm";

export const createUserFindOptions = (query: IUserFindOptions): FindManyOptions<Euser> => {
  const findOptions: FindManyOptions<Euser> = {
    order: { username: "ASC" },
    take: 30
  };

  const {
    username,
    phone,
    role,
    organizationId,
    buildingId,
    tenantId,
    only_active,
    only_blocked,
    offset
  } = query;

  if (username) {
    findOptions.where = {...findOptions.where, username};
  }

  if (phone) {
    findOptions.where = {...findOptions.where, phone};
  }
  
  if (role) {
    findOptions.where = {...findOptions.where, role};
  }
  
  if (organizationId) {
    findOptions.where = {...findOptions.where, organizationId};
  } 

  if (buildingId) {
    findOptions.where = {...findOptions.where, buildingId};
  }

  if (tenantId) {
    findOptions.where = {...findOptions.where, tenantId};
  }

  if (only_active === "") {
    findOptions.where = {...findOptions.where, isActive: true};
  } else if (only_blocked === "") {
    findOptions.where = {...findOptions.where, isActive: false};
  }

  findOptions.skip = offset || 0;

  return findOptions;
}