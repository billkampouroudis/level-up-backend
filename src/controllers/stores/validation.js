import Joi from 'joi';
import rules from '../../constants/validation';
import { createSchema as createUserSchema } from '../user/validation';

export const createSchema = Joi.object({
  brandName: Joi.string().trim().required(),

  contactPhone: Joi.string().trim().pattern(rules.phoneRegex).required(),

  contactEmail: Joi.string()
    .trim()
    .pattern(rules.emailRegex)
    .max(rules.defaultMaxLength)
    .required(),

  avatar: Joi.object({
    fieldname: Joi.string(),
    originalname: Joi.string(),
    encoding: Joi.string(),
    mimetype: Joi.string().valid(...rules.defaultFileTypes),
    buffer: Joi.any(),
    size: Joi.number().max(rules.defaultMaxFileSize)
  }).optional(),

  user: createUserSchema
});

export const getSchema = Joi.object({
  storeId: Joi.number().required()
});

export const partialUpdateSchema = Joi.object({
  brandName: Joi.string().trim().optional(),

  contactPhone: Joi.string().trim().pattern(rules.phoneRegex).optional(),

  contactEmail: Joi.string()
    .trim()
    .pattern(rules.emailRegex)
    .max(rules.defaultMaxLength)
    .optional(),

  avatar: Joi.object({
    fieldname: Joi.string(),
    originalname: Joi.string(),
    encoding: Joi.string(),
    mimetype: Joi.string().valid(...rules.defaultFileTypes),
    buffer: Joi.any(),
    size: Joi.number().max(rules.defaultMaxFileSize)
  }).optional()
});

export const deleteSchema = Joi.object({
  storeId: Joi.string().trim().required()
});
