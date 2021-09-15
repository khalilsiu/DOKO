const express = require('express');
const router = express.Router();
const controller = require('../controllers/nfts');

router.get('/nfts', controller.getNFTs).post('/nfts/index', controller.indexNFTs);

module.exports = router;
