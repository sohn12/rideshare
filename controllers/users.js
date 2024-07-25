const User = require('../models/User');
const geocoder = require('../utils/geocoder');

// @desc  Get all users
// @route GET /api/v1/users
// @access Public
exports.getUsers = async (req, res, next) => {
  try {
    const users = await User.find();

    return res.status(200).json({
      success: true,
      count: users.length,
      data: users
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
};

// @desc  Create a user
// @route POST /api/v1/users
// @access Public
exports.addUser = async (req, res, next) => {
  try {
    const user = await User.create(req.body);

    return res.status(201).json({
      success: true,
      data: user
    });
  } catch (err) {
    console.error(err);
    if (err.code === 11000) {
      return res.status(400).json({ error: 'This user already exists' });
    }
    res.status(500).json({ error: 'Server error' });
  }
};

// @desc Update user location
// @route PUT /api/v1/users/updateLocation/:userId
// @access Public
exports.updateLocation = async (req, res, next) => {
  try {
    const { userId } = req.params;
    const { address } = req.body;
console.log("userId is ",userId);
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

    const user = await User.findOneAndUpdate(
      { userId },
      { location, address }, // Set the new location and address
      { new: true, runValidators: true }
    );

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    return res.status(200).json({
      success: true,
      data: user
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
};