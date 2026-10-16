const express = require('express');
const router = express.Router();

const authMiddleware = require('../middleware/authMiddleware');
const validate = require('../middleware/validationMiddleware');
const {
  createCompanyValidation,
  updateCompanyValidation,
} = require('../validations/companyValidation');
const {
  postCompanyHandler,
  getCompaniesHandler,
  getCompanyByIdHandler,
  putCompanyHandler,
  deleteCompanyHandler,
} = require('../handlers/companiesHandler');

// Penulisan data memerlukan token, sedangkan pembacaan data bersifat publik.
router.post('/', authMiddleware, validate(createCompanyValidation), postCompanyHandler);
router.get('/', getCompaniesHandler);
router.get('/:id', getCompanyByIdHandler);
router.put('/:id', authMiddleware, validate(updateCompanyValidation), putCompanyHandler);
router.delete('/:id', authMiddleware, deleteCompanyHandler);

module.exports = router;
