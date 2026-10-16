const applicationsService = require('../services/applicationsService');

const notFound = (res) => res.status(404).json({
  status: 'failed',
  message: 'Application tidak ditemukan',
});

const sendError = (res, error) => {
  const code = error.statusCode || (error.code === '23503' ? 400 : 500);
  if (code === 500) console.error('Kesalahan Applications:', error);
  return res.status(code).json({
    status: code === 500 ? 'error' : 'failed',
    message: code === 500 ? 'Terjadi kesalahan pada server' : error.message,
  });
};

const postApplicationHandler = async (req, res) => {
  try {
    // Jangan percaya user_id dari payload sebagai identitas pengguna.
    const application = await applicationsService.createApplication({
      userId: req.user.id,
      jobId: req.body.job_id,
    });
    return res.status(201).json({
      status: 'success',
      data: { id: application.id },
    });
  } catch (error) {
    return sendError(res, error);
  }
};

const getApplicationsHandler = async (req, res) => {
  try {
    const applications = await applicationsService.getApplications(req.user.id);
    return res.status(200).json({ status: 'success', data: { applications } });
  } catch (error) {
    return sendError(res, error);
  }
};

const getApplicationByIdHandler = async (req, res) => {
  try {
    const application = await applicationsService.getApplicationById(req.params.id, req.user.id);
    if (!application) return notFound(res);
    return res.status(200).json({ status: 'success', data: application });
  } catch (error) {
    return sendError(res, error);
  }
};

const getApplicationsByUserIdHandler = async (req, res) => {
  try {
    const applications = await applicationsService.getApplicationsByUserId(
      req.params.id, req.user.id
    );
    return res.status(200).json({ status: 'success', data: { applications } });
  } catch (error) {
    return sendError(res, error);
  }
};

const getApplicationsByJobIdHandler = async (req, res) => {
  try {
    const applications = await applicationsService.getApplicationsByJobId(
      req.params.id, req.user.id
    );
    return res.status(200).json({ status: 'success', data: { applications } });
  } catch (error) {
    return sendError(res, error);
  }
};

const putApplicationHandler = async (req, res) => {
  try {
    const application = await applicationsService.updateApplication({
      id: req.params.id,
      status: req.body.status,
      userId: req.user.id,
    });
    if (!application) return notFound(res);
    return res.status(200).json({
      status: 'success',
      message: 'Status application berhasil diperbarui',
      data: application,
    });
  } catch (error) {
    return sendError(res, error);
  }
};

const deleteApplicationHandler = async (req, res) => {
  try {
    const deleted = await applicationsService.deleteApplication(req.params.id, req.user.id);
    if (!deleted) return notFound(res);
    return res.status(200).json({
      status: 'success',
      message: 'Application berhasil dihapus',
    });
  } catch (error) {
    return sendError(res, error);
  }
};

module.exports = {
  postApplicationHandler,
  getApplicationsHandler,
  getApplicationByIdHandler,
  getApplicationsByUserIdHandler,
  getApplicationsByJobIdHandler,
  putApplicationHandler,
  deleteApplicationHandler,
};
