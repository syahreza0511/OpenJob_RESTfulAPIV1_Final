const Joi = require('joi');

// Nama kategori adalah satu-satunya input wajib untuk menambah dan mengubah kategori.
const categoryPayloadSchema = Joi.object({
  name: Joi.string().trim().min(1).max(100).required(),
}).unknown(false);

module.exports = {
  createCategoryValidation: categoryPayloadSchema,
  updateCategoryValidation: categoryPayloadSchema,
};
