const express = require('express');
const router = express.Router();
const controller = require('../controllers/address');

router.get('/address/:address', controller.getAddress);

module.exports = router;
