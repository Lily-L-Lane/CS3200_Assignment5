//Query 4: Who are the top 10 people that got more retweets in average, after tweeting more than 3 times

import { MongoClient } from 'mongodb';

/*
 * Requires the MongoDB Node.js Driver
 * https://mongodb.github.io/node-mongodb-native
 */

const agg = [
  {
    '$group': {
      '_id': '$user.id', 
      'totalTweets': {
        '$sum': 1
      }, 
      'totalRetweets': {
        '$sum': {
          '$ifNull': [
            '$retweeted_status.retweet_count', 0
          ]
        }
      }
    }
  }, {
    '$match': {
      'totalTweets': {
        '$gt': 3
      }
    }
  }, {
    '$project': {
      '_id': 1, 
      'averageRetweets': {
        '$divide': [
          '$totalRetweets', '$totalTweets'
        ]
      }
    }
  }, {
    '$sort': {
      'averageRetweets': -1
    }
  }, {
    '$limit': 10
  }
];

const client = await MongoClient.connect(
  'mongodb://localhost:27017/'
);
const coll = client.db('ieeevisTweets').collection('tweet');
const cursor = coll.aggregate(agg);
const result = await cursor.toArray();
await client.close();