const mongoose = require("mongoose");
const geocoder = require("../utils/geocoder");

const RideSchema = new mongoose.Schema({
  tripId: {
    type: String,
    required: [true, "Please add a trip ID"],
    unique: true,
    trim: true,
    maxlength: [10, "trip ID must be less than 10 chars"],
  },
  userId: {
    type: String,
    required: [true, "Please add a user ID"],
    trim: true,
    maxlength: [50, "user ID must be less than 50 chars"],
  },
  driverId: {
    type: String,
    trim: true,
    maxlength: [50, "driver ID must be less than 50 chars"],
  },
  startAddress: {
    type: String,
    required: [true, "Please add an address"],
  },
  endAddress: {
    type: String,
    required: [true, "Please add an address"],
  },
  startLocation: {
    type: {
      type: String,
      enum: ["Point"],
    },
    coordinates: {
      type: [Number],
      index: "2dsphere",
    },
    formattedAddress: String,
  },
  endLocation: {
    type: {
      type: String,
      enum: ["Point"],
    },
    coordinates: {
      type: [Number],
      index: "2dsphere",
    },
    formattedAddress: String,
  },
  pickupTime: {
    type: Date,
    default: Date.now,
  },
  dropOffTime: {
    type: Date,
    default: Date.now,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  status: {
    type: String,
    enum: ["requested", "accepted", "declined", "started", "completed"],
    default: "requested",
  },
});

// Geocode & create location
RideSchema.pre("save", async function (next) {
  let loc = await geocoder.geocode(this.startAddress);
  this.startLocation = {
    type: "Point",
    coordinates: [loc[0].longitude, loc[0].latitude],
    formattedAddress: loc[0].formattedAddress,
  };

  loc = await geocoder.geocode(this.endAddress);
  this.endLocation = {
    type: "Point",
    coordinates: [loc[0].longitude, loc[0].latitude],
    formattedAddress: loc[0].formattedAddress,
  };

  // Do not save address
  this.startAddress = undefined;
  this.endAddress = undefined;
  next();
});

RideSchema.set("toJSON", {
  transform: function (doc, ret, options) {
    if (ret.status === "started") {
      delete ret.dropOffTime;
    }
    if (["requested", "accepted", "declined"].includes(ret.status)) {
      delete ret.pickupTime;
      delete ret.dropOffTime;
    }
    return ret;
  },
});
module.exports = mongoose.model("Ride", RideSchema);
