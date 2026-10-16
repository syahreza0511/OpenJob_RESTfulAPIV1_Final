const { randomUUID } = require('crypto');
const pool = require('../config/database');

const bookmarkSelect = `
  SELECT b.id, b.user_id, b.job_id, b.created_at, b.updated_at,
         j.title, j.description, j.location, j.salary
  FROM bookmarks b
  JOIN jobs j ON j.id = b.job_id
`;

function httpError(message, statusCode) {
  const error = new Error(message);
  error.statusCode = statusCode;
  return error;
}

// Tambahkan lowongan ke bookmark milik pengguna yang terautentikasi.
const createBookmark = async ({ user_id, job_id }) => {
  const existingJob = await pool.query('SELECT id FROM jobs WHERE id = $1', [job_id]);
  if (existingJob.rows.length === 0) {
    throw httpError('Job tidak ditemukan', 404);
  }

  const existingBookmark = await pool.query(
    'SELECT id FROM bookmarks WHERE user_id = $1 AND job_id = $2',
    [user_id, job_id]
  );
  if (existingBookmark.rows.length > 0) {
    throw httpError('Job sudah ada di bookmark', 409);
  }

  try {
    const result = await pool.query(
      `INSERT INTO bookmarks (id, user_id, job_id)
       VALUES ($1, $2, $3)
       RETURNING id, user_id, job_id, created_at, updated_at`,
      [`bookmark-${randomUUID()}`, user_id, job_id]
    );
    return result.rows[0];
  } catch (error) {
    if (error.code === '23505') {
      throw httpError('Job sudah ada di bookmark', 409);
    }
    if (error.code === '23503') {
      throw httpError('Job atau pengguna tidak ditemukan', 404);
    }
    throw error;
  }
};

const getBookmarks = async (user_id) => {
  const result = await pool.query(
    `${bookmarkSelect}
     WHERE b.user_id = $1
     ORDER BY b.created_at DESC, b.id DESC`,
    [user_id]
  );
  return result.rows;
};

// Dipakai oleh endpoint lama GET /bookmarks/:id.
const getBookmarkById = async (id, user_id) => {
  const result = await pool.query(
    `${bookmarkSelect}
     WHERE b.id = $1 AND b.user_id = $2`,
    [id, user_id]
  );
  return result.rows[0] || null;
};

// Dipakai oleh collection Dicoding GET /jobs/:jobId/bookmark/:bookmarkId.
const getBookmarkByJobAndId = async (job_id, bookmark_id, user_id) => {
  const result = await pool.query(
    `${bookmarkSelect}
     WHERE b.job_id = $1 AND b.id = $2 AND b.user_id = $3`,
    [job_id, bookmark_id, user_id]
  );
  return result.rows[0] || null;
};

// Dipakai oleh endpoint lama DELETE /bookmarks/:id.
const deleteBookmark = async (id, user_id) => {
  const result = await pool.query(
    `DELETE FROM bookmarks
     WHERE id = $1 AND user_id = $2
     RETURNING id`,
    [id, user_id]
  );
  return result.rows[0] || null;
};

// Dipakai oleh collection Dicoding DELETE /jobs/:jobId/bookmark.
const deleteBookmarkByJob = async (job_id, user_id) => {
  const result = await pool.query(
    `DELETE FROM bookmarks
     WHERE job_id = $1 AND user_id = $2
     RETURNING id`,
    [job_id, user_id]
  );
  return result.rows[0] || null;
};

module.exports = {
  createBookmark,
  getBookmarks,
  getBookmarkById,
  getBookmarkByJobAndId,
  deleteBookmark,
  deleteBookmarkByJob,
};
