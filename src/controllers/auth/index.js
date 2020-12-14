import STATUS from '../../constants/statusCodes';
import { successResponse, errorResponse } from '../../utils/response';
import {
  BadRequestError,
  UnprocessableEntityError,
  UnauthorizedError
} from '../../constants/errors';
import { models } from '../../models';
import { sign } from 'jsonwebtoken';
import { createUser } from '../users';
import { authSerializer } from '../users/serializers';
import is from '../../utils/misc/is';

export async function login(req, res) {
  try {
    const { email, password } = req.body;

    if (is.falsy(email) || is.falsy(password)) {
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
        user: authSerializer(user.toJSON())
      },

      process.env.JWT_SECRET,

      {
        expiresIn: '365 days'
      }
    );

    return successResponse(STATUS.HTTP_200_OK, { token }, res);
  } catch (error) {
    console.log(error);
    switch (error.name) {
      case 'SequelizeUniqueConstraintError':
        return errorResponse(new UnprocessableEntityError(), res);
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
    return errorResponse(error, res);
  }
}
