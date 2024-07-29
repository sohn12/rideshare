const Driver = require('../models/Driver');
const geocoder = require('../utils/geocoder');

// @desc  Get all drivers
// @route GET /api/v1/drivers
// @access Public
exports.getDrivers = async (req, res, next) => {
  try {
    const drivers = await Driver.find();

    return res.status(200).json({
      success: true,
      count: drivers.length,
      data: drivers
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
};

// @desc  Create a driver location
// @route POST /api/v1/drivers
// @access Public
exports.addDriver = async (req, res, next) => {
  try {
    const driver = await Driver.create(req.body);

    return res.status(201).json({
      success: true,
      data: driver
    });
  } catch (err) {
    console.error(err);
    if (err.code === 11000) {
      return res.status(400).json({ error: 'This driver already exists' });
    }
    res.status(500).json({ error: 'Server error' });
  }
};

// @desc Update driver location
// @route PUT /api/v1/drivers/:driverId/updateLocation
// @access Public
exports.updateLocation = async (req, res, next) => {
  try {
    const { driverId } = req.params;
    const { address } = req.body;

    if (!address) {
      return res.status(400).json({ error: 'Please provide an address' });
    }

    const loc = await geocoder.geocode(address);
    if (!loc.length) {
      return res.status(400).json({ error: 'Invalid address' });
    }

    const location = {
      type: 'Point',
      coordinates: [loc[0].longitude, loc[0].latitude],
      formattedAddress: loc[0].formattedAddress
    };

    const driver = await Driver.findOneAndUpdate(
      { _id: driverId },
      { location, address }, // Set the new location and address
      { new: true, runValidators: true }
    );

    if (!driver) {
      return res.status(404).json({ error: 'Driver not found' });
    }

    return res.status(200).json({
      success: true,
      data: driver
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
};