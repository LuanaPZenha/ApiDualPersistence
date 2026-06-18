const Item = require('../models/Item');
const pets = require('../data/diabloPets');
const { withPetRarity } = require('../data/petRarity');
const { withPetCategory } = require('../data/petCategories');
const { withPetContext } = require('../data/petContext');

async function seedPets() {
  let inserted = 0;
  let updated = 0;
  const titles = pets.map((pet) => pet.title);

  const removed = await Item.deleteMany({
    guideType: 'MASCOTE',
    title: { $nin: titles },
  });
  if (removed.deletedCount > 0) {
    console.log(`Seed de pets: ${removed.deletedCount} entradas obsoletas removidas.`);
  }

  for (const raw of pets) {
    const pet = withPetContext(withPetCategory(withPetRarity({ ...raw, guideType: 'MASCOTE' })));
    const existing = await Item.findOne({ title: pet.title, guideType: 'MASCOTE' });

    if (existing) {
      existing.category = pet.category;
      existing.rating = pet.rating;
      existing.rarity = pet.rarity;
      existing.description = pet.description;
      existing.guide = pet.guide;
      existing.howTo = pet.howTo;
      existing.averageTime = pet.averageTime;
      existing.location = pet.location;
      if (!existing.status) existing.status = pet.status;
      await existing.save();
      updated += 1;
    } else {
      await Item.create(pet);
      inserted += 1;
    }
  }

  console.log(`Seed de pets: ${inserted} inseridos, ${updated} atualizados (total ${pets.length}).`);
}

module.exports = { seedPets };
