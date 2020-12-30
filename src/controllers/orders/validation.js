import Joi from 'joi';
// import rules from '../../constants/validation';

export const createSchema = Joi.object({
  storeId: Joi.number().required()
});

export const getSchema = Joi.object({
  orderId: Joi.number().required()
});

export const partialUpdateSchema = Joi.object({
  orderId: Joi.number().required(),
  status: Joi.string(),
  addressId: Joi.number()
});

export const partialUpdateMultipleSchema = Joi.object({
  status: Joi.string(),
  addressId: Joi.number(),
  orderIds: Joi.array().items(Joi.number()).required()
});

export const deleteSchema = Joi.object({
  orderId: Joi.string().trim().required()
});
