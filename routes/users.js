const express = require("express");
const { getUsers, addUser, updateLocation } = require("../controllers/users");

const router = express.Router();

router.route("/").get(getUsers).post(addUser);

router.route("/:userId/updateLocation").put(updateLocation);

router.get("/me", (req, res) => {
  if (req.session.userId) {
    // Assuming user ID is stored in the session
    res.json({ userId: req.session.userId });
  } else {
    res.status(401).json({ error: "User not logged in" });
  }
});

module.exports = router;
