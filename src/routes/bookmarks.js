const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const validate = require('../middleware/validationMiddleware');
const { createBookmarkValidation } = require('../validations/bookmarkValidation');
const {
  createBookmarkHandler,
  getBookmarksHandler,
  getBookmarkByIdHandler,
  deleteBookmarkHandler,
} = require('../handlers/bookmarksHandler');

// Semua endpoint di sini hanya untuk pengguna terautentikasi.
router.use(authMiddleware);

// GET /bookmarks dipakai oleh collection Dicoding.
router.get('/', getBookmarksHandler);

// Endpoint lama tetap dapat digunakan oleh client lain.
router.post('/', validate(createBookmarkValidation), createBookmarkHandler);
router.get('/:id', getBookmarkByIdHandler);
router.delete('/:id', deleteBookmarkHandler);

module.exports = router;
