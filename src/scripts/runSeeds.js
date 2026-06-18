require('dotenv').config();
const { connectMongo, disconnectMongo } = require('../config/mongodb');
const { seedAchievements } = require('../seed/achievementsSeed');
const { seedMounts } = require('../seed/mountsSeed');
const { seedPets } = require('../seed/petsSeed');

async function main() {
  const only = process.argv[2];

  await connectMongo();

  if (!only || only === 'achievements') await seedAchievements();
  if (!only || only === 'mounts') await seedMounts();
  if (!only || only === 'pets') await seedPets();

  await disconnectMongo();
  console.log('Seeds concluidos.');
}

main().catch((error) => {
  console.error('Falha ao executar seeds:', error.message);
  process.exit(1);
});
