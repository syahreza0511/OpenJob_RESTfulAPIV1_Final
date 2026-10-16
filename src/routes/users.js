const express = require('express');
const router = express.Router();

const authMiddleware = require('../middleware/authMiddleware');
const validate = require('../middleware/validationMiddleware');
const { createUserValidation } = require('../validations/userValidation');

const {
  postUserHandler,
  getUsersHandler,
  getUserByIdHandler,
  putUserHandler,
  deleteUserHandler,
} = require('../handlers/usersHandler');

// POST /users - registrasi publik
router.post(
  '/',
  validate(createUserValidation),
  postUserHandler
);

// GET /users - membutuhkan autentikasi
router.get(
  '/',
  authMiddleware,
  getUsersHandler
);

// GET /users/:id - publik sesuai pengujian mandatory
router.get(
  '/:id',
  getUserByIdHandler
);

// PUT /users/:id
router.put(
  '/:id',
  authMiddleware,
  putUserHandler
);

// DELETE /users/:id
router.delete(
  '/:id',
  authMiddleware,
  deleteUserHandler
);

module.exports = router;