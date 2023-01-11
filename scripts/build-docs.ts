import { readdir, writeFile } from 'node:fs/promises';
import { join } from 'node:path';


const transcripts = join(__dirname, '../docs/transcript');
const previews = require('../resource/preview.json');
const doc = join(__dirname, '../docs/transcript_tree.md');

let poster = '';
let body = '';

async function main() {
  const r = await readdir(transcripts);
  const unsortedFilenames = r.map(file => file.split('.')[0]);

  const keys = Object.keys(previews);
  const filenames = [];
  for (const key of keys) {
    if (unsortedFilenames.includes(key)) {
      const index = unsortedFilenames.findIndex(el => el === key);
      unsortedFilenames.splice(index, 1);
    }

    filenames.push(key);
    if (unsortedFilenames.length <= 0) {
      break;
    }
  }

  poster = `![](${previews[filenames[0]].images[0].url})\n\n`;

  for (const name of filenames) {
    body += `* [${previews[name].name}](transcript/${name}.docx) - ${previews[name].release_date}`;
    body += ` - [🔗](${previews[name].external_url}) - [📥](${previews[name].download_url})\n`
  }

  await writeFile(doc, poster + body);
}


main().then();
