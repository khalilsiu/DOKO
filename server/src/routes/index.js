const nfts = require('./nfts');
const address = require('./address');
const collections = require('./collections');

const initRouter = app => {
  app.use('/api', nfts).use('/api', address).use('/api', collections);
};

module.exports = initRouter;
