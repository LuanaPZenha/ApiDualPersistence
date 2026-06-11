const mongoose = require('mongoose');

const carSchema = new mongoose.Schema(
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
      min: 1886,
      max: new Date().getFullYear() + 1,
    },
    color: {
      type: String,
      required: true,
      trim: true,
      maxlength: 50,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

module.exports = mongoose.model('Car', carSchema);
