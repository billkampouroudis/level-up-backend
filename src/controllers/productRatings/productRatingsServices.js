import { models } from '../../models';
import { createSchema, listSchema } from './validation';
import { addPagination } from '../../utils/misc/pagination';
import { ForbiddenError } from '../../constants/errors';

export const createProductRatingService = async (data = {}) => {
  const { ProductRating, OrderItem, Order } = models;
  const { productId, userId } = data;

  try {
    await createSchema.validateAsync(data);

    // Find if the user has ordered the given product.
    const orderItem = await OrderItem.findOne({
      where: { productId: productId },
      include: [
        {
          model: Order,
          where: { userId: userId, status: 'closed' }
        }
      ]
    });

    // Create rating only if user has bought the given product.
    if (!orderItem) {
      throw new ForbiddenError(
        'User should have bought the given product in order to add a rating'
      );
    }

    const result = await ProductRating.create(data);

    return Promise.resolve(result);
  } catch (error) {
    return Promise.reject(error);
  }
};

export const listProductRatingsService = async (options = {}) => {
  const { ProductRating, User } = models;

  try {
    await listSchema.validateAsync(options);

    let productRatingsFilters = {};
    if (options) {
      productRatingsFilters = { productId: options.productId };

      // Filter by product id
      if (options.productId) {
        productRatingsFilters = {
          ...productRatingsFilters,
          productId: options.productId
        };
      }

      // Filter by user id
      if (options.userId) {
        productRatingsFilters = {
          ...productRatingsFilters,
          userId: options.userId
        };
      }
    }

    let results = await ProductRating.findAndCountAll({
      where: productRatingsFilters,
      order: [['createdAt', 'DESC']],
      attributes: {
        exclude: ['userId']
      },
      include: [{ model: User, attributes: ['lastName', 'firstName'] }],
      ...addPagination(options.page, options.pageSize)
    });

    return Promise.resolve(results);
  } catch (error) {
    return Promise.reject(error);
  }
};
