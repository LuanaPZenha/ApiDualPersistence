const Item = require('../models/Item');
const mounts = require('../data/diabloMounts');
const { withMountRarity } = require('../data/mountRarity');
const { withMountCategory } = require('../data/mountCategories');
const { withMountContext } = require('../data/mountContext');

async function seedMounts() {
  let inserted = 0;
  let updated = 0;

  for (const raw of mounts) {
    const mount = withMountContext(withMountCategory(withMountRarity({ ...raw, guideType: 'MONTARIA' })));
    const existing = await Item.findOne({ title: mount.title, guideType: 'MONTARIA' });

    if (existing) {
      existing.category = mount.category;
      existing.rating = mount.rating;
      existing.rarity = mount.rarity;
      existing.description = mount.description;
      existing.guide = mount.guide;
      existing.howTo = mount.howTo;
      existing.averageTime = mount.averageTime;
      existing.location = mount.location;
      if (!existing.status) existing.status = mount.status;
      await existing.save();
      updated += 1;
    } else {
      await Item.create(mount);
      inserted += 1;
    }
  }

  console.log(`Seed de montarias: ${inserted} inseridas, ${updated} atualizadas (total ${mounts.length}).`);
}

module.exports = { seedMounts };
