const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const validate = require('../middleware/validationMiddleware');
const {
  createJobValidation,
  updateJobValidation,
} = require('../validations/jobValidation');
const {
  postJobHandler,
  getJobsHandler,
  getJobsByCompanyIdHandler,
  getJobsByCategoryIdHandler,
  getJobByIdHandler,
  putJobHandler,
  deleteJobHandler,
} = require('../handlers/jobsHandler');
const {
  postJobBookmarkHandler,
  getJobBookmarkByIdHandler,
  deleteJobBookmarkHandler,
} = require('../handlers/bookmarksHandler');

// Jobs: rute yang sudah lolos Fase 5 dan Fase 6 tidak diubah.
router.post('/', authMiddleware, validate(createJobValidation), postJobHandler);
router.get('/', getJobsHandler);
router.get('/company/:id', getJobsByCompanyIdHandler);
router.get('/category/:id', getJobsByCategoryIdHandler);

// Bookmarks: URL yang dipakai collection Dicoding.
// Diletakkan sebelum /:id agar tidak ambigu.
router.post('/:jobId/bookmark', authMiddleware, postJobBookmarkHandler);
router.get('/:jobId/bookmark/:bookmarkId', authMiddleware, getJobBookmarkByIdHandler);
router.delete('/:jobId/bookmark', authMiddleware, deleteJobBookmarkHandler);

router.get('/:id', getJobByIdHandler);
router.put('/:id', authMiddleware, validate(updateJobValidation), putJobHandler);
router.delete('/:id', authMiddleware, deleteJobHandler);

module.exports = router;
