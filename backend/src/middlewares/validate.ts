import { type NextFunction, type Request, type Response } from "express";
import { ZodError, ZodType } from "zod";

import logger from "../utils/logger.js";

export const validate =
  (schema: ZodType, type: "body" | "params" | "query" = "body") =>
  (req: Request, res: Response, next: NextFunction) => {
    try {
      schema.parse(req[type]);
      next();
    } catch (err) {
      if (err instanceof ZodError) {
        logger.error(err.issues, "Validation Error");
        return res.status(400).json({
          message: "Please check your input and try again",
          status: 400,
          data: {
            errors: err.issues.map((e) => ({
              field: e.path.join("."),
              message: e.message
            }))
          }
        });
      }
      next(err);
    }
  };
