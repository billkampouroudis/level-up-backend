import Joi from 'joi';

export const createSchema = Joi.object({
  quantity: Joi.number().required(),

  productId: Joi.number().required(),

  size: Joi.required()
});

export const getSchema = Joi.object({
  storeId: Joi.number().required()
});

export const partialUpdateSchema = Joi.object({
  storeId: Joi.string().trim().required(),

  quantity: Joi.number().optional(),

  price: Joi.number().optional()
});

export const deleteSchema = Joi.object({
  storeId: Joi.string().trim().required()
});
