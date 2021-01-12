import STATUS from '../../constants/statusCodes';
import { successResponse, errorResponse } from '../../utils/response';
import { BadRequestError, UnauthorizedError } from '../../constants/errors';
import { models } from '../../models';
import { sign } from 'jsonwebtoken';
import { createUser } from '../users';
import { authSerializer } from '../users/serializers';
import is from '../../utils/misc/is';
import findError from '../../utils/misc/errorHandling';

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
    return errorResponse(findError(error), res);
  }
}

export async function register(req, res) {
  try {
    const createUserResponse = await createUser(req, res);

    if (createUserResponse.error) {
      return errorResponse(findError(createUserResponse.error), res);
    }

    return await login(req, res);
  } catch (error) {
    return errorResponse(findError(error), res);
  }
}
