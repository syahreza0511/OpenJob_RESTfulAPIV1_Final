require('dotenv').config();

const jwt = require('jsonwebtoken');

const authMiddleware = (req, res, next) => {
  const authorization = req.headers.authorization;

  if (!authorization) {
    return res.status(401).json({
      status: 'failed',
      message: 'Token tidak ditemukan',
    });
  }

  const parts = authorization.split(' ');

  if (
    parts.length !== 2 ||
    parts[0] !== 'Bearer' ||
    !parts[1]
  ) {
    return res.status(401).json({
      status: 'failed',
      message: 'Format token tidak valid',
    });
  }

  try {
    req.user = jwt.verify(
      parts[1],
      process.env.ACCESS_TOKEN_KEY
    );

    return next();
  } catch (error) {
    return res.status(401).json({
      status: 'failed',
      message: 'Token tidak valid',
    });
  }
};

module.exports = authMiddleware;