import { models } from '../../models';
import { createSchema, listSchema } from './validation';
import { addPagination } from '../../utils/misc/pagination';

export const createProductRatingService = async (data = {}) => {
  const { ProductRating } = models;

  try {
    await createSchema.validateAsync(data);

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
