const { database } = require('.');

class Entity {
  constructor(collectionName) {
    this.instance = database().collection(collectionName);
  }

  insertOne(data) {
    return this.instance.insertOne(data);
  }

  updateOne(query, data) {
    return this.instance.updateOne(query, {
      $set: data
    });
  }

  findOne(query) {
    return this.instance.findOne(query);
  }

  find(query) {
    return this.instance.find(query).toArray();
  }
}

module.exports = Entity;
