const Joi = require('joi');

const jobPayloadValidation = Joi.object({
  company_id: Joi.string().trim().required(),
  category_id: Joi.string().trim().required(),
  title: Joi.string().trim().min(3).max(100).required(),
  description: Joi.string().trim().min(1).required(),
  job_type: Joi.string().trim().min(1).max(50).required(),
  experience_level: Joi.string().trim().min(1).max(50).required(),
  location_type: Joi.string().trim().min(1).max(50).required(),
  location_city: Joi.string().trim().min(1).max(100).required(),
  salary_min: Joi.number().integer().min(0).required(),
  salary_max: Joi.number().integer().min(Joi.ref('salary_min')).required(),
  is_salary_visible: Joi.boolean().required(),
  status: Joi.string().trim().min(1).max(30).required(),
}).unknown(false);

// Setup Applications pada collection tidak mengirim lokasi dan gaji.
// Field inti tetap wajib; field tambahan boleh tidak tersedia ketika membuat job.
const createJobValidation = jobPayloadValidation.fork(
  ['location_city', 'salary_min', 'salary_max', 'is_salary_visible'],
  (schema) => schema.optional()
);

module.exports = {
  createJobValidation,
  updateJobValidation: jobPayloadValidation,
};
