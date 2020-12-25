import STATUS from '../../constants/statusCodes';
import { successResponse, errorResponse } from '../../utils/response';
import get from '../../utils/misc/get';
import {
  BadRequestError,
  UnprocessableEntityError,
  InternalServerError
} from '../../constants/errors';
import { models } from '../../models';
import { createSchema, deleteSchema } from './validation';
import jwt_decode from 'jwt-decode';

export async function createFavorite(req, res) {
  try {
    const { productId } = req.params;
    await createSchema.validateAsync({ productId });

    const { FavoriteProduct } = models;

    const tokenUser = jwt_decode(req.headers.authorization).user;

    await FavoriteProduct.create({
      productId: productId,
      userId: tokenUser.id
    });

    return successResponse(STATUS.HTTP_200_OK, null, res);
  } catch (error) {
    switch (error.name) {
      case 'SequelizeUniqueConstraintError':
        return errorResponse(
          new UnprocessableEntityError('This product is already in favorites'),
          res
        );
      case 'SequelizeValidationError':
        return errorResponse(new BadRequestError(error.errors[0].message), res);
      default:
        return errorResponse(new InternalServerError(), res);
    }
  }
}

export async function listFavorites(req, res) {
  try {
    const { User, Store } = models;

    const tokenUser = jwt_decode(req.headers.authorization).user;

    const user = await User.findOne({
      where: {
        id: tokenUser.id
      }
    });

    const favorites = await user.getFavoriteProducts({
      include: [
        {
          model: Store,
          as: 'store'
        }
      ]
    });

    return successResponse(STATUS.HTTP_200_OK, favorites, res);
  } catch (error) {
    return errorResponse(
      new InternalServerError(
        get.safe(() => error.errors[0].message, 'Something went wrong')
      ),
      res
    );
  }
}

export async function removeFavorite(req, res) {
  try {
    const { productId } = req.params;
    const { FavoriteProduct } = models;

    await deleteSchema.validateAsync({ productId });

    const tokenUser = jwt_decode(req.headers.authorization).user;

    await FavoriteProduct.destroy({
      where: { userId: tokenUser.id, productId: productId }
    });

    return successResponse(STATUS.HTTP_200_OK, {}, res);
  } catch (error) {
    return errorResponse(new InternalServerError(), res);
  }
}
