const express = require('express');
const router = express.Router();

const authMiddleware = require('../middleware/authMiddleware');
const validate = require('../middleware/validationMiddleware');
const {
  createCategoryValidation,
  updateCategoryValidation,
} = require('../validations/categoryValidation');
const {
  postCategoryHandler,
  getCategoriesHandler,
  getCategoryByIdHandler,
  putCategoryHandler,
  deleteCategoryHandler,
} = require('../handlers/categoriesHandler');

// Pengelolaan kategori memerlukan token; pembacaan kategori bersifat publik.
router.post('/', authMiddleware, validate(createCategoryValidation), postCategoryHandler);
router.get('/', getCategoriesHandler);
router.get('/:id', getCategoryByIdHandler);
router.put('/:id', authMiddleware, validate(updateCategoryValidation), putCategoryHandler);
router.delete('/:id', authMiddleware, deleteCategoryHandler);

module.exports = router;
