import { QrFindOptionsDTO } from '@/DTO/QRAccess.DTO';
import { UserFindOptionsDTO } from '@/DTO/user.DTO';
import { RequestWithFindOptions } from '@/interfaces/IRequest.interface';
import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';
import { NextFunction, Response } from 'express';

// potentially can be implemented for other entities as well
type TEntity = 'qr' | 'user'

export function checkQuery<T>(entity: TEntity) {
  return async (req: RequestWithFindOptions<T>, res: Response, next: NextFunction) => {
    try {
      let dtoSignature;
      switch (entity) {
        case 'qr':
          dtoSignature = QrFindOptionsDTO;
          break;
        case 'user':
          dtoSignature = UserFindOptionsDTO;
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