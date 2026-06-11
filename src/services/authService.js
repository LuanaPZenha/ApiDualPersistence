const User = require('../models/User');
const { signToken } = require('../utils/jwt');
const AppError = require('../utils/AppError');

async function register(data) {
  const existing = await User.findOne({ where: { email: data.email } });
  if (existing) {
    throw new AppError('Email ja cadastrado', 409);
  }

  const user = await User.create({
    name: data.name,
    email: data.email,
    password: data.password,
    role: data.role || 'user',
  });

  const token = signToken({ sub: user.id, role: user.role });
  return { user: user.toSafeJSON(), token };
}

async function login(email, password) {
  const user = await User.findOne({ where: { email } });
  if (!user) {
    throw new AppError('Credenciais invalidas', 401);
  }

  const valid = await user.comparePassword(password);
  if (!valid) {
    throw new AppError('Credenciais invalidas', 401);
  }

  const token = signToken({ sub: user.id, role: user.role });
  return { user: user.toSafeJSON(), token };
}

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

async function updateUser(id, data, requester) {
  const user = await User.findByPk(id);
  if (!user) {
    throw new AppError('Usuario nao encontrado', 404);
  }

  if (requester.role !== 'admin' && requester.id !== user.id) {
    throw new AppError('Acesso negado', 403);
  }

  if (data.role && requester.role !== 'admin') {
    throw new AppError('Apenas administradores podem alterar roles', 403);
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
  register,
  login,
  listUsers,
  getUserById,
  updateUser,
  deleteUser,
};
