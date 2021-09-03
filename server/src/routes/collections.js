const express = require('express');
const router = express.Router();
const collections = require('../controllers/collections');

router.get('/nfts', collections.getNFTs).post('/nfts/index', collections.indexCollections);

module.exports = router;
