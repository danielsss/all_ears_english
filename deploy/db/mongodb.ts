import { MongoClient, Collection } from 'https://deno.land/x/mongo@v0.31.1/mod.ts';
import { load } from 'https://deno.land/std@0.178.0/dotenv/mod.ts';
import { existsSync } from 'https://deno.land/std@0.177.0/node/fs.ts'
import * as path from 'https://deno.land/std@0.177.0/node/path/mod.ts';

const __dirname = path.dirname(path.fromFileUrl(import.meta.url));
const env = path.join(__dirname, '../../.env');
if (existsSync(env)) {
  await load({ envPath: env, export: true });
}

const client = new MongoClient();
try {
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
  }).then(() => {
    console.info('%s has been connected', Deno.env.get('MONGODB_HOST'));
  });
} catch (err) {
  console.error('Error connecting to MongoDB', err);
  throw err;
}

export const collection = function<T>(name: string): Collection<T> {
  if (!name) {
    throw new Error('should have a name of collection');
  }
  return client.database(Deno.env.get('MONGODB_DATABASE')).collection(name);
}

export const getPhrases = async function () {
  const phrases = client.database('smt').collection('phrases');
  return phrases.find().toArray();
}
