const Driver = require("../models/Driver");
const User = require("../models/User");

exports.getNearByDrivers = async (req, res) => {
    try {
      const userId = req.params.userId;
  
      const user = await User.findById(userId);
      if (!user || !user.location || !user.location.coordinates) {
        return res
          .status(404)
          .json({ message: "User or user location not found" });
      }
      console.log(user);
  
      const userLocation = user.location.coordinates;
  
      // Define the maximum distance (in meters)
      const maxDistance = 10000;
  
      // Find nearby drivers using $near query
      const nearbyDrivers = await Driver.aggregate([
        {
          $geoNear: {
            near: {
              type: "Point",
              coordinates: userLocation,
            },
            distanceField: "distance",
            maxDistance: maxDistance,
            spherical: true,
          },
        },
      ]);
  
      res.json({ nearbyDrivers, userLocation });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Server error" });
    }
  }