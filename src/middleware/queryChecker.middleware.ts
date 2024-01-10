import { QrFindOptionsDTO } from '@/DTO/QRAccess.DTO';
import { RequestWithFindOptions } from '@/interfaces/IRequest.interface';
import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';
import { NextFunction, Response } from 'express';

type TEntity = 'qr'

export function checkQuery<T>(entity: TEntity) {
  return async (req: RequestWithFindOptions<T>, res: Response, next: NextFunction) => {
    try {
      let dtoSignature;
      // patentially can be implemented for other entities as well
      switch (entity) {
        case 'qr':
          dtoSignature = QrFindOptionsDTO;
          break;
      } 
      const findOptions = plainToInstance(dtoSignature, req.query);
      const DTOerr = await validate(findOptions);
      if (DTOerr && DTOerr.length > 0) throw DTOerr;
      req.findOptions = findOptions as T;     
      return next();
    } catch (err) {
      next(err);
    }
  };
}