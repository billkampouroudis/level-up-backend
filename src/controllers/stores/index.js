import STATUS from '../../constants/statusCodes';
import { successResponse, errorResponse } from '../../utils/response';
import {
  BadRequestError,
  UnprocessableEntityError,
  NotFoundError
} from '../../constants/errors';
import { models } from '../../models';
import {
  createSchema,
  getSchema,
  partialUpdateSchema,
  deleteSchema
} from './validation';

export async function createStore(req, res) {
  try {
    await createSchema.validateAsync({ ...req.body, avatar: req.file });

    const { Store } = models;

    const store = await Store.create({
      ...req.body,
      avatar: req.file
    });

    return successResponse(STATUS.HTTP_200_OK, store, res);
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
        return errorResponse(error, res);
    }
  }
}

export async function getStore(req, res) {
  try {
    const { storeId } = req.params;
    const { Store } = models;

    await getSchema.validateAsync({ storeId: parseInt(storeId) });

    let store = await Store.findOne({ where: { id: storeId } });

    if (!store) {
      throw new NotFoundError();
    }

    return successResponse(STATUS.HTTP_200_OK, store, res);
  } catch (error) {
    switch (error.name) {
      case 'ValidationError':
        return errorResponse(
          new BadRequestError(error.details[0].message),
          res
        );
      default:
        return errorResponse(error, res);
    }
  }
}

export async function listStores(req, res) {
  try {
    const { Store } = models;

    let stores = await Store.findAll();

    return successResponse(STATUS.HTTP_200_OK, stores, res);
  } catch (error) {
    switch (error.name) {
      case 'ValidationError':
        return errorResponse(
          new BadRequestError(error.details[0].message),
          res
        );
      default:
        return errorResponse(error, res);
    }
  }
}

export async function listProducts(req, res) {
  try {
    const { storeId } = req.params;
    const { Product, Store, ProductRating } = models;

    let products = await Product.scope('withoutId').findAll({
      include: [
        {
          model: Store,
          as: 'store'
        }
      ],
      where: { storeId },
      limit: 5,
      order: [['id', 'DESC']]
    });

    // Add ratings
    let _products = [];
    for (let product of products) {
      const ratingResults = await ProductRating.findAndCountAll({
        where: { productId: product.id },
        attributes: ['stars']
      });

      let sumStars = 0;
      for (const rating of ratingResults.rows) {
        sumStars += rating.stars;
      }

      const stars = Math.round(sumStars / ratingResults.count);

      const ratings = {
        stars,
        count: ratingResults.count
      };

      const _product = product.toJSON();
      _product.ratings = ratings;
      _products.push(_product);
    }

    return successResponse(STATUS.HTTP_200_OK, _products, res);
  } catch (error) {
    switch (error.name) {
      case 'ValidationError':
        return errorResponse(
          new BadRequestError(error.details[0].message),
          res
        );
      default:
        return errorResponse(error, res);
    }
  }
}
