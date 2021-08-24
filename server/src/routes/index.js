const collections = require('./collections');

const initRouter = app => {
  app.use(collections);
};

module.exports = initRouter;
