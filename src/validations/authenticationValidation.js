const Joi = require('joi');

const loginValidation = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required(),
});

const refreshTokenValidation = Joi.object({
  refreshToken: Joi.string().required(),
});

module.exports = {
  loginValidation,
  refreshTokenValidation,
};