const collections = require('./collections');
const address = require('./address');

const initRouter = app => {
  app.use('/api', collections).use('/api', address);
};

module.exports = initRouter;
