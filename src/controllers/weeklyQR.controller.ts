import { weeklyQRAccessDTO, weeklyQRAccessReqDTO } from "@/DTO/QRAccess.DTO";
import { IQrFindOptions } from "@/interfaces/IFindOptions.interface";
import { RequestWithFindOptions, RequestWithUser } from "@/interfaces/IRequest.interface";
import { ErrorWithStatus } from "@/interfaces/customErrors";
import { WeeklyQRAccessService } from "@/services/weeklyQRAccess.service";
import { instanceToPlain, plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { RequestHandler } from "express";

export class WeeklyQRController {
  private weeklyQrService: WeeklyQRAccessService;

  constructor() {
    this.weeklyQrService = new WeeklyQRAccessService();
  }

  createQREntry: RequestHandler = async (
    req: RequestWithUser,
    res,
    next
  ): Promise<void> => {
    try {
      const user = req.user;
      if (!user) throw new ErrorWithStatus("Unauthorized", 403);
      const newAccessDTOReq = plainToInstance(weeklyQRAccessReqDTO, req.body);
      const DTOErr = await validate(newAccessDTOReq);
      if (DTOErr.length > 0) throw DTOErr;
      const newAccessDTO = plainToInstance(
        weeklyQRAccessDTO,
        instanceToPlain(newAccessDTOReq)
      );
      newAccessDTO.author = user.id;
      const result = await this.weeklyQrService.createQRAccessEntry(newAccessDTO);
      if (result) {
        res.send({
          success: true,
          payload: result,
        });
      }
      else {
        throw new Error('Failed to create weekly QR access')
      }
    }
    catch (e) {
      next(e)
    }
  };

  getQREntries: RequestHandler = async (req: RequestWithFindOptions<IQrFindOptions>, res, next): Promise<void> => {
    try {
      const user = req.user;
      if (!user) throw new ErrorWithStatus('Unauthorized', 403);
      const findOptions = req.findOptions;
      if (findOptions?.lock) findOptions.locks = [findOptions.lock];
      const entries = await this.weeklyQrService.getQrEntries(user, findOptions);
      if (!entries) throw new ErrorWithStatus('Error getting QR access entries', 400);
      res.status(200).send({
        success: true,
        payload: entries
      })
    } catch (err) {
      next(err);
    }
  };
}
