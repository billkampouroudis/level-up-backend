const Joi = require('joi');
const rules = require('../../constants/validation');

export const createSchema = Joi.object({
  name: Joi.string().trim().required(),

  description: Joi.string().trim(),

  originalPrice: Joi.number().required(),

  discountLevel: Joi.number(),

  sizes: Joi.string().trim().required(),

  image: Joi.object({
    fieldname: Joi.string(),
    originalname: Joi.string(),
    encoding: Joi.string(),
    mimetype: Joi.string().valid(...rules.defaultFileTypes),
    buffer: Joi.any(),
    size: Joi.number().max(rules.defaultMaxFileSize)
  }).optional()
});

export const getSchema = Joi.object({
  productId: Joi.string().trim().required()
});

export const partialUpdateSchema = Joi.object({
  name: Joi.string().trim().optional(),

  description: Joi.string().trim().optional(),

  originalPrice: Joi.number().optional(),

  discountLevel: Joi.number().optional(),

  sizes: Joi.string().trim().optional(),

  image: Joi.object({
    fieldname: Joi.string(),
    originalname: Joi.string(),
    encoding: Joi.string(),
    mimetype: Joi.string().valid(...rules.defaultFileTypes),
    buffer: Joi.any(),
    size: Joi.number().max(rules.defaultMaxFileSize)
  }).optional()
});

export const deleteSchema = Joi.object({
  productId: Joi.string().trim().required()
});
