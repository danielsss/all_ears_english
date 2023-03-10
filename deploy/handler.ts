import { Application, Router } from "https://deno.land/x/oak/mod.ts";
import * as fs from 'https://deno.land/std@0.177.0/node/fs.ts';
import * as path from 'https://deno.land/std@0.177.0/node/path/mod.ts';
import { compileTranscript } from './render.ts';

const __dirname = path.dirname(path.fromFileUrl(import.meta.url));
const app = new Application();
const router = new Router();

const transcript = async (ctx) => {
  const transcriptId = ctx?.params?.transcriptId;
  const txt = path.join(__dirname, `../docs/transcript/${transcriptId}.txt`);
  console.info('checking ... %s', txt);
  const decoder = new TextDecoder('utf-8');
  const contents = await Deno.readFile(txt);
  const decoded = decoder.decode(contents).split('\n');
  const conversation = [];
  for (let i = 0; i < decoded.length; i++) {
    if (!decoded[i]) {
      continue;
    }
    const re = /\d:\d\d:\d\d/;
    if (re.test(decoded[i])) {
      conversation.push({ timeline: decoded[i], content: decoded[i + 1] });
      i += 1;
    }
  }

  ctx.response.body = await compileTranscript({ name: 'abc', conversation });
}

router.get('/transcript/:transcriptId', transcript);

app.use(router.routes());
app.use(router.allowedMethods());

app.addEventListener('listen', ({ hostname, port }) => {
  console.info('Server is running on %s:%d', hostname, port);
});

await app.listen({ port: parseInt(Deno.env.get('HTTP_PORT'), 10) || 8000 }).catch(console.error);
