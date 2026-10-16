const { randomUUID } = require('crypto');
const pool = require('../config/database');

// POST /categories: ID dibuat oleh server, tidak diminta dari pengguna.
const createCategory = async ({ name }) => {
  const id = `category-${randomUUID()}`;
  const result = await pool.query(
    `INSERT INTO categories (id, name)
     VALUES ($1, $2)
     RETURNING id, name, created_at, updated_at`,
    [id, name]
  );

  return result.rows[0];
};

const getCategories = async () => {
  const result = await pool.query(
    `SELECT id, name, created_at, updated_at
     FROM categories
     ORDER BY created_at DESC`
  );

  return result.rows;
};

const getCategoryById = async (id) => {
  const result = await pool.query(
    `SELECT id, name, created_at, updated_at
     FROM categories
     WHERE id = $1`,
    [id]
  );

  return result.rows[0] || null;
};

const updateCategory = async ({ id, name }) => {
  const result = await pool.query(
    `UPDATE categories
     SET name = $1, updated_at = CURRENT_TIMESTAMP
     WHERE id = $2
     RETURNING id, name, created_at, updated_at`,
    [name, id]
  );

  return result.rows[0] || null;
};

const deleteCategory = async (id) => {
  const result = await pool.query(
    `DELETE FROM categories
     WHERE id = $1
     RETURNING id`,
    [id]
  );

  return result.rows[0] || null;
};

module.exports = {
  createCategory,
  getCategories,
  getCategoryById,
  updateCategory,
  deleteCategory,
};
