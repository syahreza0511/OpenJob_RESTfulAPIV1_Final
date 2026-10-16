const {
  createAuthentication,
  refreshAuthentication,
  deleteAuthentication,
} = require('../services/authenticationsService');

function sendAuthenticationError(res, error) {
  const statusCode = error.statusCode || 500;

  if (statusCode === 500) {
    console.error('Kesalahan autentikasi:', error);
  }

  return res.status(statusCode).json({
    status: statusCode === 500 ? 'error' : 'failed',
    message:
      statusCode === 500
        ? 'Terjadi kesalahan pada server'
        : error.message,
  });
}

// POST /authentications
const postAuthenticationHandler = async (req, res) => {
  try {
    const {
      accessToken,
      refreshToken,
    } = await createAuthentication(req.body);

    return res.status(200).json({
      status: 'success',
      data: {
        accessToken,
        refreshToken,
      },
    });
  } catch (error) {
    return sendAuthenticationError(res, error);
  }
};

// PUT /authentications
const putAuthenticationHandler = async (req, res) => {
  try {
    const accessToken = await refreshAuthentication(
      req.body.refreshToken
    );

    return res.status(200).json({
      status: 'success',
      data: {
        accessToken,
      },
    });
  } catch (error) {
    return sendAuthenticationError(res, error);
  }
};

// DELETE /authentications
const deleteAuthenticationHandler = async (req, res) => {
  try {
    await deleteAuthentication(req.body.refreshToken);

    return res.status(200).json({
      status: 'success',
      message: 'Refresh token berhasil dihapus',
    });
  } catch (error) {
    return sendAuthenticationError(res, error);
  }
};

module.exports = {
  postAuthenticationHandler,
  putAuthenticationHandler,
  deleteAuthenticationHandler,
};