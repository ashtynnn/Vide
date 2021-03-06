import fs from 'fs';
import { config } from './config';
import { exit } from 'process';

const cheerio = require('cheerio');
const htmlparser2 = require('htmlparser2');
const chalk = require('chalk');
console.log(`${chalk.blue('●')} parsing files`);

const cParse = require('transform-css-to-js');

let hello: Array<string>;
try {
  hello = fs.readdirSync(config.rootDir || './', 'utf-8');
} catch (err) {
  throw 'Root directory stated in config not found.';
}
const files: Array<string> = [];

hello.forEach((file) => {
  if (file.includes('.vide')) {
    files.push(file);
  } else {
  }
});
if (files.length === 0) {
  console.log('   ' + chalk.red('●') + ' No files for compiling');
  exit();
}
const CSS: Array<object> = [];
const dom: Array<object> = [];
const raw: Array<object> = [];
const $$: Array<object> = [];
for (let i = 0; i < files.length; i++) {
  const point: string = files[i];
  let file: string;
  if (config.rootDir !== undefined) {
    file = fs.readFileSync(`${config.rootDir}/${point}`, 'utf-8').trim();
  } else {
    file = fs.readFileSync(`./${point}`, 'utf-8').trim();
  }

  const DOM = htmlparser2.parseDOM(file);
  const $ = cheerio.load(DOM);
  dom.push($('Vide *'));
  $.prototype.name = point;
  raw.push($);
  if (!Object.keys($('Vide').get()[0].attribs).includes('script')) {
    const Css = $('Vide').clone().children().remove().end().text().trim();
    const str = cParse(Css);
    CSS.push({ name: point, css: JSON.parse(str) });
  }
  const clean = htmlparser2.parseDOM(file);
  const compE = cheerio.load(clean);
  compE.prototype.name = point;
  $$.push(compE);
}
export const Css = CSS;

export const Dom = dom;

export const $ = raw;
export const Clean = $$;
