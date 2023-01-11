import { readdir, writeFile } from 'node:fs/promises';
import { join } from 'node:path';


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
  poster = `![](https://www.allearsenglish.com/wp-content/uploads/2020/05/Team-Image-Blob-3-1.png)\n\n`;

  for (const name of filenames) {
    body += `* [${previews[name].name}](transcript/${name}.docx) - ${previews[name].release_date}`;
    body += ` - [🔗](${previews[name].external_url}) - [📥](${previews[name].download_url})\n`
  }

  await writeFile(doc, poster + body);
}


main().then();
