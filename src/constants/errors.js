import STATUS from '../constants/statusCodes';

export class GenericError extends Error {
  constructor(message, status, info) {
    super(message || 'Generic Error');

    this.name = this.constructor.name;
    Error.captureStackTrace(this, this.constructor);
    this.status = status || STATUS.HTTP_500_INTERNAL_SERVER_ERROR;
    this.info = info || {};
  }
}

export class InternalServerError extends GenericError {
  constructor(info) {
    super('Internal Server Error');

    this.name = this.constructor.name;
    Error.captureStackTrace(this, this.constructor);
    this.status = STATUS.HTTP_500_INTERNAL_SERVER_ERROR;
    this.info = info || {};
  }
}

export class BadRequestError extends GenericError {
  constructor(info) {
    super('Bad Request Error');

    this.name = this.constructor.name;
    Error.captureStackTrace(this, this.constructor);
    this.status = STATUS.HTTP_400_BAD_REQUEST;
    this.info = info || {};
  }
}

export class NotFoundError extends GenericError {
  constructor(info) {
    super('Not Found Error');

    this.name = this.constructor.name;
    Error.captureStackTrace(this, this.constructor);
    this.status = STATUS.HTTP_404_NOT_FOUND;
    this.info = info || {};
  }
}

export class DuplicateEntryError extends GenericError {
  constructor(info) {
    super('Duplicate Entry Error');

    this.name = this.constructor.name;
    Error.captureStackTrace(this, this.constructor);
    this.status = STATUS.HTTP_422_UNPROCESSABLE_ENTITY;
    this.info = info || {};
  }
}

export class UnauthorizedError extends GenericError {
  constructor(info) {
    super('Unauthorized');

    this.name = this.constructor.name;
    Error.captureStackTrace(this, this.constructor);
    this.status = STATUS.HTTP_401_UNAUTHORIZED;
    this.info = info || {};
  }
}
