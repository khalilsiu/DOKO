const collections = require('./collections');

const initRouter = app => {
  app.use('/api', collections);
};

module.exports = initRouter;
