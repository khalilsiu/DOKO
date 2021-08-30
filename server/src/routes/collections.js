const express = require('express');
const router = express.Router();
const collections = require('../controllers/collections');

router.get('/nfts', collections.getNFTs);
router.post('/nfts/index', collections.indexCollections);

module.exports = router;
