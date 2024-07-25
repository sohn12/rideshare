const express = require('express');
const { getUsers, addUser, updateLocation } = require('../controllers/users');

const router = express.Router();

router
  .route('/')
  .get(getUsers)
  .post(addUser);
router
  .route('/updateLocation/:userId')
  .put(updateLocation);
module.exports = router;
