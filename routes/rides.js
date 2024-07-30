const express = require('express');
const { getRides, addRide, requestRide, acceptRide, declineRide, startRide, completeRide } = require('../controllers/rides');

const router = express.Router();

router
  .route('/')
  .get(getRides)
  .post(addRide);

router.route('/request').post(requestRide);
router.route('/accept/:tripId').put(acceptRide);
router.route('/decline/:tripId').put(declineRide);
router.route('/start/:tripId').put(startRide);
router.route('/complete/:tripId').put(completeRide);

module.exports = router;
