// import { QRAccessDTO, QRAccessReqDTO } from '@/DTO/QRAccess.DTO';
// import { userDTO } from '@/DTO/user.DTO';
// import { UserRepository } from '@/repositories/user.repository';
// import { QRAccessService } from '@/services/QRAccess.service';
// import { AuthService } from '@/services/auth.service';
// import { DTOerrExtractor } from '@/utils/DTOErrorExtractor';
// import { getCredentialsFromHeader } from '@/utils/getCredentialsFromHeader';
// import { instanceToPlain, plainToInstance } from 'class-transformer';
// import { validate } from 'class-validator';
import { RequestHandler } from 'express';

export class QRController {
    // private authService: AuthService
    // private qrService: QRAccessService
    // private userRepo = new UserRepository()
    // constructor() {
    //     this.authService = new AuthService();
    //     this.qrService = new QRAccessService()
    // }

    createQREntry: RequestHandler = async (req, res): Promise<void> => {
        try {
            // const token = getCredentialsFromHeader(req.headers.authorization)
            // const newAccessDTOReq = plainToInstance(QRAccessReqDTO, req.body);
            // const DTOErr = await validate(newAccessDTOReq)
            // if (DTOErr && DTOErr.length > 0) {
            //     res.status(400).send({
            //         success: false,
            //         error: DTOerrExtractor(DTOErr)
            //     })
            // } else {
            //     if (newAccessDTOReq.valid_to > newAccessDTOReq.valid_from) {
            //         const newAccessDTO = plainToInstance(QRAccessDTO, instanceToPlain(newAccessDTOReq))
            //         // ~~~~~~~~~ PLACEHOLDER CODE TO WORK WITHOUT AUTHORIZATION ~~~~~~~~
            //         // ~~~~~~~~~ ADDS RANDOM USER AS AUTHOR IF NO TOKEN PROVIDED ~~~~~~~~~
            //         let user: userDTO | undefined = undefined
            //         if (token) {
            //             user = await this.authService.validateToken(token)
            //         }
            //         if (user) {
            //             newAccessDTO.author = user.id
            //         } else {
            //             const availableUserIds = (await this.userRepo.getAllUsers()).map((e) => {
            //                 return e.id
            //             })
            //             newAccessDTO.author = availableUserIds[Math.floor(Math.random() * availableUserIds.length)];
            //         }
            //         //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
            //         const result = await this.qrService.createQRAccessEntry(newAccessDTO);
            //         if (result) {
            //             res.send({
            //                 success: true,
            //                 link: result.link
            //             })
            //         }

            //     } else res.status(400).send({
            //         success: false,
            //         error: 'Access ending time should be larger than access starting time'
            //     })
            // }
        } catch (e) {
            console.log(e);
            res.status(500).send({
                success: false,
                error: 'Internal server error'
            });
        }

    }



    getQREntries: RequestHandler = async (req, res): Promise<void> => {
    // TODO Provide Entries by phone number or time period
    }
}

