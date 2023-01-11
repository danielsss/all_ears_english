import Engine from '../engine';
import * as fs from 'fs';
import * as path from 'path';

const FILE_PATH = path.join(__dirname, '../../resource/preview.json');

async function main() {
  const map = {};
  const engine = new Engine();
  const showId = '6qXldSz1Ulq1Nvj2JK5kSR';
  await engine.count(showId);
  let limit = 50;
  async function request(offset: number, l: number) {
    const episodes = await engine.episodes(showId, l, offset);
    for (const item of episodes.items) {
      map[item.id] = {
        name: item.name,
        external_url: item.external_urls.spotify,
        description: item.description,
        release_date: item.release_date,
        images: item.images
      };
    }
  }
  while (engine.episodeCount - limit > 0) {
    const offset = engine.episodeCount - limit;
    await request(offset, limit);
    engine.episodeCount = offset;
  }

  if (engine.episodeCount < limit) {
    await request(0, engine.episodeCount);
  }
  fs.writeFileSync(FILE_PATH, JSON.stringify(map, null, 2));
  return null;
}


main().then(() => { process.exit(0) });
