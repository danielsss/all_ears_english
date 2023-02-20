import { serve } from 'https://deno.land/std@0.140.0/http/server.ts';
import * as path from 'https://deno.land/std@0.177.0/node/path.ts';
import * as fs from 'https://deno.land/std@0.177.0/node/fs.ts';
import { router } from 'https://crux.land/router@0.0.5';

const treeHandler = async function (request: Request): Promise<Response> {
  const __dirname = path.dirname(path.fromFileUrl(import.meta.url));
  const tree = path.join(__dirname, '../docs/transcript_tree.html');
  return new Response(fs.readFileSync(tree, 'utf-8'), {
    headers: { 'content-type': 'text/html; charset=utf-8' }
  });
}

const memoryHandler = async function () {
  return new Response(JSON.stringify(Deno.memoryUsage(), 2, null), {
    headers: { 'content-type': 'application/json; charset=utf-8' }
  });
}

const handler = router({
  'GET@/memory': memoryHandler,
  'GET@/transcript/tree.html': treeHandler,
});

serve(handler);
