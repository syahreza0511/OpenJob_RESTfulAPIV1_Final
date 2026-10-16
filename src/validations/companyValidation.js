const Joi = require('joi');

// Kontrak POST /companies: name dan location wajib, description opsional.
const createCompanyValidation = Joi.object({
  name: Joi.string().trim().min(1).required(),
  location: Joi.string().trim().min(1).required(),
  description: Joi.string().allow('').optional(),
}).unknown(false);

// PUT boleh memperbarui satu atau lebih properti yang valid.
const updateCompanyValidation = Joi.object({
  name: Joi.string().trim().min(1),
  location: Joi.string().trim().min(1),
  description: Joi.string().allow(''),
}).min(1).unknown(false);

module.exports = {
  createCompanyValidation,
  updateCompanyValidation,
};
