//Query 5: Write the instructions that will separate the Users information into a different collection
//Create a user collection that contains all the unique users.
//Create a new Tweets_Only collection, that doesn't embed the user information, but instead references it using the user id

import { MongoClient } from 'mongodb';

/*
 * Requires the MongoDB Node.js Driver
 * https://mongodb.github.io/node-mongodb-native
 */

const UserAgg = [
  {
    '$group': {
      '_id': '$user.id', 
      'username': {
        '$first': '$user.name'
      }
    }
  }, {
    '$merge': {
      'into': 'Users', 
      'on': '_id'
    }
  }
];

const TweetAgg = [
    {
      '$addFields': {
        'user_id': '$user.id', 
        'fields': {
          '$arrayToObject': {
            '$filter': {
              'input': {
                '$objectToArray': '$$ROOT'
              }, 
              'as': 'field', 
              'cond': {
                '$ne': [
                  '$$field.k', 'user'
                ]
              }
            }
          }
        }
      }
    }, {
      '$project': {
        'user': 0
      }
    }, {
      '$out': {
        'db': 'ieeevisTweets', 
        'coll': 'Tweets_Only'
      }
    }
  ];

const client = await MongoClient.connect(
  'mongodb://localhost:27017/'
);
const coll = client.db('ieeevisTweets').collection('tweet');
  
  const userCursor = coll.aggregate(UserAgg);
  await userCursor.toArray();
  
  const tweetCursor = coll.aggregate(TweetAgg);
  await tweetCursor.toArray();
  
  await client.close();