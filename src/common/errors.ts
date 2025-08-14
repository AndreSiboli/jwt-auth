type DetailsType = Record<string, unknown>;

export abstract class AppError extends Error {
  public readonly statusCode: number;
  public readonly timestamp: string;
  public readonly details?: DetailsType;

  constructor(message: string, statusCode: number, details?: DetailsType) {
    super(message);

    Object.setPrototypeOf(this, new.target.prototype);
    this.name = new.target.name;
    this.statusCode = statusCode;
    this.timestamp = new Date().toISOString();
    this.details = details;

    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, this.constructor);
    }
  }

  toJSON() {
    return {
      name: this.name,
      message: this.message,
      statusCode: this.statusCode,
      timestamp: this.timestamp,
      ...(this.details && { details: this.details }),
    };
  }
}

// 4XX - Client Errors
export class BadRequestError extends AppError {
  constructor(message = "Bad Request.", details?: DetailsType) {
    super(message, 400, details);
  }
}
export class UnauthorizedError extends AppError {
  constructor(message = "Access Denied.", details?: DetailsType) {
    super(message, 401, details);
  }
}

export class NotFoundError extends AppError {
  constructor(message = "Not Found.", details?: DetailsType) {
    super(message, 404, details);
  }
}

export class ConflictError extends AppError {
  constructor(message = "Conflict.", details?: DetailsType) {
    super(message, 409, details);
  }
}

// 5XX - Server Errors

export class InternalError extends AppError {
  constructor(
    message = "An internal server error occurred.",
    details?: DetailsType
  ) {
    super(message, 500, details);
  }
}
