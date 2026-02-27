const mongoose = require('mongoose');

const CATEGORIES = [
  'Food & Dining',
  'Travel',
  'Cosmetics & Beauty',
  'Electronics',
  'Fashion & Clothing',
  'Entertainment',
  'Health & Fitness',
  'Shopping',
  'Gaming',
  'Other',
];

const redeemCodeSchema = mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Please add a title'],
      trim: true,
    },
    description: {
      type: String,
      trim: true,
      default: '',
    },
    code: {
      type: String,
      required: [true, 'Please add a redeem code'],
      trim: true,
    },
    category: {
      type: String,
      enum: CATEGORIES,
      default: 'Other',
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User',
    },
    copyCount: {
      type: Number,
      default: 0,
    },
    isArchived: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('RedeemCode', redeemCodeSchema);
module.exports.CATEGORIES = CATEGORIES;