const { randomUUID } = require('crypto');
const pool = require('../config/database');

// Tetap mengisi kolom location dan salary versi lama. Kedua kolom itu
// masih dipakai Applications dan Bookmarks dari proyek sebelumnya.
const createJob = async (payload) => {
  const id = `job-${randomUUID()}`;
  // Tabel lama mewajibkan location dan salary; setup Applications tidak
  // menyertakan field lokasi/gaji. Gunakan fallback hanya saat membuat job.
  const location = payload.location_city ?? 'Tidak ditentukan';
  const salary = payload.salary_min ?? 0;
  const salaryMax = payload.salary_max ?? salary;
  const salaryVisible = payload.is_salary_visible ?? false;
  const result = await pool.query(
    `INSERT INTO jobs (
      id, company_id, category_id, title, description, location, salary,
      job_type, experience_level, location_type, location_city,
      salary_min, salary_max, is_salary_visible, status
    ) VALUES (
      $1, $2, $3, $4, $5, $6, $7,
      $8, $9, $10, $11, $12, $13, $14, $15
    ) RETURNING *`,
    [
      id, payload.company_id, payload.category_id, payload.title,
      payload.description, location, salary,
      payload.job_type, payload.experience_level, payload.location_type,
      payload.location_city ?? null, salary, salaryMax,
      salaryVisible, payload.status,
    ]
  );
  return result.rows[0];
};

const getJobs = async ({ page = 1, limit = 10, location, category_id, search, title, companyName } = {}) => {
  const validPage = Math.max(1, Number.parseInt(page, 10) || 1);
  const validLimit = Math.min(100, Math.max(1, Number.parseInt(limit, 10) || 10));
  const conditions = [];
  const params = [];
  const addCondition = (sql, value) => {
    params.push(value);
    conditions.push(sql.replace('?', `$${params.length}`));
  };

  if (location) addCondition('COALESCE(j.location_city, j.location) ILIKE ?', `%${location}%`);
  if (category_id) addCondition('j.category_id = ?', category_id);
  // Filter pencarian legacy mencocokkan judul maupun deskripsi.
  if (search) {
    params.push(`%${search}%`);
    const a = params.length;
    params.push(`%${search}%`);
    const b = params.length;
    conditions.push(`(j.title ILIKE $${a} OR j.description ILIKE $${b})`);
  }
  if (title) addCondition('j.title ILIKE ?', `%${title}%`);
  if (companyName) addCondition('c.name ILIKE ?', `%${companyName}%`);

  const where = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';
  const from = 'FROM jobs j LEFT JOIN companies c ON c.id = j.company_id';
  const totalResult = await pool.query(
    `SELECT COUNT(*) AS count ${from} ${where}`,
    params
  );
  const total = Number(totalResult.rows[0].count);
  const rowsResult = await pool.query(
    `SELECT j.*, c.name AS company_name ${from} ${where}
     ORDER BY j.created_at DESC, j.id DESC
     LIMIT $${params.length + 1} OFFSET $${params.length + 2}`,
    [...params, validLimit, (validPage - 1) * validLimit]
  );
  return {
    jobs: rowsResult.rows,
    pagination: {
      page: validPage,
      limit: validLimit,
      total,
      totalPages: Math.ceil(total / validLimit),
    },
  };
};

const getJobsByCompanyId = async (companyId) => {
  const result = await pool.query(
    `SELECT j.*, c.name AS company_name
     FROM jobs j LEFT JOIN companies c ON c.id = j.company_id
     WHERE j.company_id = $1
     ORDER BY j.created_at DESC, j.id DESC`,
    [companyId]
  );
  return result.rows;
};

const getJobsByCategoryId = async (categoryId) => {
  const result = await pool.query(
    `SELECT j.*, c.name AS company_name
     FROM jobs j LEFT JOIN companies c ON c.id = j.company_id
     WHERE j.category_id = $1
     ORDER BY j.created_at DESC, j.id DESC`,
    [categoryId]
  );
  return result.rows;
};

const getJobById = async (id) => {
  const result = await pool.query(
    `SELECT j.*, c.name AS company_name
     FROM jobs j LEFT JOIN companies c ON c.id = j.company_id
     WHERE j.id = $1`,
    [id]
  );
  return result.rows[0] || null;
};

const updateJob = async ({ id, ...payload }) => {
  const result = await pool.query(
    `UPDATE jobs SET
       company_id = $1, category_id = $2, title = $3, description = $4,
       location = $5, salary = $6, job_type = $7, experience_level = $8,
       location_type = $9, location_city = $10, salary_min = $11,
       salary_max = $12, is_salary_visible = $13, status = $14,
       updated_at = CURRENT_TIMESTAMP
     WHERE id = $15 RETURNING *`,
    [
      payload.company_id, payload.category_id, payload.title,
      payload.description, payload.location_city, payload.salary_min,
      payload.job_type, payload.experience_level, payload.location_type,
      payload.location_city, payload.salary_min, payload.salary_max,
      payload.is_salary_visible, payload.status, id,
    ]
  );
  return result.rows[0] || null;
};

const deleteJob = async (id) => {
  const result = await pool.query('DELETE FROM jobs WHERE id = $1 RETURNING id', [id]);
  return result.rows[0] || null;
};

module.exports = {
  createJob,
  getJobs,
  getJobsByCompanyId,
  getJobsByCategoryId,
  getJobById,
  updateJob,
  deleteJob,
};
