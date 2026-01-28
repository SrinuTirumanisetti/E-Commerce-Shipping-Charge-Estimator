const mongoose = require('mongoose');

const customerSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: false, // Changed to false as per new requirements
    unique: true,
    sparse: true, // Allows multiple nulls
  },
  phoneNumber: {
    type: String,
    required: true,
  },
  location: {
    lat: {
      type: Number,
      required: true,
    },
    lng: {
      type: Number,
      required: true,
    },
  },
}, {
  timestamps: true,
});

module.exports = mongoose.model('Customer', customerSchema);
