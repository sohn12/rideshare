const express = require('express');
const { getDrivers, addDriver } = require('../controllers/drivers');

const router = express.Router();

router
  .route('/')
  .get(getDrivers)
  .post(addDriver);

module.exports = router;
