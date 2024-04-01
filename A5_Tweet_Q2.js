//Query2: Return the top 10 screen_names by their number of followers.
import { MongoClient } from 'mongodb';

/*
 * Requires the MongoDB Node.js Driver
 * https://mongodb.github.io/node-mongodb-native
 */

const filter = {};
const projection = {};
const sort = {
  'user.followers_count': -1
};
const collation = {};
const limit = 10;

const client = await MongoClient.connect(
  'mongodb://localhost:27017/'
);
const coll = client.db('ieeevisTweets').collection('tweet');
const cursor = coll.find(filter, { projection, sort, collation, limit });
const result = await cursor.toArray();
await client.close();