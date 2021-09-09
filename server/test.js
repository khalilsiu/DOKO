const Moralis = require('moralis/node');

const MORALIS_SERVER_URL = 'https://cn1eda78yaog.bigmoralis.com:2053/server';
const MORALIS_APPLICATION_ID = 'lSjgpzE55RKJu49jM5j8UEyYBO7vmZDMYW01S2Re';
const MORALIS_MASTER_KEY = 'CFBcjio2OtDj7ZWdZOaR3V8r61lAc3orN0tLyWuA';

Moralis.initialize(MORALIS_APPLICATION_ID, '', MORALIS_MASTER_KEY);
Moralis.serverURL = MORALIS_SERVER_URL;

Moralis.Web3API.token
  .getTokenIdMetadata({
    address: '0x495f947276749ce646f68ac8c248420045cb7b5e',
    token_id: '17003309565658552223638016050791502219984530074156173480718531428060680421377'
  })
  .then(console.log);
