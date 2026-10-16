const { randomUUID } = require('crypto');
const pool = require('../config/database');

const createCompany = async ({ name, description = null, location }) => {
  const id = `company-${randomUUID()}`;
  const result = await pool.query(
    `INSERT INTO companies (id, name, description, location)
     VALUES ($1, $2, $3, $4)
     RETURNING id, name, description, location, created_at, updated_at`,
    [id, name, description, location]
  );
  return result.rows[0];
};

const getCompanies = async () => {
  const result = await pool.query(
    `SELECT id, name, description, location, created_at, updated_at
     FROM companies ORDER BY created_at DESC`
  );
  return result.rows;
};

const getCompanyById = async (id) => {
  const result = await pool.query(
    `SELECT id, name, description, location, created_at, updated_at
     FROM companies WHERE id = $1`,
    [id]
  );
  return result.rows[0];
};

const updateCompany = async ({ id, name, description, location }) => {
  const result = await pool.query(
    `UPDATE companies SET
       name = COALESCE($1, name),
       description = COALESCE($2, description),
       location = COALESCE($3, location),
       updated_at = CURRENT_TIMESTAMP
     WHERE id = $4
     RETURNING id, name, description, location, created_at, updated_at`,
    [name ?? null, description ?? null, location ?? null, id]
  );
  return result.rows[0];
};

const deleteCompany = async (id) => {
  const result = await pool.query(
    'DELETE FROM companies WHERE id = $1 RETURNING id',
    [id]
  );
  return result.rows[0];
};

module.exports = {
  createCompany,
  getCompanies,
  getCompanyById,
  updateCompany,
  deleteCompany,
};
