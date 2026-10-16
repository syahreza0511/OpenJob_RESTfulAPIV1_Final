const Joi = require('joi');




// CREATE BOOKMARK VALIDATION

const createBookmarkValidation = Joi.object({

    job_id: Joi
        .string()
        .required()
        .messages({

            'string.empty':
            'Job ID tidak boleh kosong',

            'any.required':
            'Job ID wajib diisi'

        })

});





module.exports = {

    createBookmarkValidation

};