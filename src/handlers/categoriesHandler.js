const {
  createCategory,
  getCategories,
  getCategoryById,
  updateCategory,
  deleteCategory,
} = require('../services/categoriesService');

const sendDatabaseError = (res, error) => {
  if (error.code === '23505') {
    return res.status(400).json({
      status: 'failed',
      message: 'Nama kategori sudah digunakan',
    });
  }

  console.error('Kesalahan database Categories:', error);
  return res.status(500).json({
    status: 'error',
    message: 'Terjadi kesalahan pada server',
  });
};

const postCategoryHandler = async (req, res) => {
  try {
    const category = await createCategory(req.body);

    return res.status(201).json({
      status: 'success',
      data: { id: category.id },
    });
  } catch (error) {
    return sendDatabaseError(res, error);
  }
};

const getCategoriesHandler = async (req, res) => {
  try {
    const categories = await getCategories();
    return res.status(200).json({
      status: 'success',
      data: { categories },
    });
  } catch (error) {
    return sendDatabaseError(res, error);
  }
};

const getCategoryByIdHandler = async (req, res) => {
  try {
    const category = await getCategoryById(req.params.id);

    if (!category) {
      return res.status(404).json({
        status: 'failed',
        message: 'Kategori tidak ditemukan',
      });
    }

    return res.status(200).json({
      status: 'success',
      data: category,
    });
  } catch (error) {
    return sendDatabaseError(res, error);
  }
};

const putCategoryHandler = async (req, res) => {
  try {
    const category = await updateCategory({
      id: req.params.id,
      name: req.body.name,
    });

    if (!category) {
      return res.status(404).json({
        status: 'failed',
        message: 'Kategori tidak ditemukan',
      });
    }

    return res.status(200).json({
      status: 'success',
      message: 'Kategori berhasil diperbarui',
      data: category,
    });
  } catch (error) {
    return sendDatabaseError(res, error);
  }
};

const deleteCategoryHandler = async (req, res) => {
  try {
    const category = await deleteCategory(req.params.id);

    if (!category) {
      return res.status(404).json({
        status: 'failed',
        message: 'Kategori tidak ditemukan',
      });
    }

    return res.status(200).json({
      status: 'success',
      message: 'Kategori berhasil dihapus',
    });
  } catch (error) {
    return sendDatabaseError(res, error);
  }
};

module.exports = {
  postCategoryHandler,
  getCategoriesHandler,
  getCategoryByIdHandler,
  putCategoryHandler,
  deleteCategoryHandler,
};
