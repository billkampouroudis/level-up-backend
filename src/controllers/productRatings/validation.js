import Joi from 'joi';

export const createSchema = Joi.object({
  text: Joi.string().trim().allow(null, ''),
  stars: Joi.number().required(),
  productId: Joi.number().required(),
  userId: Joi.number().required()
});

export const listSchema = Joi.object({
  productId: Joi.alternatives()
    .try(Joi.array().min(1).items(Joi.number()), Joi.number())
    .required(),
  userId: Joi.number(),
  page: Joi.number(),
  pageSize: Joi.number()
});
