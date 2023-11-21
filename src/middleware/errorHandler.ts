import { ErrorRequestHandler } from "express";

export const errorHandler = (): ErrorRequestHandler => (err, req, res, next) => {
  res.status(500).send({
    success: false,
    message: err.message
  })
}