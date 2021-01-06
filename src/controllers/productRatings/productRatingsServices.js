import { models } from '../../models';
import { createSchema, listSchema } from './validation';
import { addPagination } from '../../utils/misc/pagination';
import { op } from '../../config/sequelize';
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
          where: { userId: userId, status: { [op.not]: 'in_cart' } }
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

export const listProductRatingsService = async (data = {}, options = {}) => {
  const { ProductRating } = models;

  try {
    await listSchema.validateAsync(data);

    let filters = { productId: data.productId };

    let results = await ProductRating.findAndCountAll({
      where: filters,
      order: [['createdAt', 'DESC']],
      ...addPagination(options.page, options.pageSize)
    });

    return Promise.resolve(results);
  } catch (error) {
    return Promise.reject(error);
  }
};
