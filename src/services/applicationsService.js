const { randomUUID } = require('crypto');
const pool = require('../config/database');

const applicationSelect = `
  SELECT
    a.id, a.user_id, a.job_id, a.status, a.created_at, a.updated_at,
    j.title, j.description, j.location, j.salary
  FROM applications a
  LEFT JOIN jobs j ON j.id = a.job_id
`;

function serviceError(message, statusCode) {
  const error = new Error(message);
  error.statusCode = statusCode;
  return error;
}

const createApplication = async ({ userId, jobId }) => {
  const job = await pool.query('SELECT id FROM jobs WHERE id = $1', [jobId]);
  if (job.rows.length === 0) {
    throw serviceError('Job tidak ditemukan', 400);
  }

  const id = `application-${randomUUID()}`;
  const result = await pool.query(
    `INSERT INTO applications (id, user_id, job_id, status)
     VALUES ($1, $2, $3, $4)
     RETURNING id, user_id, job_id, status, created_at, updated_at`,
    [id, userId, jobId, 'pending']
  );
  return result.rows[0];
};

// Seluruh lamaran milik user yang sedang login.
const getApplications = async (userId) => {
  const result = await pool.query(
    `${applicationSelect} WHERE a.user_id = $1
     ORDER BY a.created_at DESC, a.id DESC`,
    [userId]
  );
  return result.rows;
};

const getApplicationById = async (id, userId) => {
  const result = await pool.query(
    `${applicationSelect} WHERE a.id = $1 AND a.user_id = $2`,
    [id, userId]
  );
  return result.rows[0] || null;
};

// Filter berdasarkan ID user, tetap membatasi hasil ke akun yang login.
const getApplicationsByUserId = async (targetUserId, requesterUserId) => {
  const result = await pool.query(
    `${applicationSelect} WHERE a.user_id = $1 AND a.user_id = $2
     ORDER BY a.created_at DESC, a.id DESC`,
    [targetUserId, requesterUserId]
  );
  return result.rows;
};

// Filter job tanpa membuka data lamaran pengguna lain.
const getApplicationsByJobId = async (jobId, requesterUserId) => {
  const result = await pool.query(
    `${applicationSelect} WHERE a.job_id = $1 AND a.user_id = $2
     ORDER BY a.created_at DESC, a.id DESC`,
    [jobId, requesterUserId]
  );
  return result.rows;
};

const updateApplication = async ({ id, status, userId }) => {
  const result = await pool.query(
    `UPDATE applications SET status = $1, updated_at = CURRENT_TIMESTAMP
     WHERE id = $2 AND user_id = $3
     RETURNING id, user_id, job_id, status, created_at, updated_at`,
    [status, id, userId]
  );
  return result.rows[0] || null;
};

const deleteApplication = async (id, userId) => {
  const result = await pool.query(
    'DELETE FROM applications WHERE id = $1 AND user_id = $2 RETURNING id',
    [id, userId]
  );
  return result.rows[0] || null;
};

module.exports = {
  createApplication,
  getApplications,
  getApplicationById,
  getApplicationsByUserId,
  getApplicationsByJobId,
  updateApplication,
  deleteApplication,
};
