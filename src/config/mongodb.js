const mongoose = require('mongoose');
const config = require('./index');

async function connectMongo() {
  mongoose.set('strictQuery', true);
  await mongoose.connect(config.mongodb.uri);
}

async function disconnectMongo() {
  await mongoose.disconnect();
}

module.exports = {
  connectMongo,
  disconnectMongo,
};
