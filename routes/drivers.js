const express = require('express');
const { getDrivers, addDriver, updateLocation } = require('../controllers/drivers');

const router = express.Router();

router
  .route('/')
  .get(getDrivers)
  .post(addDriver);
router
  .route('/updateLocation/:driverId')
  .put(updateLocation);
module.exports = router;
