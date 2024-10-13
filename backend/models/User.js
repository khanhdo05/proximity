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
      type: { x: Number, y: Number, lastUpdated: Number },
      required: true,
      trim: true,
    },
    labels: {
      type: {
        [LabelTypes.PROFESSIONAL]: String,
        [LabelTypes.DATING]: String,
        [LabelTypes.CHATTING]: String,
      },
    },
    currentLabel: {
      //either "professional", "dating", or "chatting"
      type: String,
      required: true,
    },
    isLocationOn: {
      type: Boolean,
      required: true,
    },
    avatar: {
      type: String,
      required: false,
    },
    activeOutboundRequests: {
      type: [String],
      required: false,
    },
    currentChatUserId: {
      type: mongoose.Schema.Types.ObjectId,
      required: false,
    },
  },
  { timestamps: true }
);

const User = mongoose.models.User || mongoose.model('User', userSchema);
module.exports = User;
