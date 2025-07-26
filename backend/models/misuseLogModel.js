const mongoose = require('mongoose');

const misuseLogSchema = mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User',
    },
    actionType: {
      type: String,
      required: true,
      enum: ['RAPID_COPYING', 'MULTIPLE_ACCOUNTS', 'SUSPICIOUS_ACTIVITY', 'OTHER'],
    },
    details: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('MisuseLog', misuseLogSchema);