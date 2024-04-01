//Query 1 How many tweets are not retweets or replies?

import { MongoClient } from 'mongodb';

/*
 * Requires the MongoDB Node.js Driver
 * https://mongodb.github.io/node-mongodb-native
 */

const agg = [
  {
    '$match': {
      '$or': [
        {
          'retweeted_status': {
            '$exists': false
          }
        }, {
          'retweeted_status': null
        }
      ]
    }
  }, {
    '$count': 'string'
  }
];

const client = await MongoClient.connect(
  'mongodb://localhost:27017/'
);
const coll = client.db('ieeevisTweets').collection('tweet');
const cursor = coll.aggregate(agg);
const result = await cursor.toArray();
await client.close();