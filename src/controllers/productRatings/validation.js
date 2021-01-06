import Joi from 'joi';

export const createSchema = Joi.object({
  text: Joi.string().trim(),
  stars: Joi.number().required(),
  productId: Joi.number().required(),
  userId: Joi.number().required()
});

export const listSchema = Joi.object({
  productId: Joi.number().required(),
  userId: Joi.number()
});
