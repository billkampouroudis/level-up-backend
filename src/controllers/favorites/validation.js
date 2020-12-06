import Joi from 'joi';

export const createSchema = Joi.object({
  productId: Joi.number().required()
});

export const getSchema = Joi.object({
  productId: Joi.number().required()
});

export const deleteSchema = Joi.object({
  productId: Joi.number().required()
});
