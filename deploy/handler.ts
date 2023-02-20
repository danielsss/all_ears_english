import { serve } from 'https://deno.land/std@0.140.0/http/server.ts';
import makeloc from 'https://x.nest.land/dirname@v1.1.2/mod.ts';
import * as path from "https://deno.land/std@0.177.0/node/path.ts";
import * as fs from "https://deno.land/std@0.177.0/node/fs.ts";

const { __dirname } = makeloc(import.meta);


const handleRequest = async function (request: Request): Promise<Response> {
  const tree = path.join(__dirname, '../docs/transcript_tree.html');
  return new Response(fs.readFileSync(tree, 'utf-8'), {
    headers: { 'content-type': 'text/html; charset=utf-8' }
  });
}


serve('/transcript/tree.html', handleRequest);
