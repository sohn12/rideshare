const express = require("express");
const { getNearByDrivers } = require("../controllers/nearby-drivers");

const router = express.Router();

router.get("/:userId", getNearByDrivers);

module.exports = router;
