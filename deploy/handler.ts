import { Application, Router } from 'https://deno.land/x/oak/mod.ts';
import { compile } from './render.ts';
import { orderBy } from 'https://raw.githubusercontent.com/lodash/lodash/4.17.21-es/lodash.js';
import { exists } from './utils.ts';
import * as path from 'https://deno.land/std@0.177.0/node/path/mod.ts';
import preview from '../resource/preview.json' assert { type: 'json' };

const __dirname = path.dirname(path.fromFileUrl(import.meta.url));
const app = new Application();
const router = new Router();

const preface = async (ctx) => {
  const dir = path.join(__dirname, '../docs/transcript');
  const indexOptions = [];
  for await (const entry of Deno.readDir(dir)) {
    const id = entry.name.split('.')[0];
    indexOptions.push({
      id, transcript_href: `https://aee.gofloat.cn/transcript/${id}`,
      name: preview[id].name, release_date: preview[id].release_date,
      playback: preview[id].download_url,
    });
  }
  ctx.response.body = await compile('index', {
    title: 'Transcript Guide', indexOptions: orderBy(indexOptions, ['release_date'])
  });
}

const transcript = async (ctx) => {
  const transcriptId = ctx?.params?.transcriptId;
  const txt = path.join(__dirname, `../docs/transcript/${transcriptId}.txt`);
  if (!(await exists(txt))) {
    console.info('checking ... %s', txt);
    return ctx.response.body = 'Invalid parameter';
  }
  const decoder = new TextDecoder('utf-8');
  const contents = await Deno.readFile(txt);
  let decoded = decoder.decode(contents).split(/(?=\d:\d\d:\d\d)|(?<=\d:\d\d:\d\d)/g);
  decoded = decoded.filter(e => e);
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

  ctx.response.body = await compile('template', { title: 'Transcript Content', conversation });
}

router.get('/transcript/:transcriptId', transcript);
router.get('/index.html', preface);
router.get('/', preface);

app.use(async (ctx, next) => {
  const extensions = (ctx.request.url.pathname || '').split('.');
  const suffix = extensions[1];
  const suffixes = ['ico', 'json'];
  if (suffixes.includes(suffix)) {
    return ctx.send({
      root: path.join(__dirname, '../resource/'),
      index: ctx.request.url.pathname
    });
  }

  await next();
});

app.use(router.routes());
app.use(router.allowedMethods());

app.addEventListener('listen', ({ hostname, port }) => {
  console.info('Server is running on %s:%d', hostname, port);
});

await app.listen({ port: parseInt(Deno.env.get('HTTP_PORT'), 10) || 8000 }).catch(console.error);
