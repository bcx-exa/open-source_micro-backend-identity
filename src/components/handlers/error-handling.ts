import { Request, Response, NextFunction } from "express";
import { ValidateError } from "tsoa";
import { NotFound, InternalServerError, PasswordPolicyException, Conflict, Unauthorized, InvalidFormat, NotVerified, DbConnectionError } from "../../types/response_types";


export function globalErrorHandler(
  err: unknown,
  _req: Request,
  res: Response,
  next: NextFunction
): Response | void {
  if (err instanceof ValidateError) {
    return res.status(422).json({
      statusCode: 422, 
      name: "TSOA Validation Failed",
      message: "Validation Failed",
      data: err?.fields,
    });
  }
  if (err instanceof NotFound) {
    return res.status(404).json({
      statusCode: 404,
      name: err.name,
      message: err.message,
      data: err.stack
    });
  }
  if (err instanceof PasswordPolicyException) {
    return res.status(406).json({
      statusCode: 406,
      name: err.name,
      message: err.message,
      data: err.stack
    });
  }
  if (err instanceof Conflict) {
    return res.status(409).json({
      statusCode: 409,
      name: err.name,
      message: err.message,
      data: err.stack
    });
  }
  if (err instanceof Unauthorized) {
    return res.status(401).json({
      statusCode: 401,
      name: err.name,
      message: err.message,
      data: err.stack
    });
  }
  if (err instanceof InvalidFormat) {
    return res.status(403).json({
      statusCode: 403,
      name: err.name,
      message: err.message,
      data: err.stack
    });
  }
  if (err instanceof NotVerified) {
    return res.status(418).json({
      statusCode: 418,
      name: err.name,
      message: err.message,
      data: err.stack
    });
  }
  if (err instanceof DbConnectionError) {
    return res.status(503).json({
      statusCode: 503,
      name: err.name,
      message: err.message,
      data: err.stack
    });
  }
  if (err instanceof InternalServerError) {
    console.log(err);
    return res.status(500).json({
      statusCode: 500,
      name: err.name,
      message: err.message,
      data: err.stack
    });
  }
  if (err instanceof Error) {
    console.log(err);
    return res.status(500).json({
      statusCode: 500,
      name: err.name,
      message: err.message,
      data: err.stack
    });
  }
  next();
}
