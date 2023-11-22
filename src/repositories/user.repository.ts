import { Repository } from 'typeorm';
import { appDataSource } from '../dbConfig'
import { Euser } from '@/entities/user.entity';
import { IUser } from '@/interfaces/IUser';
import { userDTO } from '@/DTO/user.DTO';
import { genSalt, hash, compare } from 'bcrypt'

export class UserRepository extends Repository<Euser> {
    constructor() {
        super(Euser, appDataSource.createEntityManager());
    }

    async createUser(data: userDTO): Promise<IUser> {
        data.pass = await this.hashPass(data.pass)
        const newRecord = this.create(data as Euser)
        const dbAnswer = await this.save(newRecord)
        dbAnswer.pass = ''
        return dbAnswer
    }

    async validateRequest(token: string): Promise<userDTO | undefined> {
        const extractedUser = await this.findOne({
            'where': {
                token: token
            }
        })
        if (extractedUser) {
            return this.clearPass(extractedUser)
        }
        else {
            return
        }
    }

    async getAllUsers(): Promise<userDTO[]> {
        return await this.find()
    }

    async getUserById(id: string): Promise<userDTO | undefined> {
        const extractedUser = await this.findOne({
            'where': {
                id: id
            }
        })
        if (extractedUser) {
            return this.clearPass(extractedUser)
        }
        else {
            return
        }
    }

    async authUser(data: userDTO): Promise<IUser> {
        const extractedUser = await this.findOne({
            'where': {
                username: data.username
            }
        })
        if (extractedUser) {
            if (await this.comparePass(data.pass, extractedUser)) {
                 this.createToken(extractedUser)
                //TODO CREATE AND SAVE JWT
                
                return this.clearPass(extractedUser)
            }
            else {
                throw new Error('wrong password')
            }
        }
        else {
            throw new Error('user not found')
        }
    }

    async logoutUser(token: string): Promise<boolean> {
        const extractedUser = await this.findOne({
            'where': {
                token: token
            }
        })
        if (extractedUser) {
            {
                // TODO CHANGE OR REMOVE TOKEN
                return true
            }
        }
        else {
            return false
        }
    }

    async hashPass(pass: string) {
        const salt = await genSalt();
        return (await hash(pass, salt));
    }

    private clearPass(user: userDTO): userDTO {
        const newUser = { ...user }
        newUser.pass = ''
        return newUser
    }

    private async comparePass(pass: string, user: userDTO) {
        return (await compare(pass, user.pass));
    }

    private createToken(user: IUser):string {
        return 'hereBeToken' // TODO PRODUCE JWT
    }
}