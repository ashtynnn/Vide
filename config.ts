// const path = require('path');
import path from 'path';
import fs from 'fs';
const dJSON = require('dirty-json');
const colors = require('colors');

console.log('●'.blue + ' Reading config');
let executable: Function;
const walkSync = (dir: string, filelist: Array<string> = []) => {
  fs.readdirSync(dir).forEach((file: string) => {
    filelist = fs.statSync(path.join(dir, file)).isDirectory()
      ? walkSync(path.join(dir, file), filelist)
      : filelist.concat(path.join(dir, file));
  });
  return filelist;
};
const dir = walkSync('.');
const supported: Array<string> = [];
for (let i = 0; i < dir.length; i++) {
  const file: string = dir[i];
  if (file.includes('videfile')) {
    supported.push(file);
  } else {
    const idk = true;
  }
}

if (supported.length > 1) {
  throw 'Two videfiles detected expected one.';
}
let Config;
const unproper: string = fs.readFileSync('./' + supported[0], 'utf-8');
if (unproper.includes('use non-standard')) {
  const lex: Array<string> = unproper.split('\n');
  lex.shift();
  const tokens: Array<Record<string, string>> = [];
  lex.forEach((tok, num) => {
    if (tok.includes('//')) {
      // let comment = tok.indexOf('//');
      lex.splice(num, 1);
    } else if (tok.includes('run {')) {
      const endLine: Array<string> = lex.filter((i: any) => {
        return i === '}';
      });
      const end = lex.indexOf(endLine[0]);
      const firstLine: Array<string> = lex.filter((i: any) => {
        return i === 'run {';
      })[0];
      const innerTokens = lex.slice(lex.indexOf(firstLine), end);
      innerTokens.splice(0, 1);
      const final: Array<string> = innerTokens.map(item => item.trim());
      const render: string = final.join('\n');
      executable = new Function(render);
    } else {
      const func: Array<string> = tok.split(' ');
      if (func[0] === '') {
        return;
      } else {
        const build: Record<string, any> = {
          func: func[0],
          args: func[1],
          line: num,
        };
        tokens.push(build);
      }
    }
  });
  const blank: object = {};
  for (let i = 0; i < tokens.length; i++) {
    const pointer: object = tokens[i];
    if (pointer.func === '}') {
      continue;
    } else {
      blank[pointer.func] = pointer.args;
    }
    // let truearg = pointer.args.replace(/"/g, '')
  }
  Config = blank;
} else {
  const proper = `{\n${unproper}\n}`;
  try {
    Config = dJSON.parse(proper);
  } catch (err) {
    throw 'Using non standard library in standard module.';
  }
}
export const config = Config;
export const run = executable;
