const Joi = require('joi');

// user_id diterima demi kompatibilitas kontrak Postman, tetapi identitas
// pemohon tetap diambil dari access token (bukan dari body request).
const createApplicationValidation = Joi.object({
  user_id: Joi.string().trim().min(1).optional(),
  job_id: Joi.string().trim().min(1).required(),
  status: Joi.string().valid('pending', 'accepted', 'rejected').optional(),
}).unknown(false);

const updateApplicationValidation = Joi.object({
  status: Joi.string().valid('pending', 'accepted', 'rejected').required(),
}).unknown(false);

module.exports = { createApplicationValidation, updateApplicationValidation };
