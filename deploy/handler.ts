import { serve } from 'https://deno.land/std@0.140.0/http/server.ts';
import * as path from 'https://deno.land/std@0.177.0/node/path.ts';
import { router } from 'https://crux.land/router@0.0.5';
import { getPhrases } from './db/mongodb.ts';

const treeHandler = async function (request: Request): Promise<Response> {
  const __dirname = path.dirname(path.fromFileUrl(import.meta.url));
  const tree = path.join(__dirname, '../docs/transcript_tree.html');
  const decoder = new TextDecoder('utf-8');
  const contents = await Deno.readFile(tree);
  return new Response(decoder.decode(contents), {
    headers: { 'content-type': 'text/html; charset=utf-8' }
  });
}

const phraseHandler = async function (request: Request): Promise<Response> {
  const phrases = await getPhrases();
  return new Response(JSON.stringify(phrases || {}), {
    headers: { 'content-type': 'application/json; charset=utf-8' }
  });
}


const handler = router({
  'GET@/api/v1/phrases': phraseHandler,
  'GET@/transcript/tree.html': treeHandler,
});

serve(handler);
