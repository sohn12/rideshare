const mongoose = require('mongoose');
const geocoder = require('../utils/geocoder');

const UserSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: [true, 'Please add a user ID'],
    unique: true,
    trim: true,
    maxlength: [10, 'user ID must be less than 10 chars']
  },
  name: {
    type: String,
    required: [true, 'Please add a name'],
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

UserSchema.set('toJSON', {
  transform: function (doc, ret, options) {
    delete ret.address;
    return ret;
  }
});

UserSchema.set('toObject', {
  transform: function (doc, ret, options) {
    delete ret.address;
    return ret;
  }
});

// Geocode & create location
UserSchema.pre('save', async function(next) {
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

module.exports = mongoose.model('User', UserSchema);
