import * as dotenv from 'dotenv';
import * as process from 'process';

dotenv.config();

export const CLIENT_ID = process.env['CLIENT_ID'] || '';
export const CLIENT_SECRET = process.env['CLIENT_SECRET'] || '';

export const CLIENT_TOKEN_INTERFACE = process.env['TOKEN_INTERFACE'] || '';

export const CLIENT_DEFAULT_REGION = process.env['DEFAULT_REGION'] || '';

export const BASIC_API = process.env['BASIC_API'] || '';

export const SHOW_INTERFACE = process.env['SHOW_INTERFACE'] || '';

export const EPISODE_INTERFACE = process.env['EPISODE_INTERFACE'] || '';
