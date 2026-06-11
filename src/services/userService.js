const User = require('../models/User');
const AppError = require('../utils/AppError');

async function listUsers() {
  const users = await User.findAll({ order: [['id', 'ASC']] });
  return users.map((u) => u.toSafeJSON());
}

async function getUserById(id) {
  const user = await User.findByPk(id);
  if (!user) {
    throw new AppError('Usuario nao encontrado', 404);
  }
  return user.toSafeJSON();
}

async function createUser(data) {
  const existing = await User.findOne({ where: { email: data.email } });
  if (existing) {
    throw new AppError('Email ja cadastrado', 409);
  }

  const user = await User.create(data);
  return user.toSafeJSON();
}

async function updateUser(id, data) {
  const user = await User.findByPk(id);
  if (!user) {
    throw new AppError('Usuario nao encontrado', 404);
  }

  await user.update(data);
  return user.toSafeJSON();
}

async function deleteUser(id) {
  const user = await User.findByPk(id);
  if (!user) {
    throw new AppError('Usuario nao encontrado', 404);
  }
  await user.destroy();
}

module.exports = {
  listUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
};
