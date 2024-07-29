const express = require('express');
const { getDrivers, addDriver, updateLocation } = require('../controllers/drivers');

const router = express.Router();

router
  .route('/')
  .get(getDrivers)
  .post(addDriver);

router
  .route('/:driverId/updateLocation')
  .put(updateLocation);
module.exports = router;
