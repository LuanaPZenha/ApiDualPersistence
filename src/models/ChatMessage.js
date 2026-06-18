const mongoose = require('mongoose');

const chatMessageSchema = new mongoose.Schema(
  {
    content: {
      type: String,
      required: true,
      trim: true,
      maxlength: 1000,
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
    room: {
      type: String,
      default: 'sanctuary',
      index: true,
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

chatMessageSchema.index({ room: 1, createdAt: -1 });

module.exports = mongoose.model('ChatMessage', chatMessageSchema);
