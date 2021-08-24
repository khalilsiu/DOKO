const { Moralis } = require('../libs/moralis');
const Address = require('../moralis/subclass/address');

const startJob = async () => {
  // const address = new Address();
  // address.set('address', '0x4ec741b83ec1f0b491152904b1b8383c2975031a');
  // await address.save();
  const query = new Moralis.Query(Address);
  query.limit(100);
  const results = await query.find();
  console.log(results[0].get('address'));
  // await Moralis.Cloud.run('watchBscAddress', {
  //   address: '0x4ec741b83ec1f0b491152904b1b8383c2975031a'
  // });
  // await Moralis.Cloud.run('watchEthAddress', {
  //   address: '0x4ec741b83ec1f0b491152904b1b8383c2975031a'
  // });
};

module.exports = {
  startJob
};
