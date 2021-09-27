const nfts = require('./nfts');
const nft = require('./nft');
const address = require('./address');
const collections = require('./collections');

const initRouter = app => {
  app.use('/api', nfts).use('/api', address).use('/api', collections).use('/api',nft);
};

module.exports = initRouter;
