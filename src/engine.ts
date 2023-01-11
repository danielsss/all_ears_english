import axios from 'axios';
import {
  BASIC_API,
  CLIENT_DEFAULT_REGION,
  CLIENT_ID,
  CLIENT_SECRET,
  CLIENT_TOKEN_INTERFACE,
  SHOW_INTERFACE,
  EPISODE_INTERFACE
} from './constants';
import { urllib } from './utils';

const debug = require('debug')('all_ears_english:engine');

export interface TokenResponse {
  access_token: string;
  token_type?: string;
  expires_in?: number;
}


class Engine {

  public episodeCount: number = 0;

  protected expired: boolean = true;

  protected t: TokenResponse;

  constructor() {}

  /**
   * List out episodes
   * @param id
   * @param limit
   * @param offset
   */
  public async episodes(id: string, limit: number, offset: number) {
    const options = {id, limit, offset, region: CLIENT_DEFAULT_REGION };
    const url = urllib(`${BASIC_API}${EPISODE_INTERFACE}`, options);
    const tokenBody = await this.token();
    const executor = (response) => {
      if (response.status !== 200) {
        return 0;
      }
      response.data.items = response.data.items.reverse();
      return response.data;
    };
    return axios.get(url, { headers: this.header(tokenBody.access_token)})
      .then(executor);
  }

  /**
   * Count the amount of shows
   * @param { String } id - Only supports id of shows
   * @return { Promise<Number> }
   */
  public async count(id: string): Promise<number> {
    const options = {id, region: CLIENT_DEFAULT_REGION };
    const url = `${BASIC_API}${SHOW_INTERFACE}`;
    const tokenBody = await this.token();
    const executor = (response) => {
      if (response.status !== 200) {
        return 0;
      }
      this.episodeCount = response.data.total_episodes;
      return response.data.total_episodes;
    };
    return axios.get<number>(urllib(url, options), { headers: this.header(tokenBody.access_token) })
      .then(executor);
  }


  /**
   * @return { Promise<TokenResponse> }
   */
  public async token(): Promise<TokenResponse> {
    if (!this.expired) {
      debug('using old token %s', this.t.access_token);
      return this.t;
    }
    const contentType = 'application/x-www-form-urlencoded';
    const headers = {
      'Authorization': this.authorization(),
      'Content-Type': contentType
    };
    const options = { grant_type: 'client_credentials' };
    const executor = (response) => {
      debug(response.status, response.statusText);
      if (response.status !== 200) {
        return null;
      }
      setTimeout(() => { this.expired = true }, 1000 * 60 * 60 - 10);
      this.t = response.data;
      this.expired = false;
      return response.data;
    };
    return axios.post<TokenResponse>(CLIENT_TOKEN_INTERFACE, options,{ headers })
      .then(executor);
  }

  /**
   * Generate authorized headers
   * @param { String } token
   * @private
   * @return
   */
  private header(token: string) {
    return {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    };
  }

  /**
   * Generate a basic authorization string
   * @private
   * @return { String }
   */
  private authorization(): string {
    const key = `${CLIENT_ID}:${CLIENT_SECRET}`;
    const base64 = Buffer.from(key).toString('base64');
    return `Basic ${base64}`;
  }
}


export default Engine;
