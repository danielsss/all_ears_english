import { MongoClient } from 'https://deno.land/x/mongo@v0.31.1/mod.ts';

const MONGO_DB_URL = Deno.env.get('MONGO_DB_URL');

try {
  const client = new MongoClient();
  await client.connect(MONGO_DB_URL, { useNewUrlParser: true });
} catch (err) {
  console.error('Error connecting to MongoDB', err);
  throw err;
}

export const getPhrases = async function () {
  const phrases = client.database('smt').collection('phrases');
  return phrases.find();
}
