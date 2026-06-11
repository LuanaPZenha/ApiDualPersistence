const app = require('./app');
const config = require('./config');
const { connectPostgres, syncPostgres } = require('./config/database');
const { connectMongo } = require('./config/mongodb');
const User = require('./models/User');

async function seedAdminUser() {
  const adminEmail = process.env.ADMIN_EMAIL || 'admin@example.com';
  const adminPassword = process.env.ADMIN_PASSWORD || 'Admin1234';

  const existing = await User.findOne({ where: { email: adminEmail } });
  if (!existing) {
    await User.create({
      name: 'Administrador',
      email: adminEmail,
      password: adminPassword,
      role: 'admin',
    });
    console.log(`Usuario admin criado: ${adminEmail}`);
  }
}

async function startServer() {
  try {
    await connectPostgres();
    await syncPostgres();
    await connectMongo();
    await seedAdminUser();

    app.listen(config.port, () => {
      console.log(`Servidor rodando na porta ${config.port}`);
      console.log(`Swagger: http://localhost:${config.port}/api-docs`);
    });
  } catch (error) {
    console.error('Falha ao iniciar servidor:', error.message);
    process.exit(1);
  }
}

if (require.main === module) {
  startServer();
}

module.exports = { startServer };
