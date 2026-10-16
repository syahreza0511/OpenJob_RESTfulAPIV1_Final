const express = require('express');
const authMiddleware = require('../middleware/authMiddleware');
const {
  getProfileHandler,
  getProfileApplicationsHandler,
  getProfileBookmarksHandler,
} = require('../handlers/profileHandler');

const router = express.Router();

// Seluruh endpoint Profile hanya dapat diakses oleh pengguna yang login.
router.use(authMiddleware);

router.get('/', getProfileHandler);
router.get('/applications', getProfileApplicationsHandler);
router.get('/bookmarks', getProfileBookmarksHandler);

module.exports = router;
