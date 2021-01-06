import { models } from '../../models';
import { createSchema, listSchema } from './validation';

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

export const listProductRatingsService = async (data = {}) => {
  const { ProductRating } = models;

  try {
    await listSchema.validateAsync(data);

    let filters = { productId: data.productId };

    let products = await ProductRating.findAll({
      where: filters
    });

    return Promise.resolve(products);
  } catch (error) {
    return Promise.reject(error);
  }
};
