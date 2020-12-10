import STATUS from '../constants/statusCodes';

export class InternalServerError extends Error {
  constructor(message) {
    super();

    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, this.constructor);
    }

    this.name = this.constructor.name;
    this.status = STATUS.HTTP_500_INTERNAL_SERVER_ERROR;
    this.message = message || '';
  }
}

export class BadRequestError extends Error {
  constructor(message) {
    super();

    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, this.constructor);
    }

    this.name = this.constructor.name;
    this.status = STATUS.HTTP_400_BAD_REQUEST;
    this.message = message || '';
  }
}

export class NotFoundError extends Error {
  constructor(message) {
    super();

    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, this.constructor);
    }

    this.name = this.constructor.name;
    this.status = STATUS.HTTP_404_NOT_FOUND;
    this.message = message || '';
  }
}

export class ConflictError extends Error {
  constructor(message) {
    super();

    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, this.constructor);
    }

    this.name = this.constructor.name;
    this.status = STATUS.HTTP_409_UNPROCESSABLE_ENTITY;
    this.message = message || '';
  }
}

export class UnprocessableEntityError extends Error {
  constructor(message) {
    super();

    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, this.constructor);
    }

    this.name = this.constructor.name;
    this.status = STATUS.HTTP_422_UNPROCESSABLE_ENTITY;
    this.message = message || '';
  }
}

export class UnauthorizedError extends Error {
  constructor(message) {
    super();

    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, this.constructor);
    }

    this.name = this.constructor.name;
    this.status = STATUS.HTTP_401_UNAUTHORIZED;
    this.message = message || '';
  }
}

export class ForbiddenError extends Error {
  constructor(message) {
    super();

    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, this.constructor);
    }

    this.name = this.constructor.name;
    this.status = STATUS.HTTP_403_FORBIDDEN;
    this.message = message || '';
  }
}
