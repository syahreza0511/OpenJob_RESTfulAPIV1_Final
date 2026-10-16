require('dotenv').config();

const { randomUUID } = require('crypto');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const pool = require('../config/database');

function authenticationError(message, statusCode) {
  const error = new Error(message);
  error.statusCode = statusCode;
  return error;
}

// POST /authentications
const createAuthentication = async ({ email, password }) => {
  const result = await pool.query(
    'SELECT id, password FROM users WHERE email = $1',
    [email]
  );

  const user = result.rows[0];

  if (!user) {
    throw authenticationError(
      'Email atau password salah',
      401
    );
  }

  const isPasswordValid = await bcrypt.compare(
    password,
    user.password
  );

  if (!isPasswordValid) {
    throw authenticationError(
      'Email atau password salah',
      401
    );
  }

  const accessToken = jwt.sign(
    { id: user.id },
    process.env.ACCESS_TOKEN_KEY,
    { expiresIn: '1h' }
  );

  const refreshToken = jwt.sign(
    { id: user.id },
    process.env.REFRESH_TOKEN_KEY,
    { expiresIn: '7d' }
  );

  await pool.query(
    'INSERT INTO authentications (id, refresh_token) VALUES ($1, $2)',
    [`auth-${randomUUID()}`, refreshToken]
  );

  return { accessToken, refreshToken };
};

// PUT /authentications
const refreshAuthentication = async (refreshToken) => {
  const result = await pool.query(
    'SELECT refresh_token FROM authentications WHERE refresh_token = $1',
    [refreshToken]
  );

  if (result.rows.length === 0) {
    throw authenticationError(
      'Refresh token tidak valid',
      400
    );
  }

  let payload;

  try {
    payload = jwt.verify(
      refreshToken,
      process.env.REFRESH_TOKEN_KEY
    );
  } catch (error) {
    if (
      error instanceof jwt.JsonWebTokenError ||
      error instanceof jwt.TokenExpiredError
    ) {
      throw authenticationError(
        'Refresh token tidak valid atau kedaluwarsa',
        400
      );
    }

    throw error;
  }

  return jwt.sign(
    { id: payload.id },
    process.env.ACCESS_TOKEN_KEY,
    { expiresIn: '1h' }
  );
};

// DELETE /authentications
const deleteAuthentication = async (refreshToken) => {
  const result = await pool.query(
    'DELETE FROM authentications WHERE refresh_token = $1 RETURNING id',
    [refreshToken]
  );

  if (result.rows.length === 0) {
    throw authenticationError(
      'Refresh token tidak ditemukan',
      400
    );
  }
};

module.exports = {
  createAuthentication,
  refreshAuthentication,
  deleteAuthentication,
};