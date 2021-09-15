const express = require('express');
const router = express.Router();
const controller = require('../controllers/collections');

router.post('/collections/index', controller.indexCollections);

module.exports = router;
