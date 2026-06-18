const Item = require('../models/Item');
const achievements = require('../data/diabloAchievements');
const { withRarity } = require('../data/rarity');
const { withCategory } = require('../data/categories');
const { withContext } = require('../data/achievementContext');

async function seedAchievements() {
  let inserted = 0;
  let updated = 0;

  for (const raw of achievements) {
    const achievement = withContext(withCategory(withRarity({ ...raw, guideType: 'CONQUISTA' })));
    let existing = await Item.findOne({ title: achievement.title, guideType: 'CONQUISTA' });
    if (!existing) {
      existing = await Item.findOne({ title: achievement.title, guideType: { $exists: false } });
    }
    if (!existing) {
      existing = await Item.findOne({ title: achievement.title, guideType: null });
    }

    if (existing) {
      existing.guideType = achievement.guideType || 'CONQUISTA';
      existing.category = achievement.category;
      existing.rating = achievement.rating;
      existing.rarity = achievement.rarity;
      existing.description = achievement.description;
      existing.guide = achievement.guide;
      existing.howTo = achievement.howTo;
      existing.averageTime = achievement.averageTime;
      existing.location = achievement.location;
      if (!existing.status) existing.status = achievement.status;
      await existing.save();
      updated += 1;
    } else {
      await Item.create(achievement);
      inserted += 1;
    }
  }

  console.log(`Seed de conquistas: ${inserted} inseridas, ${updated} atualizadas (total ${achievements.length}).`);
}

module.exports = { seedAchievements };
