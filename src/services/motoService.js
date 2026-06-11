const Moto = require('../models/Moto');
const AppError = require('../utils/AppError');

async function listMotos() {
  return Moto.find().sort({ createdAt: -1 });
}

async function getMotoById(id) {
  const moto = await Moto.findById(id);
  if (!moto) {
    throw new AppError('Moto nao encontrada', 404);
  }
  return moto;
}

async function createMoto(data) {
  return Moto.create(data);
}

async function updateMoto(id, data) {
  const moto = await Moto.findByIdAndUpdate(id, data, {
    new: true,
    runValidators: true,
  });
  if (!moto) {
    throw new AppError('Moto nao encontrada', 404);
  }
  return moto;
}

async function deleteMoto(id) {
  const moto = await Moto.findByIdAndDelete(id);
  if (!moto) {
    throw new AppError('Moto nao encontrada', 404);
  }
}

module.exports = {
  listMotos,
  getMotoById,
  createMoto,
  updateMoto,
  deleteMoto,
};
