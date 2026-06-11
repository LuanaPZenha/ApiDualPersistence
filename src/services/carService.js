const Car = require('../models/Car');
const AppError = require('../utils/AppError');

async function listCars() {
  return Car.find().sort({ createdAt: -1 });
}

async function getCarById(id) {
  const car = await Car.findById(id);
  if (!car) {
    throw new AppError('Carro nao encontrado', 404);
  }
  return car;
}

async function createCar(data) {
  return Car.create(data);
}

async function updateCar(id, data) {
  const car = await Car.findByIdAndUpdate(id, data, {
    new: true,
    runValidators: true,
  });
  if (!car) {
    throw new AppError('Carro nao encontrado', 404);
  }
  return car;
}

async function deleteCar(id) {
  const car = await Car.findByIdAndDelete(id);
  if (!car) {
    throw new AppError('Carro nao encontrado', 404);
  }
}

module.exports = {
  listCars,
  getCarById,
  createCar,
  updateCar,
  deleteCar,
};
