const jobsService = require('../services/jobsService');

const databaseError = (res, error) => {
  if (error.code === '23503') {
    return res.status(400).json({
      status: 'failed',
      message: 'Company atau kategori tidak ditemukan',
    });
  }
  if (error.code === '23505') {
    return res.status(400).json({
      status: 'failed',
      message: 'Data lowongan sudah digunakan',
    });
  }
  console.error('Kesalahan Jobs:', error);
  return res.status(500).json({
    status: 'error',
    message: 'Terjadi kesalahan pada server',
  });
};

const notFound = (res) => res.status(404).json({
  status: 'failed',
  message: 'Job tidak ditemukan',
});

const postJobHandler = async (req, res) => {
  try {
    const job = await jobsService.createJob(req.body);
    return res.status(201).json({ status: 'success', data: { id: job.id } });
  } catch (error) {
    return databaseError(res, error);
  }
};

const getJobsHandler = async (req, res) => {
  try {
    const result = await jobsService.getJobs({
      ...req.query,
      companyName: req.query['company-name'],
    });
    return res.status(200).json({ status: 'success', data: result });
  } catch (error) {
    return databaseError(res, error);
  }
};

const getJobsByCompanyIdHandler = async (req, res) => {
  try {
    const jobs = await jobsService.getJobsByCompanyId(req.params.id);
    return res.status(200).json({ status: 'success', data: { jobs } });
  } catch (error) {
    return databaseError(res, error);
  }
};

const getJobsByCategoryIdHandler = async (req, res) => {
  try {
    const jobs = await jobsService.getJobsByCategoryId(req.params.id);
    return res.status(200).json({ status: 'success', data: { jobs } });
  } catch (error) {
    return databaseError(res, error);
  }
};

const getJobByIdHandler = async (req, res) => {
  try {
    const job = await jobsService.getJobById(req.params.id);
    if (!job) return notFound(res);
    return res.status(200).json({ status: 'success', data: job });
  } catch (error) {
    return databaseError(res, error);
  }
};

const putJobHandler = async (req, res) => {
  try {
    const job = await jobsService.updateJob({ id: req.params.id, ...req.body });
    if (!job) return notFound(res);
    return res.status(200).json({ status: 'success', message: 'Job berhasil diperbarui' });
  } catch (error) {
    return databaseError(res, error);
  }
};

const deleteJobHandler = async (req, res) => {
  try {
    const job = await jobsService.deleteJob(req.params.id);
    if (!job) return notFound(res);
    return res.status(200).json({ status: 'success', message: 'Job berhasil dihapus' });
  } catch (error) {
    return databaseError(res, error);
  }
};

module.exports = {
  postJobHandler,
  getJobsHandler,
  getJobsByCompanyIdHandler,
  getJobsByCategoryIdHandler,
  getJobByIdHandler,
  putJobHandler,
  deleteJobHandler,
};
