import STATUS from '../../constants/statusCodes';
import { successResponse, errorResponse } from '../../utils/response';
import {
  BadRequestError,
  DuplicateEntryError,
  UnauthorizedError
} from '../../constants/errors';
import { models } from '../../models';
import { sign } from 'jsonwebtoken';
import { createUser } from '../user';
import { authResponse } from '../user/responses';

export async function login(req, res) {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      throw new BadRequestError();
    }

    const { User } = models;
    let user = await User.findOne({ where: { email } });

    if (!user) {
      throw new BadRequestError();
    }

    if (!user.validPassword(password)) {
      throw new UnauthorizedError();
    }

    const token = sign(
      {
        user: authResponse(user.toJSON())
      },

      process.env.JWT_SECRET,

      {
        expiresIn: '365 days'
      }
    );

    return successResponse(STATUS.HTTP_200_OK, { token }, res);
  } catch (error) {
    console.log('ERROR', error);

    switch (error.name) {
      case 'SequelizeUniqueConstraintError':
        return errorResponse(new DuplicateEntryError(), res);
      case 'Unauthorized':
        return errorResponse(new UnauthorizedError(), res);
      default:
        return errorResponse(error, res);
    }
  }
}

export async function register(req, res) {
  try {
    const createUserResponse = await createUser(req, res);

    if (createUserResponse.error) {
      return errorResponse(createUserResponse.error, res);
    }

    return await login(req, res);
  } catch (error) {
    console.log('ERROR', error);
    return errorResponse(error, res);
  }
}
