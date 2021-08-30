const express = require('express');
const router = express.Router();
const controller = require('../webhooks/moralis');

router.post('/webhooks/nft-transfers', controller.afterSaveNftTransactions);

module.exports = router;
