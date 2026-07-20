const mongoose = require('mongoose');

const assetSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    name: {
      type: String,
      required: [true, 'Please add asset name'],
      trim: true,
    },
    symbol: {
      type: String,
      default: 'ASSET',
    },
    assetType: {
      type: String,
      enum: ['stock', 'mutual_fund', 'fd', 'gold', 'crypto', 'real_estate', 'others'],
      default: 'stock',
    },
    quantity: {
      type: Number,
      required: true,
      default: 1,
    },
    buyPrice: {
      type: Number,
      required: true,
    },
    currentPrice: {
      type: Number,
      required: true,
    },
    notes: {
      type: String,
      default: '',
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Asset', assetSchema);
