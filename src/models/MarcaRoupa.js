const mongoose = require('mongoose');

const marcaRoupaSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      maxlength: 100,
      unique: true,
    },
    country: {
      type: String,
      required: true,
      trim: true,
      maxlength: 80,
    },
    segment: {
      type: String,
      required: true,
      trim: true,
      maxlength: 80,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

module.exports = mongoose.model('MarcaRoupa', marcaRoupaSchema);
