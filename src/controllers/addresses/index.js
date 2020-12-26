import STATUS from '../../constants/statusCodes';
import { successResponse, errorResponse } from '../../utils/response';
import get from '../../utils/misc/get';
import {
  BadRequestError,
  UnprocessableEntityError,
  InternalServerError,
  NotFoundError
} from '../../constants/errors';
import { models } from '../../models';
import { createSchema, deleteSchema, partialUpdateSchema } from './validation';
import jwt_decode from 'jwt-decode';

export async function createAddress(req, res) {
  try {
    const tokenUser = jwt_decode(req.headers.authorization).user;

    const { Address } = models;

    let address = null;
    if (tokenUser.storeId) {
      await createSchema.validateAsync({
        ...req.body,
        storeId: tokenUser.storeId
      });

      address = await Address.create({
        ...req.body,
        storeId: tokenUser.storeId
      });
    } else {
      await createSchema.validateAsync({
        ...req.body,
        userId: tokenUser.id
      });

      address = await Address.create({
        ...req.body,
        userId: tokenUser.id
      });
    }

    if (!address) {
      throw new BadRequestError();
    }

    return successResponse(STATUS.HTTP_200_OK, address, res);
  } catch (error) {
    switch (error.name) {
      case 'SequelizeUniqueConstraintError':
        return errorResponse(
          new UnprocessableEntityError('This product is already in favorites'),
          res
        );
      case 'SequelizeValidationError':
        return errorResponse(new BadRequestError(error.errors[0].message), res);
      case 'BadRequestError':
        return errorResponse(error, res);
      default:
        return errorResponse(new InternalServerError(), res);
    }
  }
}

export async function listAddresses(req, res) {
  try {
    const { User } = models;

    const tokenUser = jwt_decode(req.headers.authorization).user;

    const user = await User.findOne({
      where: {
        id: tokenUser.id
      }
    });

    const addresses = await user.getAddresses();

    return successResponse(STATUS.HTTP_200_OK, addresses, res);
  } catch (error) {
    return errorResponse(
      new InternalServerError(
        get.safe(() => error.errors[0].message, 'Something went wrong')
      ),
      res
    );
  }
}

export async function getAddress(req, res) {
  try {
    const { addressId } = req.params;

    const { Address } = models;

    const tokenUser = jwt_decode(req.headers.authorization).user;

    let address = null;
    if (tokenUser.storeId) {
      address = await Address.findOne({
        where: { id: addressId, storeId: tokenUser.storeId }
      });
    } else {
      address = await Address.findOne({
        where: { id: addressId, userId: tokenUser.id }
      });
    }

    return successResponse(STATUS.HTTP_200_OK, address, res);
  } catch (error) {
    return errorResponse(new InternalServerError(error.message, res));
  }
}

export async function partialUpdateAddress(req, res) {
  try {
    const { addressId } = req.params;
    const { Address } = models;

    await partialUpdateSchema.validateAsync(req.body);

    const tokenUser = jwt_decode(req.headers.authorization).user;

    let address = null;
    if (tokenUser.storeId) {
      address = await Address.findOne({
        where: { id: addressId, storeId: tokenUser.storeId }
      });
    } else {
      address = await Address.findOne({
        where: { id: addressId, userId: tokenUser.id }
      });
    }

    if (!address) {
      throw new NotFoundError();
    }

    for (let key in req.body) {
      address[key] = req.body[key];
    }

    await address.save();

    return successResponse(STATUS.HTTP_200_OK, address, res);
  } catch (error) {
    switch (error.name) {
      case 'ValidationError':
        return errorResponse(
          new BadRequestError(error.details[0].message),
          res
        );
      case 'ForbiddenError':
        return errorResponse(error, res);
      case 'NotFoundError':
        return errorResponse(error, res);
      default:
        return errorResponse(new InternalServerError(error.message), res);
    }
  }
}

export async function removeAddress(req, res) {
  try {
    const { addressId } = req.params;
    const { Address } = models;

    await deleteSchema.validateAsync({ addressId });

    const tokenUser = jwt_decode(req.headers.authorization).user;

    if (tokenUser.storeId) {
      await Address.destroy({
        where: { id: addressId, storeId: tokenUser.storeId }
      });
    } else {
      await Address.destroy({
        where: { id: addressId, userId: tokenUser.id }
      });
    }

    return successResponse(STATUS.HTTP_200_OK, {}, res);
  } catch (error) {
    return errorResponse(new InternalServerError(), res);
  }
}
