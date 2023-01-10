const debug = require('debug')('all_ears_english:utils');

/**
 * Return a completed url
 * @param { String } orig
 * @param { Record } options
 * @return { String }
 */
const urllib = (orig: string, options: Record<string, any>): string => {
  if (!orig || typeof orig !== 'string') {
    return orig;
  }

  if (!options || Object.keys(options).length <= 0) {
    return orig;
  }

  for (const key in options) {
    orig = orig.replace(`{${key}}`, options[key]);
  }
  debug(orig);
  return orig;
}


export { urllib };
