const express = require('express');
const router = express.Router();
const collections = require('../controllers/collections');

router.post('/collections', collections.indexCollections);

module.exports = router;
