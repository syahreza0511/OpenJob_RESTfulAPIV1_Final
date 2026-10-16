const usersService = require('../services/usersService');

// ====================================
// POST /users - REGISTRASI
// ====================================

const postUserHandler = async (req, res) => {
  try {
    const user = await usersService.createUser(req.body);

    return res.status(201).json({
      status: 'success',
      data: {
        id: user.id,
      },
    });

  } catch (error) {
    if (error.code === '23505') {
      return res.status(400).json({
        status: 'failed',
        message: 'Username atau email sudah digunakan',
      });
    }

    console.error('Gagal membuat user:', error);

    return res.status(500).json({
      status: 'error',
      message: 'Terjadi kesalahan saat membuat user',
    });
  }
};


// ====================================
// GET /users - SEMUA USER
// ====================================

const getUsersHandler = async (req, res) => {
  try {
    const users = await usersService.getUsers();

    return res.status(200).json({
      status: 'success',
      data: {
        users,
      },
    });

  } catch (error) {
    console.error('Gagal mengambil daftar user:', error);

    return res.status(500).json({
      status: 'error',
      message: 'Terjadi kesalahan saat mengambil daftar user',
    });
  }
};


// ====================================
// GET /users/:id - DETAIL USER
// ====================================

const getUserByIdHandler = async (req, res) => {
  try {
    const user = await usersService.getUserById(req.params.id);

    if (!user) {
      return res.status(404).json({
        status: 'failed',
        message: 'User tidak ditemukan',
      });
    }

    return res.status(200).json({
      status: 'success',
      data: {
        id: user.id,
        name: user.username,
        email: user.email,
      },
    });

  } catch (error) {
    console.error('Gagal mengambil detail user:', error);

    return res.status(500).json({
      status: 'error',
      message: 'Terjadi kesalahan saat mengambil detail user',
    });
  }
};


// ====================================
// PUT /users/:id - UPDATE USER
// ====================================

const putUserHandler = async (req, res) => {
  try {
    const user = await usersService.updateUser({
      id: req.params.id,
      username: req.body.username,
      email: req.body.email,
    });

    if (!user) {
      return res.status(404).json({
        status: 'failed',
        message: 'User tidak ditemukan',
      });
    }

    return res.status(200).json({
      status: 'success',
      data: {
        user,
      },
    });

  } catch (error) {
    console.error('Gagal memperbarui user:', error);

    return res.status(500).json({
      status: 'error',
      message: 'Terjadi kesalahan saat memperbarui user',
    });
  }
};


// ====================================
// DELETE /users/:id - DELETE USER
// ====================================

const deleteUserHandler = async (req, res) => {
  try {
    const user = await usersService.deleteUser(req.params.id);

    if (!user) {
      return res.status(404).json({
        status: 'failed',
        message: 'User tidak ditemukan',
      });
    }

    return res.status(200).json({
      status: 'success',
      message: 'User berhasil dihapus',
    });

  } catch (error) {
    console.error('Gagal menghapus user:', error);

    return res.status(500).json({
      status: 'error',
      message: 'Terjadi kesalahan saat menghapus user',
    });
  }
};


// ====================================
// EXPORT HANDLERS
// ====================================

module.exports = {
  postUserHandler,
  getUsersHandler,
  getUserByIdHandler,
  putUserHandler,
  deleteUserHandler,
};