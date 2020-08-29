import { Request, Response, NextFunction } from 'express';
import { ValidateError } from 'tsoa';
export class Unauthorized extends Error {
    private statusCode: number;
    constructor(message?: string, statusCode?: number) {
        super(message);
        this.name = "Unauthorized:";
        this.statusCode = statusCode;
    }
}

export class NotVerified extends Error {
    private statusCode: number;
    constructor(message?: string, statusCode?: number) {
        super(message);
        this.name = "Not Verified:";
        this.statusCode = statusCode;
    }
}

export class Conflict extends Error {
    private statusCode: number;
    constructor(message?: string, statusCode?: number) {
        super(message);
        this.name = "Conflict or Duplicate:";
        this.statusCode = statusCode;
    }
}

export class DbConnectionError extends Error {
    private statusCode: number;
    constructor(message?: string, statusCode?: number) {
        super(message);
        this.name = "DB Connection Error:";
        this.statusCode = statusCode;
    }
}


export function globalErrorHandler(
    err: unknown,
    req: Request,
    res: Response,
    next: NextFunction
  ): Response | void {
    if (err instanceof ValidateError) {
      console.warn(`Caught Validation Error for ${req.path}:`, err.fields);
      return res.status(422).json({
        message: "Validation Failed",
        details: err?.fields,
      });
    }
    if (err instanceof Conflict) {
        return res.status(409).json({
          name: err.name,
          message: err.message,
        });
      }
    if (err instanceof Unauthorized) {
      return res.status(401).json({
        name: err.name,
        message: err.message,
      });
    }
    if (err instanceof NotVerified) {
        return res.status(418).json({
          name: err.name,
          message: err.message,
        });
      }
    if (err instanceof DbConnectionError) {
    return res.status(503).json({
        name: err.name,
        message: err.message,
    });
    }
    if (err instanceof Error) {
        console.log(err);
      return res.status(500).json({         
        name: err,
        message: "Internal Server Error",
        details: err.stack
      });
    }
    next();
  }