const express = require('express');
const { getRides, addRide } = require('../controllers/rides');

const router = express.Router();

router
  .route('/')
  .get(getRides)
  .post(addRide);

module.exports = router;
