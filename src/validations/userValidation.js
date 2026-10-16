const Joi = require('joi');

const createUserValidation = Joi.object({
  name: Joi.string().trim().min(1).required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
  role: Joi.string().optional(),
}).unknown(false);

module.exports = {
  createUserValidation,
};