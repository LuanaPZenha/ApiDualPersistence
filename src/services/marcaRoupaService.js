const MarcaRoupa = require('../models/MarcaRoupa');
const AppError = require('../utils/AppError');

async function listMarcas() {
  return MarcaRoupa.find().sort({ createdAt: -1 });
}

async function getMarcaById(id) {
  const marca = await MarcaRoupa.findById(id);
  if (!marca) {
    throw new AppError('Marca de roupa nao encontrada', 404);
  }
  return marca;
}

async function createMarca(data) {
  return MarcaRoupa.create(data);
}

async function updateMarca(id, data) {
  const marca = await MarcaRoupa.findByIdAndUpdate(id, data, {
    new: true,
    runValidators: true,
  });
  if (!marca) {
    throw new AppError('Marca de roupa nao encontrada', 404);
  }
  return marca;
}

async function deleteMarca(id) {
  const marca = await MarcaRoupa.findByIdAndDelete(id);
  if (!marca) {
    throw new AppError('Marca de roupa nao encontrada', 404);
  }
}

module.exports = {
  listMarcas,
  getMarcaById,
  createMarca,
  updateMarca,
  deleteMarca,
};
