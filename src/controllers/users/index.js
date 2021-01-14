import STATUS from '../../constants/statusCodes';
import { successResponse, errorResponse } from '../../utils/response';
import {
  BadRequestError,
  NotFoundError,
  InternalServerError,
  ForbiddenError
} from '../../constants/errors';
import { models } from '../../models';
import {
  createSchema,
  getSchema,
  // partialUpdateSchema,
  deleteSchema
} from './validation';
import { authSerializer } from './serializers';
import jwt_decode from 'jwt-decode';
import findError from '../../utils/misc/errorHandling';

export async function createUser(req, res) {
  try {
    await createSchema.validateAsync({ ...req.body, avatar: req.file });

    const { User } = models;

    const user = await User.create({
      ...req.body,
      avatar: req.file
    });

    return successResponse(STATUS.HTTP_200_OK, user, res);
  } catch (error) {
    return errorResponse(findError(error), res);
  }
}

export async function getUser(req, res) {
  try {
    const { userId } = req.params;
    const { User } = models;

    await getSchema.validateAsync({ userId: parseInt(userId) });

    let user = await User.findOne({
      where: { id: userId },
      attributes: { exclude: ['password'] }
    });

    if (!user) {
      throw new NotFoundError();
    }

    return successResponse(STATUS.HTTP_200_OK, authSerializer(user), res);
  } catch (error) {
    switch (error.name) {
      case 'ValidationError':
        return errorResponse(
          new BadRequestError(error.details[0].message),
          res
        );
      case 'NotFoundError':
        return errorResponse(error, res);
      default:
        return errorResponse(new InternalServerError(), res);
    }
  }
}

export async function listUsers(req, res) {
  try {
    const { User } = models;

    let users = await User.findAll({ attributes: { exclude: ['password'] } });

    return successResponse(STATUS.HTTP_200_OK, authSerializer(users), res);
  } catch (error) {
    switch (error.name) {
      case 'ValidationError':
        return errorResponse(
          new BadRequestError(error.details[0].message),
          res
        );
      default:
        return errorResponse(new InternalServerError(), res);
    }
  }
}

export async function removeUser(req, res) {
  try {
    const { userId } = req.params;
    const { User } = models;
    const userIdNum = parseInt(userId);

    await deleteSchema.validateAsync({ userId: userIdNum });

    const tokenUser = jwt_decode(req.headers.authorization).user;

    if (tokenUser.id !== userIdNum) {
      throw new ForbiddenError();
    }

    User.destroy({
      where: { id: userId }
    });

    return successResponse(STATUS.HTTP_200_OK, {}, res);
  } catch (error) {
    switch (error.name) {
      case 'ValidationError':
        return errorResponse(
          new BadRequestError(error.details[0].message),
          res
        );
      case 'ForbiddenError': {
        return errorResponse(error, res);
      }
      default:
        return errorResponse(new InternalServerError(), res);
    }
  }
}
