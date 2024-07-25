const express = require('express');
const { getUsers, addUser, updateLocation } = require('../controllers/users');

const router = express.Router();

router
  .route('/')
  .get(getUsers)
  .post(addUser);

router
  .route(':userId/updateLocation')
  .put(updateLocation);

module.exports = router;
