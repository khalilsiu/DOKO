const afterSaveNftTransactions = (req, res) => {
  console.log(req.body);
  const {
    object: { from_address, to_address, confirmed }
  } = req.body;

  if (!confirmed) {
    return;
  }
};

module.exports = {
  afterSaveNftTransactions
};
const a = {
  triggerName: 'afterSave',
  object: {
    block_timestamp: { __type: 'Date', iso: '2021-08-24T02:10:19.189Z' },
    hash: '0xd5c1fdfeea5cc6d917c77cb2980364496a48aaddf34e85bd6e5dd9c9c4fa48a1',
    nonce: 26,
    block_hash: '0x661de2227e85b363fa972976da0bfa43d54cc898634a03905933d9e49a76b8f7',
    block_number: 10295968,
    transaction_index: 126,
    from_address: '0xf88a9914d576f5c49c50514de655f7148e24421e',
    to_address: '0x72eb1afddb5652e0f5c7b9a6cc1c3241348b16c6',
    value: '0',
    gas_price: 5000000000,
    gas: 132270,
    input:
      '0xa9059cbb0000000000000000000000002597883c3ad61e6871d933cf139909dbf11b1a3500000000000000000000000000000000000000000000000000005af3107a4000',
    confirmed: false,
    createdAt: '2021-08-24T02:10:19.368Z',
    updatedAt: '2021-08-24T02:10:19.368Z',
    objectId: '9Jx1hOQMGvfewKalt2hyEhCm',
    className: 'BscTransactions'
  },
  master: true,
  log: {
    options: { jsonLogs: false, logsFolder: './logs', verbose: false },
    appId: 'X6rX6p76B9GFbbA9ts557CfcY5PPbhqlIjP5qaUW'
  },
  context: {},
  installationId: 'cloud'
};
