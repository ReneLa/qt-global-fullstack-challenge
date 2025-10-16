import { type NextFunction, type Request, type Response } from "express";

import { AppError } from "../utils/errors.js";
import logger from "../utils/logger.js";
import { sendError } from "../utils/response.js";

export const errorHandler = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (err instanceof AppError) {
    logger.error(err, `${err.name}: ${err.message}`);
    return sendError(res, err.message, err.statusCode);
  }

  logger.error(err, "Unexpected error");
  sendError(res, "Internal server error", 500);
};
