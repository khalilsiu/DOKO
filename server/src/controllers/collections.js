const { indexCollections } = require('../services/collections');

const controller = {
  indexCollections: async (req, res) => {
    await indexCollections();
  }
};

module.exports = controller;
