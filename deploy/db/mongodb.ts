import { MongoClient } from 'https://deno.land/x/mongo@v0.31.1/mod.ts';

try {
  const client = new MongoClient();
  await client.connect({
    db: Deno.env.get('MONGODB_DATABASE'),
    tls: true,
    servers: [
      {
        host: Deno.env.get('MONGODB_HOST'),
        port: Deno.env.get('MONGODB_PORT') || 27017,
      },
    ],
    credential: {
      username: Deno.env.get('MONGODB_USERNAME'),
      password: Deno.env.get('MONGODB_PASSWORD'),
      db: Deno.env.get('MONGODB_DATABASE'),
      mechanism: 'SCRAM-SHA-1',
    }
  });
} catch (err) {
  console.error('Error connecting to MongoDB', err);
  throw err;
}

export const getPhrases = async function () {
  const phrases = client.database('smt').collection('phrases');
  return phrases.find();
}
