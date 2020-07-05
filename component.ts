import {Clean} from './index';
import {Components} from './html';
import {config} from './config';
const colors = require('colors');
import fs from 'fs';
const comps: Array<any> = Components;
const keys = Object.keys(comps);
const valid: Array<any> = [];
console.log('●'.blue + ' Compiling components');
Clean.forEach($ => {
  const comps = $('component');
  Object.keys(comps).forEach(compKey => {
    const attrs: any = comps[compKey].attribs;
    if (attrs == undefined) {
      return;
    } else {
      attrs.from = $.prototype.name;
      valid.push(attrs);
    }
  });
});

valid.forEach((attr: any) => {
  const comp = comps[attr.name];
  comp.from = attr.from;
  console.log('   ●'.blue + ` Built component named: ${attr.name}`);
});

//import
Clean.forEach(($: any, Num) => {
  $('import')
    .get()
    .forEach((el: any) => {
      const req: string = el.attribs.name;
      const data = comps[req];
      if (data.attribs.type == 'css') {
        const fullTemp = `
/* From ${data.attribs.name} in file ${data.from}*/
${data.innerText}`;
        $.prototype.name = $.prototype.name.split('.vide')[0];
        if (config.outDir == undefined) {
          let origin = '';
          if (fs.existsSync(`./css-${$.prototype.name}.css`)) {
            origin = fs.readFileSync(`./css-${$.prototype.name}.css`, 'utf-8');
            fs.unlinkSync(`./css-${$.prototype.name}.css`);
          }
          fs.writeFileSync(
            `./css-${$.prototype.name}.css`,
            origin + '\n' + fullTemp
          );
        } else {
          let origin = '';
          if (fs.existsSync(config.outDir + `/css-${$.prototype.name}.css`)) {
            origin = fs.readFileSync(
              config.outDir + `/css-${$.prototype.name}.css`,
              'utf-8'
            );
            fs.unlinkSync(config.outDir + `/css-${$.prototype.name}.css`);
          }
          fs.writeFileSync(
            config.outDir + `/css-${$.prototype.name}.css`,
            origin + '\n' + fullTemp
          );
        }
      }
      if (data.attribs.type == 'html') {
        const inner = data
          .fullText(`component[name=${data.attribs.name}]`)
          .html();
        const Import = $(`import[name=${data.attribs.name}]`);
        const renderString =
          $.html(Import).trim().split('</import>')[0] + '</import>';
        $.prototype.name = $.prototype.name.split('.vide')[0];
        let origin;
        let path;
        if (config.outDir == undefined) {
          path = './' + $.prototype.name + '.html';
          origin = fs.readFileSync(path, 'utf-8');
        } else {
          path = config.outDir + '/' + $.prototype.name + '.html';
          origin = fs.readFileSync(path, 'utf-8');
        }
        const render = origin.replace(new RegExp(renderString, 'g'), inner);
        fs.writeFileSync(path, render);
      }
    });
});
console.log('   ●'.blue + ' Rendered imports');
