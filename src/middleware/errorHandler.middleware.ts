import { ErrorWithStatus } from "@/interfaces/customErrors";
import { DTOerrExtractor } from "@/utils/DTOErrorExtractor";
import { ErrorRequestHandler } from "express";

export const errorHandler = (): ErrorRequestHandler => (err, req, res, next) => {
  console.log(err);
  if (Array.isArray(err)) {
    res.status(400).send({
      success: false,
      message: DTOerrExtractor(err)
    })
  }
  else if (err instanceof ErrorWithStatus) {
    res.status(err.status).send({
      success: false,
      message: err.message
    });
  }
  else {
    res.status(500).send({
      success: false,
      message: (err as Error).message
    });
  }
}