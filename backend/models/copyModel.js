const mongoose = require('mongoose');

const copySchema = mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User',
    },
    redeemCode: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'RedeemCode',
    },
  },
  {
    timestamps: true,
  }
);

// Ensure a user can only copy a specific code once
copySchema.index({ user: 1, redeemCode: 1 }, { unique: true });

module.exports = mongoose.model('Copy', copySchema);