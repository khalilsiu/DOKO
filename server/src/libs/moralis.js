const Moralis = require('moralis/node');
Moralis.initialize(process.env.MORALIS_APPLICATION_ID, '', process.env.MORALIS_MASTER_KEY);
Moralis.serverURL = process.env.MORALIS_SERVER_URL;

module.exports = { Moralis };
