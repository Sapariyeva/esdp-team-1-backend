import { QRAccessDTO, QRAccessReqDTO } from "@/DTO/QRAccess.DTO";
import { IQrFindOptions } from "@/interfaces/IFindOptions.interface";
import { RequestWithFindOptions, RequestWithUser } from "@/interfaces/IRequest.interface";
import { ErrorWithStatus } from "@/interfaces/customErrors";
import { QRAccessService } from "@/services/QRAccess.service";
import { instanceToPlain, plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { RequestHandler } from "express";

export class QRController {
  private qrService: QRAccessService;

  constructor() {
    this.qrService = new QRAccessService();
  }

  createQREntry: RequestHandler = async (
    req: RequestWithUser,
    res
  ): Promise<void> => {
    try {
      const user = req.user;
      if (!user) throw new ErrorWithStatus("Unauthorized", 403);
      const newAccessDTOReq = plainToInstance(QRAccessReqDTO, req.body);
      const DTOErr = await validate(newAccessDTOReq);
      if (DTOErr.length > 0) throw DTOErr;
      if (newAccessDTOReq.valid_to > newAccessDTOReq.valid_from) {
        const newAccessDTO = plainToInstance(
          QRAccessDTO,
          instanceToPlain(newAccessDTOReq)
        );
        newAccessDTO.author = user.id;
        const result = await this.qrService.createQRAccessEntry(newAccessDTO);
        if (result) {
          res.send({
            success: true,
            payload: result.link,
          });
        }
      } else {
        res.status(400).send({
          success: false,
          message:
            "Access ending time should be larger than access starting time",
        });
      }
    } catch (e) {
      console.log(e);
      res.status(500).send({
        success: false,
        message: "Internal server error",
      });
    }
  };

  getQREntries: RequestHandler = async (req: RequestWithFindOptions<IQrFindOptions>, res, next): Promise<void> => {
    try {
      const user = req.user;
      if (!user) throw new ErrorWithStatus('Unauthorized', 403);
      const findOptions = req.findOptions;
      if (findOptions?.lock) findOptions.locks = [findOptions.lock];
      const entries = await this.qrService.getQrEntries(user, findOptions);
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
