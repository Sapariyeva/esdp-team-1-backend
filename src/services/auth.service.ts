import { RegisterUserDTO, SignInUserDTO } from '@/DTO/user.DTO';
import { Euser } from '@/entities/user.entity';
import { IRefreshRes, ISignInRes, IUser } from '@/interfaces/IUser';
import { UserRepository } from '@/repositories/user.repository';
import * as jwt from 'jsonwebtoken';
import { envConfig } from '@/env';
import { IUserFindOptions } from '@/interfaces/IFindOptions.interface';
import { ERole } from '@/types/roles';

export class AuthService {
  private userRepo: UserRepository = new UserRepository();

  register = async (dto: RegisterUserDTO): Promise<IUser> => {
    const newUser = new Euser();
    Object.assign(newUser, dto);
    await newUser.hashPass();
    return await this.userRepo.createUser(newUser);
  };

  signIn = async (dto: SignInUserDTO): Promise<IUser> => {
    const user = await this.userRepo.getUserByPhone(dto.phone);
    if (!user) {
      throw new Error("User with such phone number not found");
    } else {
      const passCheck = await user.comparePassword(dto.pass);
      if (!passCheck) {
        throw new Error("Invalid password");
      }
      return {
        ...user,
        pass: undefined,
        accessToken: user.signAccessToken(),
        refreshToken: user.signRefreshToken()
      } as ISignInRes;
    }
  };

  getUsersQuery = async (user: IUser, findOptions?: IUserFindOptions): Promise<IUser[]> => {
    const queryOptions = {...findOptions}
    switch (user.role) {
      case ERole.umanuAdmin:
        return findOptions
          ? await this.userRepo.getUsersQuery(findOptions)
          : await this.userRepo.getAllUsers();
      case ERole.organizationAdmin:
      case ERole.buildingAdmin:
      case ERole.tenantAdmin:
        queryOptions.tenantId = user.tenantId;
        break;
    }
    return await this.userRepo.getUsersQuery(queryOptions);
  }

  refreshAccessToken = (user: IUser): IRefreshRes => {
    const accessToken = jwt.sign({ sub: user.id }, envConfig.secretPrivate, {
      expiresIn: `${envConfig.accessTokenTTL}s`,
    });
    return { accessToken };
  } ;
}

