const { Sequelize } = require('sequelize');
const config = require('./index');

const sequelize = new Sequelize(
  config.postgres.database,
  config.postgres.username,
  config.postgres.password,
  {
    host: config.postgres.host,
    port: config.postgres.port,
    dialect: 'postgres',
    logging: config.env === 'development' ? console.log : false,
    define: {
      underscored: true,
      timestamps: true,
    },
  }
);

async function connectPostgres() {
  await sequelize.authenticate();
}

async function syncPostgres(force = false) {
  await sequelize.sync({ force });
}

module.exports = {
  sequelize,
  connectPostgres,
  syncPostgres,
};
