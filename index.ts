import fs from 'fs'
import { config } from './config';
const colors = require('colors');

let cheerio = require('cheerio');
const htmlparser2 = require('htmlparser2');
console.log('●'.blue + ' parsing files')
let cParse = require('transform-css-to-js');
let hello: Array<string>;
try {
    hello = fs.readdirSync(config.rootDir || './', 'utf-8');
} catch (err) {
    throw 'Root directory stated in config not found.'
}
const files: Array<string> = [];

hello.forEach(file => {
    if (file.includes('.vide')) {
        files.push(file)
    } else {
        return;
    }
});
if (files.length == 0) {
    throw 'No files for compiling.'
}
let CSS: Array<any> = [];
let dom: Array<any> = [];
let raw: Array<any> = [];
let $$: Array<any> = [];
for (let i = 0; i < files.length; i++) {
    let point: string = files[i]
    let file: string;
    if (config.rootDir != undefined) {
        file = fs.readFileSync(config.rootDir + '/' + point, 'utf-8').trim()
    } else {
        file = fs.readFileSync('./' + point, 'utf-8').trim()
    }
    const DOM = htmlparser2.parseDOM(file);
    const $ = cheerio.load(DOM);
    dom.push($('Vide *'));
    $.prototype.name = point
    raw.push($);
    let Css = $('Vide').clone().children().remove().end().text().trim();
    let str = cParse(Css);
    CSS.push({ name: point, css: JSON.parse(str) });
    const clean = htmlparser2.parseDOM(file);
    let compE = cheerio.load(clean);
    compE.prototype.name = point;
    $$.push(compE)
}
export let Css = CSS;

export let Dom = dom;

export let $ = raw;
export let Clean = $$;
