import STATUS from '../constants/statusCodes';
import { successResponse, errorResponse } from '../utils/response';
import {
  BadRequestError,
  DuplicateEntryError,
  UnauthorizedError
} from '../constants/errors';
import { models } from '../models';
import { sign } from 'jsonwebtoken';
// import { create } from '../controllers/users';

export async function login(req, res) {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      throw new BadRequestError();
    }

    let user = await models.User.findOne({ where: { username } });

    if (!user) {
      throw new BadRequestError();
    }

    let validPassword = user.password === password;

    if (!validPassword) {
      throw new UnauthorizedError();
    }

    const token = sign(
      {
        email: user.email
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
  // try {
  //   const createUserResponse = await create(req, res);

  //   if (createUserResponse.error) {
  //     return errorResponse(createUserResponse.error, res);
  //   }

  //   return await login(req, res);
  // } catch (error) {
  //   console.log('ERROR', error);

  //   return errorResponse(error, res);
  // }

  return errorResponse(null, res);
}
