import Joi from 'joi';
import rules from '../../constants/validation';

const schema = Joi.object({
  fistName: Joi.string()
    .trim()
    .pattern(rules.nameRegex)
    .max(rules.defaultMaxLength)
    .required(),

  lastName: Joi.string()
    .trim()
    .pattern(rules.nameRegex)
    .max(rules.defaultMaxLength)
    .required(),

  email: Joi.string()
    .trim()
    .pattern(rules.emailRegex)
    .max(rules.defaultMaxLength)
    .required(),

  mobileNumberCode: Joi.string().trim(),

  mobileNumber: Joi.string().trim().pattern(rules.phoneRegex),

  password: Joi.string().min(rules.defaultPasswordLength),

  avatar: Joi.object({
    fieldname: Joi.string(),
    originalname: Joi.string(),
    encoding: Joi.string(),
    mimetype: Joi.string().valid(...rules.defaultFileTypes),
    buffer: Joi.any(),
    size: Joi.number().max(rules.defaultMaxFileSize)
  }).optional()
});

module.exports = schema;
