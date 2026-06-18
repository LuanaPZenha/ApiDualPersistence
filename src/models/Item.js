const mongoose = require('mongoose');

const STATUS_VALUES = ['CONCLUIDO', 'EM_ANDAMENTO', 'NA_FILA'];
const { RARITY_VALUES } = require('../data/rarity');
const { ALL_ITEM_CATEGORIES, GUIDE_TYPES } = require('../data/categories');

const itemSchema = new mongoose.Schema(
  {
    guideType: {
      type: String,
      required: true,
      enum: GUIDE_TYPES,
      default: 'CONQUISTA',
    },
    title: {
      type: String,
      required: true,
      trim: true,
      maxlength: 150,
    },
    category: {
      type: String,
      required: true,
      trim: true,
      enum: ALL_ITEM_CATEGORIES,
      maxlength: 80,
    },
    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5,
    },
    rarity: {
      type: String,
      required: true,
      enum: RARITY_VALUES,
      default: 'COMUM',
    },
    status: {
      type: String,
      required: true,
      enum: STATUS_VALUES,
      default: 'NA_FILA',
    },
    description: {
      type: String,
      required: true,
      trim: true,
      maxlength: 500,
    },
    guide: {
      type: String,
      trim: true,
      maxlength: 8000,
      default: '',
    },
    howTo: {
      type: String,
      trim: true,
      maxlength: 2000,
      default: '',
    },
    averageTime: {
      type: String,
      trim: true,
      maxlength: 120,
      default: '',
    },
    location: {
      type: String,
      trim: true,
      maxlength: 500,
      default: '',
    },
  },
  {
    timestamps: true,
    versionKey: false,
    toJSON: {
      virtuals: true,
      transform(_doc, ret) {
        ret.id = ret._id.toString();
        delete ret._id;
        return ret;
      },
    },
  }
);

module.exports = mongoose.model('Item', itemSchema);
module.exports.STATUS_VALUES = STATUS_VALUES;
module.exports.RARITY_VALUES = RARITY_VALUES;
