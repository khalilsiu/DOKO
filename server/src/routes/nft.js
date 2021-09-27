const express = require('express');
const router = express.Router();
const controller = require('../controllers/nfts');
const opensea = require('../controllers/opensea');

router.get('/nft/:address/:id', controller.getNFT);

router.get('/nft/eth/events/:address/:id/:offset/:limit', opensea.fetchEvents );

router.get('/nft/eth/lastsale/:address/:id', opensea.fetchLastSale);

module.exports = router;