const bookmarksService = require('../services/bookmarksService');

const notFound = (res) => res.status(404).json({
  status: 'failed',
  message: 'Bookmark tidak ditemukan',
});

const handleError = (res, error) => {
  if (error.statusCode) {
    return res.status(error.statusCode).json({
      status: 'failed',
      message: error.message,
    });
  }
  console.error('Kesalahan Bookmarks:', error);
  return res.status(500).json({
    status: 'error',
    message: 'Terjadi kesalahan pada server',
  });
};

// POST /jobs/:jobId/bookmark (collection Dicoding)
const postJobBookmarkHandler = async (req, res) => {
  try {
    const bookmark = await bookmarksService.createBookmark({
      user_id: req.user.id,
      job_id: req.params.jobId,
    });
    return res.status(201).json({
      status: 'success',
      data: { id: bookmark.id },
    });
  } catch (error) {
    return handleError(res, error);
  }
};

// GET /bookmarks
const getBookmarksHandler = async (req, res) => {
  try {
    const bookmarks = await bookmarksService.getBookmarks(req.user.id);
    return res.status(200).json({
      status: 'success',
      data: { bookmarks },
    });
  } catch (error) {
    return handleError(res, error);
  }
};

// GET /jobs/:jobId/bookmark/:bookmarkId (collection Dicoding)
const getJobBookmarkByIdHandler = async (req, res) => {
  try {
    const bookmark = await bookmarksService.getBookmarkByJobAndId(
      req.params.jobId,
      req.params.bookmarkId,
      req.user.id
    );
    if (!bookmark) return notFound(res);
    return res.status(200).json({
      status: 'success',
      data: bookmark,
    });
  } catch (error) {
    return handleError(res, error);
  }
};

// DELETE /jobs/:jobId/bookmark (collection Dicoding)
const deleteJobBookmarkHandler = async (req, res) => {
  try {
    const deleted = await bookmarksService.deleteBookmarkByJob(
      req.params.jobId,
      req.user.id
    );
    if (!deleted) return notFound(res);
    return res.status(200).json({
      status: 'success',
      message: 'Bookmark berhasil dihapus',
    });
  } catch (error) {
    return handleError(res, error);
  }
};

// Pertahankan endpoint lama sebagai kompatibilitas.
const createBookmarkHandler = async (req, res) => {
  try {
    const bookmark = await bookmarksService.createBookmark({
      user_id: req.user.id,
      job_id: req.body.job_id,
    });
    return res.status(201).json({
      status: 'success',
      data: { id: bookmark.id },
    });
  } catch (error) {
    return handleError(res, error);
  }
};

const getBookmarkByIdHandler = async (req, res) => {
  try {
    const bookmark = await bookmarksService.getBookmarkById(
      req.params.id,
      req.user.id
    );
    if (!bookmark) return notFound(res);
    return res.status(200).json({
      status: 'success',
      data: bookmark,
    });
  } catch (error) {
    return handleError(res, error);
  }
};

const deleteBookmarkHandler = async (req, res) => {
  try {
    const bookmark = await bookmarksService.deleteBookmark(
      req.params.id,
      req.user.id
    );
    if (!bookmark) return notFound(res);
    return res.status(200).json({
      status: 'success',
      message: 'Bookmark berhasil dihapus',
    });
  } catch (error) {
    return handleError(res, error);
  }
};

module.exports = {
  postJobBookmarkHandler,
  getBookmarksHandler,
  getJobBookmarkByIdHandler,
  deleteJobBookmarkHandler,
  createBookmarkHandler,
  getBookmarkByIdHandler,
  deleteBookmarkHandler,
};
