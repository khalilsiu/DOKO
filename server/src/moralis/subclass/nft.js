const { Moralis } = require('../../libs/moralis');

class NFT extends Moralis.Object {
  constructor() {
    super('NFT');
  }

  static async save(data) {
    const query = new Moralis.Query(NFT);
    query.equalTo('token_id', data.token_id);
    query.equalTo('token_address', data.token_address);

    let existing;

    try {
      existing = await query.find();
      console.log(existing.length);

      if (existing.length) {
        if (data.owner.toLowerCase() !== existing[0].get('owner').toLowerCase()) {
          existing[0].set('owner', data.owner);
          return await existing[0].save();
        }
        console.log(existing[0].attributes);
        return;
      } else {
        const nft = new NFT();
        return await nft.save(data);
      }
    } catch (err) {
      console.error('NFT save error:\n', err);
    }
  }
}

Moralis.Object.registerSubclass('NFT', NFT);

module.exports = NFT;
