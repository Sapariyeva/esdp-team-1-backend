import { userDTO } from '@/DTO/user.DTO';
import { UserRepository } from '@/repositories/user.repository';

export class AuthService {
  private userRepo: UserRepository = new UserRepository()

  constructor() { }

  createUserEntry = async (data: userDTO) => {
    return await this.userRepo.createUser(data)
  };

  authUser = async (data:userDTO) => {
    return await this.userRepo.authUser(data)
  }

  validateToken = async (data:string) => {
    const result = await this.userRepo.validateRequest(data)
    return result
  }

  logoutUser = async (data:string) => {
    const result = await this.userRepo.logoutUser(data)
    return result
  }
}

