import * as fs from 'fs';
import * as path from 'path';

const Downloader = require('nodejs-file-downloader');
const previews = require('../../resource/preview.json');
const downloadedPath = path.join(__dirname, '../../resource/downloaded.json');
const keys = Object.keys(previews);
const directory = path.join(__dirname, '../../resource/');
const debug = require('debug')('all_ears_english:downloader');

if (!fs.existsSync(downloadedPath)) {
  const map = {};
  for (const key of keys) {
    map[key] = 0;
  }
  fs.writeFileSync(downloadedPath, JSON.stringify(map, null, 2));
}

const downloaded = require('../../resource/downloaded.json');

async function main() {
  let progress = null;
  let downloadKeys = Object.keys(downloaded);
  let tasks = [];
  let ids = [];
  for (let i = 0; i < downloadKeys.length; i++) {
    if (downloaded[downloadKeys[i]] === 1) {
      continue;
    }
    const downloader = new Downloader({
      url: previews[downloadKeys[i]].download_url,
      directory,
      onBeforeSave(finalName: string): string | void {
        let name = previews[downloadKeys[i]].name;
        if (name.includes(':')) {
          const arr = name.split(':');
          name = arr[0].split(' ').join('_');
        }
        return name + '.mp3';
      },
      onProgress: function (percentage, chunk, remainingSize) {
        //Gets called with each chunk.
        debug('% ', percentage);
        debug('%s Remaining bytes: ', previews[downloadKeys[i]].name, remainingSize);
      }
    });
    tasks.push(downloader.download());
    ids.push(downloadKeys[i]);
    if (tasks.length === 5) {
      break;
    }
  }

  await Promise.all(tasks);

  for (const id of ids) {
    downloaded[id] = 1;
  }

  fs.writeFileSync(downloadedPath, JSON.stringify(downloaded, null, 2));
}

main().then();
