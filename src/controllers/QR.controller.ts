import { QRAccessDTO, QRAccessReqDTO } from "@/DTO/QRAccess.DTO";
import { RequestWithUser } from "@/interfaces/IRequest.interface";
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
            link: result.link,
          });
        }
      } else {
        res.status(400).send({
          success: false,
          error:
            "Access ending time should be larger than access starting time",
        });
      }
    } catch (e) {
      console.log(e);
      res.status(500).send({
        success: false,
        error: "Internal server error",
      });
    }
  };

  getQREntries: RequestHandler = async (req, res): Promise<void> => {
    // TODO Provide Entries by phone number or time period
  };
}
