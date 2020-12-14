import STATUS from '../../constants/statusCodes';
import { successResponse, errorResponse } from '../../utils/response';
import {
  BadRequestError,
  UnprocessableEntityError,
  NotFoundError,
  InternalServerError
} from '../../constants/errors';
import { models } from '../../models';
import {
  createSchema,
  getSchema,
  partialUpdateSchema,
  deleteSchema
} from './validation';
import get from '../../utils/misc/get';
import jwt_decode from 'jwt-decode';

export async function createProduct(req, res) {
  try {
    await createSchema.validateAsync({ ...req.body, image: req.file });

    const { Product } = models;

    const storeId = 1; //TODO: take it from the jwt?
    const product = await Product.create({
      ...req.body,
      image: req.file,
      storeId
    });

    return successResponse(STATUS.HTTP_200_OK, product, res);
  } catch (error) {
    switch (error.name) {
      case 'SequelizeUniqueConstraintError':
        return errorResponse(
          new UnprocessableEntityError(error.errors[0].message),
          res
        );
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

export async function getProduct(req, res) {
  try {
    const { productId } = req.params;
    const { Product, Store, FavoriteProduct } = models;

    await getSchema.validateAsync({ productId: parseInt(productId) });

    const product = await Product.scope('withoutId').findOne({
      include: [
        {
          model: Store,
          as: 'store'
        }
      ],
      where: { id: productId }
    });

    if (!product) {
      throw new NotFoundError();
    }

    const tokenUser = get.safe(
      () => jwt_decode(req.headers.authorization).user
    );

    if (tokenUser) {
      const favorite = await FavoriteProduct.findOne({
        where: { productId, userId: tokenUser.id }
      });

      const _product = product.toJSON();
      if (favorite) {
        _product.isFavorite = true;
        return successResponse(STATUS.HTTP_200_OK, _product, res);
      }
      _product.isFavorite = false;
      return successResponse(STATUS.HTTP_200_OK, _product, res);
    }

    return successResponse(STATUS.HTTP_200_OK, product, res);
  } catch (error) {
    console.log(error);
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

export async function listProducts(req, res) {
  try {
    const { Product, Store } = models;

    let products = await Product.scope('withoutId').findAll({
      include: [
        {
          model: Store,
          as: 'store'
        }
      ]
    });

    return successResponse(STATUS.HTTP_200_OK, products, res);
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

export async function partialUpdateProduct(req, res) {
  try {
    const { Product } = models;
    const { productId } = req.params;

    // TODO: Update only if the user is admin of this product's store
    await partialUpdateSchema.validateAsync({ ...req.body, productId });

    let product = await Product.update(
      { ...req.body },
      {
        where: {
          id: productId
        }
      }
    );

    return successResponse(STATUS.HTTP_200_OK, product, res);
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

export async function removeProduct(req, res) {
  try {
    const { productId } = req.params;
    const { Product } = models;

    await deleteSchema.validateAsync(productId);

    // TODO: Remove only if the user is admin of this product's store
    Product.destroy({
      where: { id: productId }
    });

    return successResponse(STATUS.HTTP_200_OK, {}, res);
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
