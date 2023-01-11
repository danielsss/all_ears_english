import puppeteer from 'puppeteer';
import { timeout } from '../utils';
import * as fs from 'fs';
import * as path from 'path';

const debug = require('debug')('all_ears_english:puppy');
const previews = require('../../resource/preview.json');
const json = path.join(__dirname, '../../resource/preview.json');

const address = async (id: string, url: string, browser): Promise<Record<any, any>> => {
  const page = await browser.newPage();
  await page.goto(url, { waitUntil: 'networkidle0' });
  const buttons = await page.$('button[data-testid="play-button"]');
  let addr = '';
  page.on('request', intercepted => {
    if (intercepted.url().includes('.mp3?key=')) {
      debug(intercepted.url());
      addr = intercepted.url();
    }
  });
  if (!buttons || !buttons.click) {
    return {};
  }
  await buttons.click();
  await timeout(1000 * 10);
  await page.close();
  debug({[id]: addr});
  return {[id]: addr};
}


const main = async function () {
  const browser = await puppeteer.launch();
  let tasks = [];
  let count = 0;
  for (const id in previews) {
    if (previews[id].download_url) {
      continue;
    }
    tasks.push(address(id, previews[id].external_url, browser));
    count++;
    if (count === 5) {
      const results = await Promise.all(tasks);
      for (const item of results) {
        const keys = Object.keys(item);
        if (keys.length === 0) continue;
        previews[keys[0]]['download_url'] = item[keys[0]];
      }
      fs.writeFileSync(json, JSON.stringify(previews, null, 2));
      count = 0;
      tasks = [];
    }

  }
  const results = await Promise.all(tasks);
  for (const [key, val] of Object.entries(results)) {
    previews[key].download_url = val;
  }
  fs.writeFileSync(json, JSON.stringify(previews, null, 2));
  await browser.close();
}

main().then();
