const Driver = require('../models/Driver');

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
