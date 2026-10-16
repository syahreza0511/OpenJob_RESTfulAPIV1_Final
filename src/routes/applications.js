const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const validate = require('../middleware/validationMiddleware');
const {
  createApplicationValidation,
  updateApplicationValidation,
} = require('../validations/applicationValidation');
const {
  postApplicationHandler,
  getApplicationsHandler,
  getApplicationByIdHandler,
  getApplicationsByUserIdHandler,
  getApplicationsByJobIdHandler,
  putApplicationHandler,
  deleteApplicationHandler,
} = require('../handlers/applicationsHandler');

// Semua endpoint Applications memerlukan access token.
router.use(authMiddleware);

router.post('/', validate(createApplicationValidation), postApplicationHandler);
router.get('/', getApplicationsHandler);

// Urutan route penting: '/user/:id' dan '/job/:id' sebelum '/:id'.
router.get('/user/:id', getApplicationsByUserIdHandler);
router.get('/job/:id', getApplicationsByJobIdHandler);
router.get('/:id', getApplicationByIdHandler);

router.put('/:id', validate(updateApplicationValidation), putApplicationHandler);
router.delete('/:id', deleteApplicationHandler);

module.exports = router;
