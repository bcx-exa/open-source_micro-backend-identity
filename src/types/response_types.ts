export class SuccessResponse {
  constructor(statusCode: number, name: string, message: string, data?: any) {
    this.statusCode = statusCode;
    this.name = name;
    this.message = message;
    this.data = data
  }
}

export interface SuccessResponse
{
  statusCode: number,
  name: string,
  message: string,
  data: any
}
export class Unauthorized extends Error {
  private statusCode: number;
  private data: any;

  constructor(message?: string, statusCode?: number, data?: any) {
    super(message);
    this.name = "Unauthorized";
    this.statusCode = statusCode;
    this.data = data
  }
}
export class NotFound extends Error {
  private statusCode: number;
  private data: any;

  constructor(message?: string, statusCode?: number, data?: any) {
    super(message);
    this.name = "Not Found";
    this.statusCode = statusCode;
    this.data = data
  }
}
export class NotVerified extends Error {
  private statusCode: number;
  private data: any;

  constructor(message?: string, statusCode?: number, data?: any) {
    super(message);
    this.name = "Not Verified";
    this.statusCode = statusCode;
    this.data = data
  }
}
export class InvalidFormat extends Error {
  private statusCode: number;
  private data: any;

  constructor(message?: string, statusCode?: number, data?: any) {
    super(message);
    this.name = "Invalid Format";
    this.statusCode = statusCode;
    this.data = data
  }
}
export class PasswordPolicyException extends Error {
  private statusCode: number;
  private data: any;

  constructor(message?: string, statusCode?: number, data?: any) {
    super(message);
    this.name = "Password Policy Exception";
    this.statusCode = statusCode;
    this.data = data
  }
}
export class Conflict extends Error {
  private statusCode: number;
  private data: any;

  constructor(message?: string, statusCode?: number, data?: any) {
    super(message);
    this.name = "Conflict";
    this.statusCode = statusCode;
    this.data = data
  }
}
export class InternalServerError extends Error {
  private statusCode: number;
  private data: any;

  constructor(message?: string, statusCode?: number, data?: any) {
    super(message);
    this.name = "Internal Server Error";
    this.statusCode = statusCode;
    this.data = data
  }
}
export class DbConnectionError extends Error {
  private statusCode: number;
  private data: any;

  constructor(message?: string, statusCode?: number, data?: any) {
    super(message);
    this.name = "DB Connection Error";
    this.statusCode = statusCode;
    this.data = data
  }
}
