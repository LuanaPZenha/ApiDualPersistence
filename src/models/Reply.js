const mongoose = require('mongoose');

const replySchema = new mongoose.Schema(
  {
    postId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Post',
      required: true,
      index: true,
    },
    content: {
      type: String,
      required: true,
      trim: true,
      maxlength: 3000,
    },
    authorId: {
      type: Number,
      required: true,
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

replySchema.index({ postId: 1, createdAt: 1 });

module.exports = mongoose.model('Reply', replySchema);
