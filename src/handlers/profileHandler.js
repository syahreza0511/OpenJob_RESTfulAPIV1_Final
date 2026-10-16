const { getUserById } = require('../services/usersService');
const { getApplications } = require('../services/applicationsService');
const { getBookmarks } = require('../services/bookmarksService');

function sendServerError(res, error) {
  console.error('Kesalahan endpoint Profile:', error);
  return res.status(500).json({
    status: 'error',
    message: 'Terjadi kesalahan pada server',
  });
}

// GET /profile
const getProfileHandler = async (req, res) => {
  try {
    const user = await getUserById(req.user.id);

    if (!user) {
      return res.status(404).json({
        status: 'failed',
        message: 'Pengguna tidak ditemukan',
      });
    }

    return res.status(200).json({
      status: 'success',
      data: {
        id: user.id,
        name: user.username,
        email: user.email,
        // Pada skema users OpenJob V1 tidak ada kolom role.
        // Semua akun yang terdaftar memiliki peran dasar 'user'.
        role: 'user',
      },
    });
  } catch (error) {
    return sendServerError(res, error);
  }
};

// GET /profile/applications
const getProfileApplicationsHandler = async (req, res) => {
  try {
    // Service sudah membatasi data berdasarkan user ID dari JWT.
    const applications = await getApplications(req.user.id);

    return res.status(200).json({
      status: 'success',
      data: { applications },
    });
  } catch (error) {
    return sendServerError(res, error);
  }
};

// GET /profile/bookmarks
const getProfileBookmarksHandler = async (req, res) => {
  try {
    // Service sudah membatasi data berdasarkan user ID dari JWT.
    const bookmarks = await getBookmarks(req.user.id);

    return res.status(200).json({
      status: 'success',
      data: { bookmarks },
    });
  } catch (error) {
    return sendServerError(res, error);
  }
};

module.exports = {
  getProfileHandler,
  getProfileApplicationsHandler,
  getProfileBookmarksHandler,
};
