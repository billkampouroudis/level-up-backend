import Joi from 'joi';

export const createSchema = Joi.object({
  firstName: Joi.string().trim().required(),
  lastName: Joi.string().trim().required(),
  street: Joi.string().trim().required(),
  number: Joi.number().required(),
  zipCode: Joi.string().trim().required(),
  city: Joi.string().trim().required(),
  country: Joi.string().trim().required(),
  floor: Joi.number().required(),
  userId: Joi.number(),
  storeId: Joi.number()
}).or('userId', 'storeId');

export const getSchema = Joi.object({
  addressId: Joi.number().required()
});

export const partialUpdateSchema = Joi.object({
  firstName: Joi.string().trim(),
  lastName: Joi.string().trim(),
  street: Joi.string().trim(),
  number: Joi.number(),
  zipCode: Joi.string().trim(),
  city: Joi.string().trim(),
  country: Joi.string().trim(),
  floor: Joi.number()
});

export const deleteSchema = Joi.object({
  addressId: Joi.string().trim().required()
});
