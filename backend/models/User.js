// documentation: https://mongoosejs.com/docs/guide.html
const mongoose = require('mongoose');
const LabelTypes = require('./LabelTypes');

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },
    location: {
      type: { x: Number, y: Number },
      required: true,
      unique: true,
      trim: true,
    },
    labels: {
      type: {
        [LabelTypes.PROFESSIONAL]: String,
        [LabelTypes.DATING]: String,
        [LabelTypes.CHILL]: String,
      },
    },
    currentLabel: {
      type: String,
      required: true,
    },
    isLocationOn: {
      type: Boolean,
      required: true,
    },
    avatar: {
      type: String,
      required: true,
    },
    currentConnectedUserId: {
      type: String,
      required: false,
      trim: true,
      unique: true,
    },
  },
  { timestamps: true }
);

const User = mongoose.models.User || mongoose.model('User', userSchema);
module.exports = User;
