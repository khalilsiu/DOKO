const { Moralis } = require('../../libs/moralis');

class Address extends Moralis.Object {
  constructor() {
    super('Address');
  }
}

Moralis.Object.registerSubclass('Address', Address);

module.exports = Address;
