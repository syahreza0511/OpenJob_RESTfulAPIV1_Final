const companiesService = require('../services/companiesService');

const handleCompanyError = (res, error) => {
  if (error.code === '23505') {
    return res.status(400).json({
      status: 'failed',
      message: 'Nama perusahaan sudah digunakan',
    });
  }
  console.error('Kesalahan pada Companies:', error);
  return res.status(500).json({
    status: 'error',
    message: 'Terjadi kesalahan pada server',
  });
};

// POST /companies
const postCompanyHandler = async (req, res) => {
  try {
    const company = await companiesService.createCompany(req.body);
    return res.status(201).json({
      status: 'success',
      data: { id: company.id },
    });
  } catch (error) {
    return handleCompanyError(res, error);
  }
};

// GET /companies
const getCompaniesHandler = async (req, res) => {
  try {
    const companies = await companiesService.getCompanies();
    return res.status(200).json({
      status: 'success',
      data: { companies },
    });
  } catch (error) {
    return handleCompanyError(res, error);
  }
};

// GET /companies/:id
const getCompanyByIdHandler = async (req, res) => {
  try {
    const company = await companiesService.getCompanyById(req.params.id);
    if (!company) {
      return res.status(404).json({
        status: 'failed',
        message: 'Company tidak ditemukan',
      });
    }
    return res.status(200).json({
      status: 'success',
      data: company,
    });
  } catch (error) {
    return handleCompanyError(res, error);
  }
};

// PUT /companies/:id
const putCompanyHandler = async (req, res) => {
  try {
    const company = await companiesService.updateCompany({
      id: req.params.id,
      ...req.body,
    });
    if (!company) {
      return res.status(404).json({
        status: 'failed',
        message: 'Company tidak ditemukan',
      });
    }
    return res.status(200).json({
      status: 'success',
      message: 'Company berhasil diperbarui',
    });
  } catch (error) {
    return handleCompanyError(res, error);
  }
};

// DELETE /companies/:id
const deleteCompanyHandler = async (req, res) => {
  try {
    const deletedCompany = await companiesService.deleteCompany(req.params.id);
    if (!deletedCompany) {
      return res.status(404).json({
        status: 'failed',
        message: 'Company tidak ditemukan',
      });
    }
    return res.status(200).json({
      status: 'success',
      message: 'Company berhasil dihapus',
    });
  } catch (error) {
    return handleCompanyError(res, error);
  }
};

module.exports = {
  postCompanyHandler,
  getCompaniesHandler,
  getCompanyByIdHandler,
  putCompanyHandler,
  deleteCompanyHandler,
};
