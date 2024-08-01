const Ride = require("../models/Ride");

// @desc  Get all rides
// @route GET /api/v1/rides
// @access Public
exports.getRides = async (req, res, next) => {
  try {
    const rides = await Ride.find();

    return res.status(200).json({
      success: true,
      count: rides.length,
      data: rides,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
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
      data: ride,
    });
  } catch (err) {
    console.error(err);
    if (err.code === 11000) {
      return res.status(400).json({ error: "This ride already exists" });
    }
    res.status(500).json({ error: "Server error" });
  }
};

// @desc Request a Ride
// @route POST /api/v1/rides/request
// @access Public
exports.requestRide = async (req, res, next) => {
  try {
    const { userId, driverId } = req.body;

    // Check if user or driver is already involved in an active ride
    const activeRide = await Ride.findOne({
      $or: [
        { userId, status: { $in: ["requested", "accepted", "started"] } },
        { driverId, status: { $in: ["requested", "accepted", "started"] } },
      ],
    });

    if (activeRide) {
      return res.status(400).json({
        error: "User or driver is already involved in an active ride",
      });
    }

    const ride = await Ride.create(req.body);

    return res.status(201).json({
      success: true,
      data: ride.toJSON(), // Ensure toJSON transformation
    });
  } catch (err) {
    console.error(err);
    if (err.code === 11000) {
      return res.status(400).json({ error: "This ride already exists" });
    }
    res.status(500).json({ error: "Server error" });
  }
};

// @desc Accept a Ride
// @route PUT /api/v1/rides/accept/:tripId
// @access Public
exports.acceptRide = async (req, res, next) => {
  try {
    const { tripId } = req.params;

    const ride = await Ride.findOneAndUpdate(
      { tripId },
      { status: "accepted", driverId: req.body.driverId },
      { new: true, runValidators: true }
    );

    if (!ride) {
      return res.status(404).json({ error: "Ride not found" });
    }

    res.json({
      success: true,
      data: ride,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
};

// @desc Decline a Ride
// @route PUT /api/v1/rides/decline/:tripId
// @access Public
exports.declineRide = async (req, res, next) => {
  try {
    const { tripId } = req.params;

    const ride = await Ride.findOneAndUpdate(
      { tripId },
      { status: "declined" },
      { new: true, runValidators: true }
    );

    if (!ride) {
      return res.status(404).json({ error: "Ride not found" });
    }

    res.json({
      success: true,
      data: ride,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
};

// @desc Start a Ride
// @route PUT /api/v1/rides/start/:tripId
// @access Public
exports.startRide = async (req, res, next) => {
  try {
    const { tripId } = req.params;

    const ride = await Ride.findOneAndUpdate(
      { tripId },
      { status: "started", pickupTime: Date.now() },
      { new: true, runValidators: true }
    );

    if (!ride) {
      return res.status(404).json({ error: "Ride not found" });
    }

    res.json({
      success: true,
      data: ride,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
};

// @desc Complete a Ride
// @route PUT /api/v1/rides/complete/:tripId
// @access Public
exports.completeRide = async (req, res, next) => {
  try {
    const { tripId } = req.params;

    const ride = await Ride.findOneAndUpdate(
      { tripId },
      { status: "completed", dropOffTime: Date.now() },
      { new: true, runValidators: true }
    );

    if (!ride) {
      return res.status(404).json({ error: "Ride not found" });
    }

    res.json({
      success: true,
      data: ride,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
};
