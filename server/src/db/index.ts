import { MongoClient, Db } from 'mongodb';

let db: Db;

export const connectDB = () =>
  new Promise((resolve, reject) => {
    const client = new MongoClient(process.env.MONGODB_URL);

    client.connect((err) => {
      if (err) {
        console.error(err);
        reject(err);
      }
      console.log('DB connected');
      db = client.db(process.env.DB_NAME);

      /** db indexes */
      db.collection('nfts').createIndex({ token_id: 1, token_address: 1 });
      db.collection('nfts').createIndex(
        { name: 'text', 'metadata.name': 'text' },
        {
          name: 'text_search',
          default_language: 'en',
          language_override: 'en',
        },
      );
      db.collection('address').createIndex({ address: 1 });
      db.collection('collections').createIndex({ token_address: 1 });
      db.collection('collection_transactions').createIndex({ transaction_hash: 1 });
      /*******************************/
      resolve(client);
    });
  });

export const database = () => db;
