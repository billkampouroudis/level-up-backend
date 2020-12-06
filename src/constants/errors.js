import STATUS from '../constants/statusCodes';

export class InternalServerError extends Error {
  constructor(info) {
    super('Internal Server Error');

    this.name = this.constructor.name;
    Error.captureStackTrace(this, this.constructor);
    this.status = STATUS.HTTP_500_INTERNAL_SERVER_ERROR;
    this.info = info || {};
  }
}

export class BadRequestError extends Error {
  constructor(info) {
    super('Bad Request Error');

    this.name = this.constructor.name;
    Error.captureStackTrace(this, this.constructor);
    this.status = STATUS.HTTP_400_BAD_REQUEST;
    this.info = info || {};
  }
}

export class NotFoundError extends Error {
  constructor(info) {
    super('Not Found Error');

    this.name = this.constructor.name;
    Error.captureStackTrace(this, this.constructor);
    this.status = STATUS.HTTP_404_NOT_FOUND;
    this.info = info || {};
  }
}

export class ConflictError extends Error {
  constructor(info) {
    super('Conflict Error');

    this.name = this.constructor.name;
    Error.captureStackTrace(this, this.constructor);
    this.status = STATUS.HTTP_409_UNPROCESSABLE_ENTITY;
    this.info = info || {};
  }
}

export class UnprocessableEntityError extends Error {
  constructor(info) {
    super('Unprocessable Entity');

    this.name = this.constructor.name;
    Error.captureStackTrace(this, this.constructor);
    this.status = STATUS.HTTP_422_UNPROCESSABLE_ENTITY;
    this.info = info || {};
  }
}

export class UnauthorizedError extends Error {
  constructor(info) {
    super('Unauthorized');

    this.name = this.constructor.name;
    Error.captureStackTrace(this, this.constructor);
    this.status = STATUS.HTTP_401_UNAUTHORIZED;
    this.info = info || {};
  }
}

export class ForbiddenError extends Error {
  constructor(info) {
    super('Forbidden');

    this.name = this.constructor.name;
    Error.captureStackTrace(this, this.constructor);
    this.status = STATUS.HTTP_403_FORBIDDEN;
    this.info = info || {};
  }
}
