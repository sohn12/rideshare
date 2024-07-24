const Ride = require('../models/Ride');

// @desc  Get all rides
// @route GET /api/v1/rides
// @access Public
exports.getRides = async (req, res, next) => {
  try {
    const rides = await Ride.find();

    return res.status(200).json({
      success: true,
      count: rides.length,
      data: rides
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
};

// @desc  Create a driver location
// @route POST /api/v1/drivers
// @access Public
exports.addRide = async (req, res, next) => {
  try {
    const ride = await Ride.create(req.body);

    return res.status(201).json({
      success: true,
      data: ride
    });
  } catch (err) {
    console.error(err);
    if (err.code === 11000) {
      return res.status(400).json({ error: 'This ride already exists' });
    }
    res.status(500).json({ error: 'Server error' });
  }
};
