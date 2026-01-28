const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  weight: {
    type: Number, // in kg
    required: true,
  },
  sellingPrice: {
    type: Number,
    required: true,
  },
  // dimensions could be length, width, height, but prompt just says "attributes like weight and dimensions"
  dimensions: {
    length: Number,
    width: Number,
    height: Number,
  },
  sellerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Seller',
    required: true,
  },
}, {
  timestamps: true,
});

module.exports = mongoose.model('Product', productSchema);
