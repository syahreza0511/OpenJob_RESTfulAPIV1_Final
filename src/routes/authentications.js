const express = require('express');

const router = express.Router();


const {
    postAuthenticationHandler,
    putAuthenticationHandler,
    deleteAuthenticationHandler
} = require('../handlers/authenticationsHandler');


const validate = require('../middleware/validationMiddleware');


const {
    loginValidation,
    refreshTokenValidation
} = require('../validations/authenticationValidation');




// ================================
// LOGIN
// POST /authentications
// ================================

router.post(

    '/',

    validate(loginValidation),

    postAuthenticationHandler

);




// ================================
// REFRESH TOKEN
// PUT /authentications
// ================================

router.put(

    '/',

    validate(refreshTokenValidation),

    putAuthenticationHandler

);




// ================================
// DELETE TOKEN / LOGOUT
// DELETE /authentications
// ================================

router.delete(

    '/',

    validate(refreshTokenValidation),

    deleteAuthenticationHandler

);



module.exports = router;