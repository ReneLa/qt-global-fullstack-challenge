import { type Response } from "express";

interface ApiResponse<T = any> {
  message: string;
  status: number;
  data?: T;
  [key: string]: any; // Allow additional metadata fields
}

export const sendSuccess = <T>(
  res: Response,
  data: T,
  message = "Success",
  statusCode = 200,
  metadata?: Record<string, any>
) => {
  const response: ApiResponse<T> = {
    message,
    status: statusCode,
    data,
    ...metadata
  };
  return res.status(statusCode).json(response);
};

export const sendError = (res: Response, message: string, statusCode = 500) => {
  const response: ApiResponse = {
    message,
    status: statusCode
  };
  return res.status(statusCode).json(response);
};
