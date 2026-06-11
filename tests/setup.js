const mongoose = require('mongoose');
const { sequelize } = require('../src/config/database');
const Car = require('../src/models/Car');
const Moto = require('../src/models/Moto');
const MarcaRoupa = require('../src/models/MarcaRoupa');
const User = require('../src/models/User');

beforeAll(async () => {
  const { connectPostgres, syncPostgres } = require('../src/config/database');
  const { connectMongo } = require('../src/config/mongodb');

  await connectPostgres();
  await syncPostgres(true);
  await connectMongo();
});

beforeEach(async () => {
  await User.destroy({ where: {}, truncate: true, cascade: true, restartIdentity: true });
  await Car.deleteMany({});
  await Moto.deleteMany({});
  await MarcaRoupa.deleteMany({});
});

afterAll(async () => {
  await sequelize.close();
  await mongoose.disconnect();
});
