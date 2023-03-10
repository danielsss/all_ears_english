import HandlebarsJS from 'https://esm.sh/handlebars@4.7.6';
import * as path from 'https://deno.land/std@0.177.0/node/path/mod.ts';

const __dirname = path.dirname(path.fromFileUrl(import.meta.url));

export const compile = async (name = 'template', options: Record<any, any>) => {
  const hbs = path.join(__dirname, `../docs/${name}.hbs`);
  const template = HandlebarsJS.compile(
    new TextDecoder('utf-8')
      .decode(await Deno.readFile(hbs))
  );
  return template(options);
}
