import { readdir, writeFile } from 'node:fs/promises';
import { join } from 'node:path';
import * as showdown from 'showdown';


const transcripts = join(__dirname, '../docs/transcript');
const previews = require('../resource/preview.json');
const doc = join(__dirname, '../docs/transcript_tree.md');
const debug = require('debug')('all_ears_english:build_docs');

let poster = '';
let body = '';

async function main() {
  const r = await readdir(transcripts);
  const unsortedFilenames = r.map(file => file.split('.')[0]);
  debug('unsorted %d', unsortedFilenames.length);
  const keys = Object.keys(previews);
  const filenames = [];
  for (const key of keys) {
    if (unsortedFilenames.includes(key)) {
      const index = unsortedFilenames.findIndex(el => el === key);
      unsortedFilenames.splice(index, 1);
      debug('check unsorted %d', unsortedFilenames.length);
      filenames.push(key);
    }

    if (unsortedFilenames.length <= 0) {
      break;
    }
  }

  debug('sorted %d', filenames.length);
  poster = `![]()\n\n`;

  for (const name of filenames) {
    body += `* [${previews[name].name}](transcript/${name}.txt) - ${previews[name].release_date}`;
    body += ` - [🔗](https://aee.gofloat.cn/transcript/${name}) - [📥](${previews[name].download_url})\n`;
    body += `    - ${previews[name].description}\n\n`;
  }

  await writeFile(doc, poster + body);
  const s = new showdown.Converter();
  const html = s.makeHtml(poster + body);
  const prefix =
    '<!DOCTYPE html>\n' +
    '<html lang="en">\n' +
    '<head>\n' +
    '  <meta charset="UTF-8">\n' +
    '  <title>Title</title>\n' +
    '</head>\n' +
    '<body><div>';
  const postfix =
    '</div></body>\n' +
    '</html>';
  await writeFile(doc.replace('.md', '.html'), prefix + html + postfix);

}


main().then();
