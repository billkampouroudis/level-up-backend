import STATUS from '../../constants/statusCodes';
import { successResponse, errorResponse } from '../../utils/response';
import { NotFoundError } from '../../constants/errors';
import { models } from '../../models';
import {
  createSchema,
  getSchema,
  partialUpdateSchema,
  deleteSchema
} from './validation';
import get from '../../utils/misc/get';
import jwt_decode from 'jwt-decode';
import findError from '../../utils/misc/errorHandling';

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

    let _product = product.toJSON();
    if (tokenUser) {
      const favorite = await FavoriteProduct.findOne({
        where: { productId, userId: tokenUser.id }
      });

      if (favorite) {
        _product.isFavorite = true;
        return successResponse(STATUS.HTTP_200_OK, _product, res);
      }
      _product.isFavorite = false;
      return successResponse(STATUS.HTTP_200_OK, _product, res);
    }

    return successResponse(STATUS.HTTP_200_OK, product, res);
  } catch (error) {
    return errorResponse(findError(error), res);
  }
}

export async function listProducts(req, res) {
  try {
    const { Product, Store, ProductRating } = models;

    let products = await Product.scope('withoutId').findAll({
      include: [
        {
          model: Store,
          as: 'store'
        }
      ],
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
    return errorResponse(findError(error), res);
  }
}
