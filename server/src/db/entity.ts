import { Collection, Filter, Document } from 'mongodb';
import { database } from '.';

class Entity {
  instance: Collection;

  constructor(collectionName: string) {
    this.instance = database().collection(collectionName);
  }

  insertOne(data: any) {
    return this.instance.insertOne(data);
  }

  updateOrInsertOne(query: Filter<any>, data: any) {
    return this.instance.updateOne(query, { $set: data }, { upsert: true });
  }

  updateOne(query: Filter<any>, data: any) {
    return this.instance.updateOne(query, {
      $set: data,
    });
  }

  findOne(query: Filter<any>) {
    return this.instance.findOne(query);
  }

  find(query: Filter<Document>) {
    return this.instance.find(query).toArray();
  }

  deleteOne(query: Filter<Document>) {
    return this.instance.deleteOne(query);
  }

  deleteMany(query: Filter<Document>) {
    return this.instance.deleteMany(query);
  }
}

export default Entity;
