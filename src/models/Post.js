const mongoose = require('mongoose');

const CATEGORY_VALUES = ['DUVIDAS', 'BUILDS', 'ENDGAME', 'GERAL', 'CONQUISTAS'];

const postSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
      maxlength: 200,
    },
    content: {
      type: String,
      required: true,
      trim: true,
      maxlength: 5000,
    },
    category: {
      type: String,
      required: true,
      enum: CATEGORY_VALUES,
      default: 'GERAL',
    },
    authorId: {
      type: Number,
      required: true,
      index: true,
    },
    authorName: {
      type: String,
      required: true,
      trim: true,
      maxlength: 100,
    },
    authorUsername: {
      type: String,
      required: true,
      trim: true,
      maxlength: 50,
    },
    replyCount: {
      type: Number,
      default: 0,
      min: 0,
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

postSchema.index({ createdAt: -1 });
postSchema.index({ category: 1, createdAt: -1 });

module.exports = mongoose.model('Post', postSchema);
module.exports.CATEGORY_VALUES = CATEGORY_VALUES;
