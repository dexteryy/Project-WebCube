const path = require('path');
const fs = require('fs');
const { ensureFileSync } = require('fs-extra');
const { merge } = require('lodash');
const changeCase = require('change-case');
const cosmiconfig = require('cosmiconfig');
const logger = require('../logger');

const projectPath = process.cwd();

let custom = {};
const pkg = require(path.join(projectPath, `package.json`));
const projectName = pkg.name;
const { config: browserslist } = cosmiconfig('browserslist').searchSync();
const { config: customConfig } = cosmiconfig('webcube').searchSync();
custom = merge(custom, customConfig);

// https://medium.com/webpack/webpack-4-mode-and-optimization-5423a6bc597a
const mode =
  process.env.NODE_ENV === 'production' ? 'production' : 'development';
const isProductionEnv = process.env.NODE_ENV === 'production';
const webcubePath = custom.webcubePath
  ? path.resolve(projectPath, custom.webcubePath)
  : path.join(__dirname, '../../');
const srcRoot = path.join(projectPath, custom.srcRoot || 'src');
const configRoot = path.join(projectPath, custom.configRoot || 'config');
const entryFileName = custom.entryFileName || [
  'Entry.jsx',
  'Entry.js',
  'App.jsx',
  'App.js',
  'Entry.tsx',
  'Entry.ts',
  'App.tsx',
  'App.ts',
];
const entryFileTemplate = custom.entryFileTemplate
  ? path.join(configRoot, custom.entryFileTemplate)
  : path.join(webcubePath, 'boilerplate/entry.js');
const config = {
  mode,
  isProductionEnv,
  projectName,
  projectPath,
  webcubePath,
  srcRoot,
  configRoot,
  entryFileName,
};

// https://github.com/browserslist/browserslist
config.browserslist = browserslist ||
  custom.browserslist || ['last 1 version', '> 1%', 'not ie <= 8', 'not dead'];

const entryNameToId = name => {
  const letters = name.split(/[-_]/);
  if (letters.length === 1) {
    return letters.join('');
  }
  return changeCase.pascalCase(letters.join(' '));
};
const entryFileTemplateContent = fs.readFileSync(entryFileTemplate);
const exportsFileTemplateContent = fs.readFileSync(
  path.join(webcubePath, 'boilerplate/exports.js')
);

config.entries = merge({}, custom.entries);
if (!custom.entries) {
  fs.readdirSync(srcRoot).forEach(name => {
    config.entries[name] = name;
  });
}

const entries = {};
const ssrEntries = {};
Object.keys(config.entries).forEach(name => {
  const fullPath = path.join(srcRoot, name);
  let isFullPathOk = false;
  try {
    isFullPathOk = fs.statSync(fullPath).isDirectory();
  } catch (ex) {}
  if (isFullPathOk) {
    let entryFilePath;
    (Array.isArray(entryFileName) ? entryFileName : [entryFileName]).forEach(
      fileName => {
        const tryPath = path.join(fullPath, fileName);
        try {
          fs.accessSync(tryPath);
          if (!entryFilePath) {
            entryFilePath = tryPath;
          }
        } catch (ex) {}
      }
    );
    if (!entryFilePath) {
      entries[name] = fullPath;
      return;
    }
    const entryId = entryNameToId(name);
    const internalEntryFileName = path.join(
      projectPath,
      `node_modules/.webcube/boilerplate/${entryId}.js`
    );
    ensureFileSync(internalEntryFileName);
    fs.writeFileSync(
      internalEntryFileName,
      entryFileTemplateContent
        .toString()
        .replace(/WebcubePlaceholderForEntryApp/gi, entryId)
        .replace(
          /WebcubePlaceholderForEntryPath/gi,
          path.relative(path.dirname(internalEntryFileName), entryFilePath)
        )
        .replace(
          /WebcubePlaceholderForBaseUrl/gi,
          JSON.stringify(name === projectName ? '' : `/${name}`)
        )
    );
    entries[name] = internalEntryFileName;
    const internalExportsFileName = path.join(
      projectPath,
      `node_modules/.webcube/boilerplate/exports_${entryId}.js`
    );
    ensureFileSync(internalExportsFileName);
    fs.writeFileSync(
      internalExportsFileName,
      exportsFileTemplateContent
        .toString()
        .replace(/WebcubePlaceholderForEntryApp/gi, entryId)
        .replace(
          /WebcubePlaceholderForEntryPath/gi,
          path.relative(path.dirname(internalEntryFileName), entryFilePath)
        )
    );
    ssrEntries[name] = internalExportsFileName;
  }
});
config.entries = entries;
config.ssrEntries = ssrEntries;

Object.keys(entries).forEach(entry => {
  if (!/^[a-zA-Z][a-zA-Z0-9-_]*$/.test(entry)) {
    logger.fail(
      `Invalid entry name "${entry}". It must be a dash separated string, underscore separated string, camel case string or pascal case string, the first character must be an ASCII letter`
    );
  }
});

module.exports = { config, custom, entryNameToId };
