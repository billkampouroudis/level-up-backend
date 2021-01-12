import get from './get';
import {
  InternalServerError,
  BadRequestError,
  UnprocessableEntityError
} from '../../constants/errors';

const findError = (error = {}) => {
  switch (error.name) {
    case 'SequelizeUniqueConstraintError':
      return new UnprocessableEntityError(
        get.safe(() => error.errors[0].message, '')
      );
    case 'SequelizeValidationError':
    case 'ValidationError':
      return new BadRequestError(get.safe(() => error.details[0].message, ''));
    case 'BadRequestError':
    case 'UnauthorizedError':
    case 'NotFoundError':
    case 'ConflictError':
    case 'ForbiddenError':
    case 'InternalServerError':
    case 'UnprocessableEntityError':
      return error;
    default:
      return new InternalServerError(error.message);
  }
};

export default findError;
