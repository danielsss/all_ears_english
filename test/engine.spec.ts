import Engine from '../src/engine';
import { describe, it } from 'mocha';
import { expect } from 'chai';

describe('# Engine Unit Test', function () {
  this.timeout(1000 * 10);/**/
  const engine = new Engine();
  const showId = '6qXldSz1Ulq1Nvj2JK5kSR';

  it('- token', async () => {
    const n = await engine.count(showId);
    engine.episodeCount = n;
    expect(n).to.be.a('number');
  });


  it('- episodes', async () => {
    const limit = 10;
    let offset = engine.episodeCount - limit;
    let episodes = await engine.episodes(showId, limit, offset);
    expect(episodes).to.be.an('object');
    engine.episodeCount = offset;
    offset = engine.episodeCount - limit;
    episodes = await engine.episodes(showId, limit, offset);
    expect(episodes).to.be.an('object');
  });
});
