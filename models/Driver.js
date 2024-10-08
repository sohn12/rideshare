const mongoose = require('mongoose');
const geocoder = require('../utils/geocoder');

const DriverSchema = new mongoose.Schema({
  driverId: {
    type: String,
    required: [true, 'Please add a driver ID'],
    unique: true,
    trim: true,
    maxlength: [10, 'driver ID must be less than 10 chars']
  },
  driverName: {
    type: String,
    required: [true, 'Please add a driver name']
  },
  address: {
    type: String,
    required: [true, 'Please add an address']
  },
  location: {
    type: {
      type: String,
      enum: ['Point']
    },
    coordinates: {
      type: [Number],
      index: '2dsphere'
    },
    formattedAddress: String
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

DriverSchema.set('toJSON', {
  transform: function (doc, ret, options) {
    delete ret.address;
    return ret;
  }
});

DriverSchema.set('toObject', {
  transform: function (doc, ret, options) {
    delete ret.address;
    return ret;
  }
});

// Geocode & create location
DriverSchema.pre('save', async function(next) {
  const loc = await geocoder.geocode(this.address);
  this.location = {
    type: 'Point',
    coordinates: [loc[0].longitude, loc[0].latitude],
    formattedAddress: loc[0].formattedAddress
  };

  // Do not save address
  this.address = undefined;
  next();
});

module.exports = mongoose.model('Driver', DriverSchema);
