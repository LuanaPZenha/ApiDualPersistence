const mongoose = require('mongoose');
const config = require('./index');

const isAtlas = config.mongodb.uri.startsWith('mongodb+srv://');

async function connectMongo() {
  mongoose.set('strictQuery', true);

  const options = {
    serverSelectionTimeoutMS: 15000,
    maxPoolSize: 10,
  };

  if (isAtlas) {
    options.tls = true;
  }

  await mongoose.connect(config.mongodb.uri, options);
  console.log(`MongoDB conectado (${isAtlas ? 'Atlas' : 'local'}).`);
}

async function disconnectMongo() {
  await mongoose.disconnect();
}

module.exports = {
  connectMongo,
  disconnectMongo,
};
