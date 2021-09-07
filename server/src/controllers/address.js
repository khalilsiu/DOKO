const Address = require('../db/Address');

module.exports = {
  getAddress: async (req, res) => {
    const collection = new Address();
    const data = await collection.findOne({ address: req.params.address });
    return res.json(data);
  }
};
