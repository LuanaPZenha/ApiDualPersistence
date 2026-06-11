const mongoose = require('mongoose');

const motoSchema = new mongoose.Schema(
  {
    brand: {
      type: String,
      required: true,
      trim: true,
      maxlength: 100,
    },
    model: {
      type: String,
      required: true,
      trim: true,
      maxlength: 100,
    },
    year: {
      type: Number,
      required: true,
      min: 1885,
      max: new Date().getFullYear() + 1,
    },
    engineCapacity: {
      type: Number,
      required: true,
      min: 50,
      max: 2500,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

module.exports = mongoose.model('Moto', motoSchema);
