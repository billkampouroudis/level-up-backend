import STATUS from '../constants/statusCodes';
import { successResponse, errorResponse } from '../utils/response';
import {
  BadRequestError,
  UnprocessableEntityError,
  UnauthorizedError,
  NotFoundError
} from '../constants/errors';
import { models } from '../models';

export async function createUser(req, res) {
  try {
    const {
      firstName,
      lastName,
      email,
      mobileNumberCode,
      mobileNumber,
      password
    } = req.body;

    if (!username || !password || !email) {
      throw new BadRequestError();
    }

    let result = await User.create({ username, password, email });

    return successResponse(STATUS.HTTP_200_OK, result, res);
  } catch (error) {
    switch (error.name) {
      case 'SequelizeUniqueConstraintError':
        return errorResponse(
          new UnprocessableEntityError(error.errors[0].message),
          res
        );
      default:
        return errorResponse(error, res);
    }
  }
}

export async function getUser(req, res) {
  try {
    const { userId } = req.params;
    const { User } = models;

    if (!userId) {
      throw new BadRequestError();
    }

    let user = await User.findOne({ where: { id: userId } });

    if (!user) {
      throw new NotFoundError();
    }

    return successResponse(STATUS.HTTP_200_OK, user, res);
  } catch (error) {
    console.log('ERROR', error);
    return errorResponse(error, res);
  }
}

export async function listUsers(req, res) {
  try {
    const createUserResponse = await create(req, res);

    if (createUserResponse.error) {
      return errorResponse(createUserResponse.error, res);
    }

    return await login(req, res);
  } catch (error) {
    console.log('ERROR', error);
    return errorResponse(error, res);
  }
}

export async function partialUpdateUser(req, res) {}

export async function removeUser(req, res) {}
