import { Euser } from "@/entities/user.entity";
import { IUserFindOptions } from "@/interfaces/IFindOptions.interface";
import { FindManyOptions, In } from "typeorm";

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
    tenants,
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
  } else if (tenants) {
    findOptions.where = {...findOptions.where, tenantId: In(tenants)};
  }

  findOptions.skip = offset || 0;

  return findOptions;
}