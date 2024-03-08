const mongoose = require('mongoose');

const refreshTokenSchema = new mongoose.Schema({
  refreshToken: {
    type: String,
    required: true
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
}, { timestamps: true });

refreshTokenSchema.index({ createdAt: 1 }, { expireAfterSeconds: 86400 });

const RefreshToken = mongoose.model('RefreshToken', refreshTokenSchema);

module.exports = RefreshToken;
