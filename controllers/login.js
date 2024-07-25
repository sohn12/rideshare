const Driver = require("../models/Driver");
const User = require("../models/User");

exports.login = async (req, res, next) => {
  const { userId, isDriver = false } = req.body;
  try {
    if (isDriver) {
      const driver = await Driver.findOne({driverId: userId});
      console.log(driver);
      res.json({ driver });
      return;
    }
    const user = await User.findOne({userId});
    console.log(user);

    res.json({ user });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};
