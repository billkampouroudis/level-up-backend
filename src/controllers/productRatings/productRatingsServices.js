import { models } from '../../models';
import { createSchema, listSchema } from './validation';
import { addPagination } from '../../utils/misc/pagination';
import { ForbiddenError } from '../../constants/errors';
import is from '../../utils/misc/is';

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
  const { ProductRating } = models;
  const { filters } = options;
  try {
    await listSchema.validateAsync(filters);

    let productRatingsFilters = { productId: filters.productId };

    // Filter by product id
    if (is.array(filters.productId) && filters.productId.length > 0) {
      productRatingsFilters = {
        ...productRatingsFilters,
        productId: filters.productId
      };
    }

    // Filter by user id
    if (filters.userId) {
      productRatingsFilters = {
        ...productRatingsFilters,
        userId: filters.userId
      };
    }

    let results = await ProductRating.findAndCountAll({
      where: productRatingsFilters,
      order: [['createdAt', 'DESC']],
      ...addPagination(options.page, options.pageSize)
    });

    return Promise.resolve(results);
  } catch (error) {
    return Promise.reject(error);
  }
};
