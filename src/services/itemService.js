const Item = require('../models/Item');
const AppError = require('../utils/AppError');
const { RARITY_VALUES } = require('../data/rarity');
const { ACHIEVEMENT_CATEGORIES, ALL_ITEM_CATEGORIES, GUIDE_TYPES } = require('../data/categories');

function normalizeStatus(status) {
  const value = String(status || 'NA_FILA').toUpperCase().replace(/\s+/g, '_');
  if (['CONCLUIDO', 'ZERADO'].includes(value)) return 'CONCLUIDO';
  if (['EM_ANDAMENTO', 'JOGANDO', 'TENTANDO'].includes(value)) return 'EM_ANDAMENTO';
  return 'NA_FILA';
}

function normalizeRarity(value) {
  const key = String(value || 'COMUM').toUpperCase();
  return RARITY_VALUES.includes(key) ? key : 'COMUM';
}

function normalizeGuideType(value) {
  const key = String(value || 'CONQUISTA').toUpperCase();
  return GUIDE_TYPES.includes(key) ? key : 'CONQUISTA';
}

function normalizeCategory(value, guideType = 'CONQUISTA') {
  const key = String(value || 'Endgame').trim();
  if (ALL_ITEM_CATEGORIES.includes(key)) return key;
  if (guideType === 'MONTARIA') return 'Establo';
  if (guideType === 'MASCOTE') return 'Cosmetica';
  return 'Endgame';
}

function mapPayload(data) {
  const guideType = normalizeGuideType(data.guideType || data.tipoGuia);
  return {
    guideType,
    title: data.title || data.titulo,
    category: normalizeCategory(data.category || data.categoria || data.plataforma, guideType),
    rating: Number(data.rating ?? data.nota ?? data.dificuldade),
    rarity: normalizeRarity(data.rarity || data.raridade),
    status: normalizeStatus(data.status),
    description: data.description || data.descricao,
    guide: data.guide || data.guia || '',
    howTo: data.howTo || data.comoFazer || '',
    averageTime: data.averageTime || data.tempoMedio || '',
    location: data.location || data.localizacao || '',
  };
}

async function listItems(filters = {}) {
  const query = {};
  const guideTypeFilter = filters.guideType || filters.tipoGuia;

  if (filters.rarity) {
    query.rarity = normalizeRarity(filters.rarity);
  } else if (filters.rareOnly === 'true' || filters.rareOnly === true) {
    query.rarity = { $in: ['PREMIUM', 'RARA', 'EPICA', 'LENDARIA', 'MITICA'] };
  }

  if (filters.category) {
    query.category = normalizeCategory(filters.category, guideTypeFilter);
  }

  if (guideTypeFilter) {
    const guideType = normalizeGuideType(guideTypeFilter);
    if (guideType === 'CONQUISTA') {
      query.$or = [
        { guideType: 'CONQUISTA' },
        { guideType: { $exists: false } },
        { guideType: null },
      ];
    } else {
      query.guideType = guideType;
    }
  }

  return Item.find(query).sort({ category: 1, createdAt: -1 });
}

async function getItemById(id) {
  const item = await Item.findById(id);
  if (!item) {
    throw new AppError('Conquista nao encontrada', 404);
  }
  return item;
}

async function createItem(data) {
  return Item.create(mapPayload(data));
}

async function updateItem(id, data) {
  const item = await Item.findByIdAndUpdate(id, mapPayload(data), {
    new: true,
    runValidators: true,
  });
  if (!item) {
    throw new AppError('Conquista nao encontrada', 404);
  }
  return item;
}

async function deleteItem(id) {
  const item = await Item.findByIdAndDelete(id);
  if (!item) {
    throw new AppError('Conquista nao encontrada', 404);
  }
}

module.exports = {
  listItems,
  getItemById,
  createItem,
  updateItem,
  deleteItem,
};
